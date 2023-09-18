import { doInstructions, generateText, getGPTTokens, getInstructPrompt, getLlamaTokens, getTextEmotion } from "@/api/llmapi";
import TokenTextarea from "@/components/token-textarea";
import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";
type models = "GPT" | "LLaMA";
type modes = "Completion" | "Sentiment Analysis" | "Instruct" | "Sentence Comparison";
const ZeroPage = () => {
	const [modelType, setModelType] = useState<models>("LLaMA");
	const [mode, setMode] = useState<modes>("Instruct");
	const [result, setResult] = useState<string>("");
	const [instructions, setInstructions] = useState<string>("");
	const [examples, setExamples] = useState<string[] | string>("");
	const [guidance, setGuidance] = useState<string>("");
	const [context, setContext] = useState<string>("");
	const [prompt, setPrompt] = useState<string>("");

	const handleInstruct = async () => {
		const returnedResults = await doInstructions(instructions, guidance, context, examples);
		getInstructPrompt(instructions, guidance, context, examples).then((prompt) => {
			setPrompt(prompt);
		});
		setResult(returnedResults);
	};

	const handleClassify = async () => {
		const returnedResults = await getTextEmotion(instructions);
		setResult(returnedResults);
	};

	const handleCompletion = async () => {
		const returnedResults = await generateText(instructions);
		if(returnedResults.error !== undefined) {
			setResult(returnedResults.error);
			return;
		}
		let fullText = "";
		fullText = returnedResults.results[0];
		setResult(fullText);
	};

	return (
		<div className="w-full h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden p-4 lg:p-6">
			<div className="grid grid-cols-10 w-full h-full gap-2">
				<div className="col-span-2 w-full h-full themed-root gap-2 flex flex-col slide-in-left">
					<h3 className="text-theme-text font-semibold">Zero Shot</h3>
					<div className="w-full gap-2 flex flex-col text-left">
						<p className="text-theme-text">Zero Shot is a collection of tools that allow you to interact with LLMs, text-sentence-encoder models, and Sentiment Analysis models. You can use these tools to analyze text, perform instructions, and to generate completions.</p>
						<label className="text-theme-text font-semibold">LLM Type (Determines Token Count)</label>
						<select className="w-full themed-input" onChange={(e) => setModelType(e.target.value as models)}>
							<option value="LLaMA">LLaMA (LLaMA 2/LLaMA)</option>
							<option value="GPT">GPT (Claude/OpenAI)</option>
						</select>
						<label className="text-theme-text font-semibold">Mode</label>
						<select className="w-full themed-input" onChange={(e) => setMode(e.target.value as modes)}>
							<option value="Instruct">Instruct</option>
							<option value="Completion">Completion</option>
							<option value="Sentiment Analysis">Sentiment Analysis</option>
							{/* <option value="Sentence Comparison">Sentence Comparison</option> */}
						</select>
					</div>
				</div>
				<div className="col-span-8 w-full h-full themed-root gap-2 grid grid-cols-6 slide-in-right">
					<div className="col-span-2 w-full h-full gap-2 flex flex-col text-left">
						{mode === "Instruct" && (
							<div className="flex flex-col w-full h-full">
								<label className="text-theme-text font-semibold">Instructions</label>
								<TokenTextarea
									value={instructions}
									onChange={(value) => setInstructions(value)}
									placeholder="Enter Instructions"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
								/>
								<label className="text-theme-text font-semibold">Guidance</label>
								<TokenTextarea
									value={guidance}
									onChange={(value) => setGuidance(value)}
									placeholder="Enter Guidance"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
								/>
								<label className="text-theme-text font-semibold">Context</label>
								<TokenTextarea
									value={context}
									onChange={(value) => setContext(value)}
									placeholder="Enter Context"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
								/>
								<label className="text-theme-text font-semibold">Examples</label>
								<TokenTextarea
									value={examples as string}
									onChange={(value) => setExamples(value)}
									placeholder="Enter Examples"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
								/>
								<button className="w-full themed-button-pos flex flex-row items-center justify-center gap-4" onClick={handleInstruct}>
									Send Instruct
									<SendHorizonal size={'1.5rem'}/>
								</button>
							</div>
						)}
						{mode === "Sentence Comparison" && (
							<div className="flex flex-col w-full h-full">
							</div>
						)}
						{(mode === "Completion" || mode === "Sentiment Analysis") && (
							<div className="flex flex-col w-full h-full">
								<label className="text-theme-text font-semibold">Input</label>
								<TokenTextarea
									value={instructions}
									onChange={(value) => setInstructions(value)}
									placeholder="Enter Instructions"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
								/>
								<button className="w-full themed-button flex flex-row items-center justify-center gap-4" 
									onClick={
										() =>
										{switch (mode) {
											case "Completion":
												handleCompletion();
												break;
											case "Sentiment Analysis":
												handleClassify();
												break;
											default:
												break;
											}
										}
									}
								>
									<SendHorizonal size={'1.5rem'}/>
								</button>
							</div>
						)}
					</div>
					<div className="col-span-2 w-full h-full gap-2 flex flex-col text-left">
						{mode === "Instruct" && (
							<div className="flex flex-col w-full h-full">
								<label className="text-theme-text font-semibold">Prompt</label>
								<TokenTextarea
									value={prompt}
									onChange={(value) => setPrompt(value)}
									placeholder="Prompt"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
									readonly
								/>
							</div>
						)}
						{mode === "Sentence Comparison" && (
							<div className="flex flex-col w-full h-full">
							</div>
						)}
						{(mode === "Completion" ||  mode === "Sentiment Analysis") && (
							<div className="flex flex-col w-full h-full">
							</div>
						)}
					</div>
					<div className="col-span-2 w-full h-full gap-2 flex flex-col text-left">
						{mode === "Instruct" && (
							<div className="flex flex-col w-full h-full">
								<label className="text-theme-text font-semibold">Results</label>
								<TokenTextarea
									value={result}
									onChange={(value) => setResult(value)}
									placeholder="Results"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
									readonly
								/>
							</div>
						)}
						{mode === "Sentence Comparison" && (
							<div className="flex flex-col w-full h-full">
							</div>
						)}
						{(mode === "Completion" ||  mode === "Sentiment Analysis") && (
							<div className="flex flex-col w-full h-full">
								<label className="text-theme-text font-semibold">Results</label>
								<TokenTextarea
									value={result}
									onChange={(value) => setResult(value)}
									placeholder="Results"
									tokenType={modelType}
									className="w-full themed-input flex-grow"
									readonly
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ZeroPage;
