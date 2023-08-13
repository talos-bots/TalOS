from quart import Quart, jsonify, request
from langchain.agents import (
    Tool,
    AgentExecutor,
    LLMSingleActionAgent,
    AgentOutputParser,
)
from langchain.prompts import BaseChatPromptTemplate
from langchain import SerpAPIWrapper, LLMChain
from langchain.schema import AgentAction, AgentFinish, HumanMessage
from langchain.llms import KoboldApiLLM, TextGen
from langchain.tools import DuckDuckGoSearchRun
import json
import requests

search = DuckDuckGoSearchRun()

app = Quart(__name__)


@app.route("/zero-message", methods=["POST"])
async def zero_message():
    data = await request.get_json()
    print(data["message"])
    return data


@app.route("/message", methods=["POST"])
async def message():
    data = await request.get_json()
    print(data["message"])
    return data


@app.route("/get_response", methods=["POST"])
async def get_response():
    data = await request.json
    question = data["message"]

    search_result = search(question)

    print(search_result)

    prompt_template = f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
    
### Instruction:
{question}

### Input:
{search_result}

### Response:
"""


    llm = TextGen(model_url="http://127.0.0.1:5000", max_length=2000)

    response = llm(prompt_template)
    print(f"\n\n\nResponse: {response}")
    print(response)

    return jsonify({"response": response})


def is_port_in_use(port):
    try:
        response = requests.get(f"http://127.0.0.1:{port}")
        return True
    except requests.ConnectionError:
        return False


port = 5000
while is_port_in_use(port):
    port += 1

print(f"Available port: {port}")

if __name__ == "__main__":
    try:
        # check if config.json exists
        if not os.path.exists("config.json"):
            with open("config.json", "w") as f:
                pass
    except:
        with open("config.json", "r+") as f:
            config = json.load(f)
            config["port"] = port
            f.seek(0)
            json.dump(config, f)
            f.truncate()

        app.run(port=port)
