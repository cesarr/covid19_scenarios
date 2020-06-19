# -*- coding: utf-8 -*-
"""
Created on Tue Mar 31 15:21:34 2020

@author: metalcorebear
"""

from mesa import Model
from mesa.time import RandomActivation
from mesa.space import NetworkGrid
from mesa.datacollection import DataCollector
from mesa_SIR import SIR
import mesa_SIR.calculations_and_plots as c_p
from .agent import Denizen
# from networkx import scale_free_graph

import geopandas as gpd
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from shapely.geometry import Point, Polygon
import random

class BaileyPikeModel(Model):
    
    def __init__(self, parameters):
        super().__init__(Model)
        
        if parameters == None:
            parameters = {'population': 2380, 
                          'steps': 90, 
                          'ptrans': 0.25, 
                          'progression_period': 3, 
                          'social-distancing': '0.3', 
                          'mask-wearing': '0.33', 
                          'severe': 0.18, 
                          'immunity': 
                          '0.03', 
                          'I0': 0.01, 
                          'interactions': 12, 
                          'reinfection_rate': 0.0, 
                          'death_rate': 0.0193, 
                          'recovery_days': 21, 
                          'recovery_sd': 7, 
                          'progression_sd': 2
                         }
        else:
            parameter = int(parameters['population'])
        
            if parameter < 0 or parameter > 3000:  
                parameters['population'] = 2390
            else:
                parameters['population'] = parameter
            
            parameter = float(parameters['I0'])
        
            if parameter < 0 or parameter > 1:  
                parameters['I0'] = 0.01
            else:
                parameters['I0'] = parameter
            
            parameter = float(parameters['ptrans'])
        
            if parameter < 0 or parameter > 1:  
                parameters['ptrans'] = 0.25
            else:
                parameters['ptrans'] = parameter
            
            parameter = int(parameters['progression_period'])
        
            if parameter < 0 or parameter > 100:  
                parameters['progression_period'] = 3
            else:
                parameters['progression_period'] = parameter
            
            parameter = int(parameters['progression_sd'])
        
            if parameter < 0 or parameter > 100:  
                parameters['progression_sd'] = 2
            else:
                parameters['progression_sd'] = parameter
            
            parameter = int(parameters['interactions'])
        
            if parameter < 0 or parameter > 100:  
                parameters['interactions'] = 12
            else:
                parameters['interactions'] = parameter
            
            parameter = float(parameters['reinfection_rate'])
        
            if parameter < 0 or parameter > 1:  
                parameters['reinfection_rate'] = 0.00
            else:
                parameters['reinfection_rate'] = parameter
        
            parameter = float(parameters['death_rate'])
        
            if parameter < 0 or parameter > 1:  
                parameters['death_rate'] = 0.0193
            else:
                parameters['death_rate'] = parameter
        
            parameter = int(parameters['recovery_days'])
        
            if parameter < 0 or parameter > 100:  
                parameters['recovery_days'] = 21
            else:
                parameters['recovery_days'] = parameter
        
            parameter = int(parameters['recovery_sd'])
        
            if parameter < 0 or parameter > 100:  
                parameters['recovery_sd'] = 7
            else:
                parameters['recovery_sd'] = parameter
            
            parameter = float(parameters['severe'])
        
            if parameter < 0 or parameter > 1:  
                parameters['severe'] = 0.18
            else:
                parameters['severe'] = parameter
            
        self.susceptible = 0
        self.dead = 0
        self.recovered = 0
        self.infected = 0
        interactions = parameters['interactions']
        self.population = parameters['population']
        self.SIR_instance = SIR.Infection(self, ptrans = parameters['ptrans'],
                                          reinfection_rate = parameters['reinfection_rate'],
                                          I0= parameters["I0"],
                                          severe = parameters["severe"],
                                          progression_period = parameters["progression_period"],
                                          progression_sd = parameters["progression_sd"],
                                          death_rate = parameters["death_rate"],
                                          recovery_days = parameters["recovery_days"],
                                          recovery_sd = parameters["recovery_sd"])

        # G = scale_free_graph(self.population)
        G = SIR.build_network(interactions, self.population)
        self.grid = NetworkGrid(G)
        self.schedule = RandomActivation(self)
        self.dead_agents = []
        self.running = True

        ### load the geojson that contains the census tracts and population
        all_tracts = gpd.read_file('static/data/leon_tracts.geojson')
        
        # get list of random long lat points
        point_list = self.get_point_list(all_tracts, self.population, ['073'] )
        row_index = 0
        
        for node in range(self.population):
            denizen = Denizen(node, self) #what was self.next_id()
            denizen.census_tract_id = point_list.AFFGEOID.iloc[row_index]
            point = point_list.geometry.iloc[row_index]
            point
            denizen.lat = point.y
            denizen.lng = point.x
            self.grid.place_agent(denizen, node)
            self.schedule.add(denizen)
            row_index +=1

        self.datacollector = DataCollector(model_reporters={"infected": lambda m: c_p.compute(m,'infected'),
                                                            "recovered": lambda m: c_p.compute(m,'recovered'),
                                                            "susceptible": lambda m: c_p.compute(m,"susceptible"),
                                                            "dead": lambda m: c_p.compute(m, "dead"),
                                                            "R0": lambda m: c_p.compute(m, "R0"),
                                                            "severe_cases": lambda m: c_p.compute(m,"severe")})
        self.datacollector.collect(self)
    
    def step(self):
        self.schedule.step()
        
        self.datacollector.collect(self)
        '''
        for a in self.schedule.agents:
            if a.alive == False:
                self.schedule.remove(a)
                self.dead_agents.append(a.unique_id)
        '''

        if self.dead == self.schedule.get_agent_count():
            self.running = False
        else:
            self.running = True
    
    def run_model(self, steps):
        
        for i in range(steps):
            self.step()
    
    #function to evaluate whether or not point is in boundary
    def get_random_point_in_polygon(self, poly):
        minx, miny, maxx, maxy = poly.bounds
        
        while True:
            point = Point(random.uniform(minx, maxx), random.uniform(miny, maxy))
            
            if poly.contains(point):
                 break
            
        return point
             
    def get_point_list(self, gdf, num_of_points, county_FP_list):  
        # gdf should be a geopandas dataframe containing a geomety definition
        # num_of_points is how many Point(lon,Lat) to randomly return
        # coutny_FP_list is a list of all census County FP id numbers

        # restrict the counties to only those of interest
        gdf = gdf[gdf.COUNTYFP.isin(county_FP_list)]
        #generate a weighted sample of tracts based on population
        tracts = gdf.sample(n=num_of_points, weights = gdf['Estimate!!RACE!!Total population'].tolist(), replace = True)[['AFFGEOID','geometry']]
        tracts = gpd.GeoDataFrame(tracts)
        point_list = pd.DataFrame(columns = (['AFFGEOID','geometry']))
        
        # for each tract, pick a random point within the geometry of the tract and append
        for row in tracts.itertuples():
            df2 = pd.DataFrame([[row.AFFGEOID, self.get_random_point_in_polygon(row.geometry)]], columns = (['AFFGEOID','geometry']))
            point_list = point_list.append(df2, ignore_index=True)
        
        point_list = gpd.GeoDataFrame(point_list)
        
        return point_list

    


