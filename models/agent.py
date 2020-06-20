# -*- coding: utf-8 -*-
"""
Spyder Editor

@author: metalcorebear
"""

from mesa import Agent


#Agent class
class human(Agent):
    
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.pos = unique_id
        self.infected, self.susceptible, self.severe = self.model.SIR_instance.initial_infection()
        self.was_infected = False
        self.recovered = False
        self.alive = True
        self.day = 0
        self.induced_infections = 0
        self.infected_others = False   
    def step(self):

        self.model.SIR_instance.interact(self)
        self.day += 1
        

class Denizen(human):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self._gender = ''
        self._age = 0
        self._race = ''
        self._census_tract_id=''
        self._lat=0.0
        self._lng=0.0
        self._states=[]
        
    @property
    def census_tract_id(self):
        return self._census_tract_id
    
    @census_tract_id.setter
    def census_tract_id(self, value):
            self._census_tract_id = value
    
    @property
    def lat(self):
        return self._lat
    
    @lat.setter
    def lat(self, value):
            self._lat = value
    
    @property
    def lng(self):
        return self._lng
    
    @lng.setter
    def lng(self, value):
            self._lng = value
    
    def to_dictionary(self):
        dictionary = {
            'agent-id': self.pos,
            'states': self._states,
            'gender': self._gender,
            'age': self._age,
            'race': self._race,
            'census-tract-id:': self._census_tract_id,
            'lat': self._lat,
            'lng': self._lng
        }
        
        return dictionary
    
    
    def record_state(self):
        state = ''
        
        if self.susceptible:
            state = 'S'
        elif self.infected and not self.severe:
            state = 'I'
        elif self.infected and self.severe:
            state = 'H'
        elif self.recovered:
            state = 'R'
        elif not self.alive:
            state = 'D'
        
        self._states.append(state)


class DenizenAgent():
    def __init__(self, unique_id):
        # super().__init__(unique_id)
        self._unique_id = unique_id
        self._gender = ''
        self._age = 0
        self._race = ''
        self._census_tract_id=''
        self._lat=0.0
        self._lng=0.0
        self._states=[]
        
    @property
    def census_tract_id(self):
        return self._census_tract_id
    
    @census_tract_id.setter
    def census_tract_id(self, value):
            self._census_tract_id = value
    
    @property
    def lat(self):
        return self._lat
    
    @lat.setter
    def lat(self, value):
            self._lat = value
    
    @property
    def lng(self):
        return self._lng
    
    @lng.setter
    def lng(self, value):
            self._lng = value
    
    def to_dictionary(self):
        dictionary = {
            'agent-id': self._unique_id,
            'states': self._states,
            'gender': self._gender,
            'age': self._age,
            'race': self._race,
            'census-tract-id:': self._census_tract_id,
            'lat': self._lat,
            'lng': self._lng
        }
        
        return dictionary
    
    
    def record_state(self):
        state = ''
        
        if self.susceptible:
            state = 'S'
        elif self.infected and not self.severe:
            state = 'I'
        elif self.infected and self.severe:
            state = 'H'
        elif self.recovered:
            state = 'R'
        elif not self.alive:
            state = 'D'
        
        self._states.append(state)
    
    


