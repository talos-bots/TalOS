import React from "react";

const ZeroPage = () => {
	return (
		<div className="w-full h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden p-4">
			<div className="grid grid-cols-10 w-full h-full gap-2">
				<div className="col-span-2 w-full h-full themed-root gap-2 flex flex-col">
					<h3 className="text-theme-text font-semibold">Zero Shot</h3>
					<div className="w-full gap-2 flex flex-col text-left">
						<p className="text-theme-text">Zero Shot is a collection of tools that allow you to interact with LLMs, text-sentence-encoder models, and Sentiment Analysis models. You can use these tools to generate embeddings, and to generate completions.</p>
					</div>
				</div>
				<div className="col-span-8 w-full h-full themed-root gap-2 grid grid-cols-6">
					<div className="col-span-2 w-full h-full gap-2 flex flex-col">
					</div>
					<div className="col-span-2 w-full h-full gap-2 flex flex-col">
					</div>
					<div className="col-span-2 w-full h-full gap-2 flex flex-col">
					</div>
				</div>
			</div>
		</div>
	);
};

export default ZeroPage;
