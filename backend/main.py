from quart import Quart, request
from langchain.llms import TextGen
from langchain.tools import DuckDuckGoSearchRun

app = Quart(__name__)
llm = TextGen(model_url="https://night-traveler-part-trash.trycloudflare.com")
search = DuckDuckGoSearchRun()

@app.route('/zero-message', methods=['POST'])
async def zero_message():
    data = await request.get_json()
    message = data.get('message')
    print(f'Received message: {message}')

    # Use DuckDuckGo to search for the message
    search_result = search(message)

    # Generate the prompt for the LLM
    prompt_template = f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

    ### Instruction:
    {message}

    ### Input:
    {search_result}

    ### Response:
    """

    # Use the LLM to generate a response
    response = llm(prompt_template)

    return {'response': response}, 200

if __name__ == '__main__':
    app.run(port=5000)
