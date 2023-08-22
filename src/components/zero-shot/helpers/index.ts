import { generateText } from "@/api/llmapi";

const instructPrompt = `
This is a web search engine that uses a search engine to answer a question. Respond with the answer to the question below.

### Instruction
{{value}}

### Response:
`;

export const getInstructResponse = async (value: string) => {
    const newPrompt = instructPrompt.replace('{{value}}', value);

    const reply = await generateText(newPrompt).then((response) => {
        console.log(response);
        let rawReply = ''
        if(response){
            rawReply = response.results[0];
            return rawReply;
        }else{
            console.log('No valid response from GenerateText');
            return null;
        }
    });

    if(reply !== null){
        return reply;
    }
    else{
        return 'No valid response from prompt.';
    }
}