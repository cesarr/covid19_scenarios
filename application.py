from flask import Flask, render_template, request 
from models import BaileyPikeModel, AgentFactory
import json

app = Flask(__name__)

@app.route('/')
def render_dashboard(name=None):
    return render_template('index.html', name=name)


@app.route('/solver', methods=['GET', 'POST'])
def solve():
    if request.method == 'POST':
        parameters = request.get_json(cache=False)
        steps = int(parameters['steps'])
        
        if steps < 0 or steps > 120:  
            steps = 30
        else:
            parameters['steps'] = steps
        
        model = BaileyPikeModel(parameters)
        agents = model.grid.get_all_cell_contents()
        result = {}
        agent_list = []

        for i in range(steps):
            model.step()
    
            for agent in agents:
                agent.record_state()

        for agent in agents:
            agent_list.append(agent.dictionary_for_json())

        result['agents'] = agent_list
        json_string = model.datacollector.get_model_vars_dataframe().to_json()
        result['sir'] = json.loads(json_string)
        json_string = json.dumps(result)
        
        return json_string
    else:
        return "The Outbreak Explorer solver only responds to POST requests."
    

@app.route('/agents', methods=['GET', 'POST'])
def generate_agents():
    if request.method == 'POST':
        parameters = {'population':2380}
    else:
        parameters = {'population':2380}

    factory = AgentFactory(parameters)
    agents = factory.agents
    agent_list = []
    result = {}

    for agent in agents:
        agent_list.append(agent.to_dictionary())

    result['agents'] = agent_list
    json_string = json.dumps(result)

    return json_string
    