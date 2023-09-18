import { Completion } from "@/classes/Completion"
import { CompletionLog } from "@/classes/CompletionLog"
import { CompletionType } from "@/types"
import CodeEditor from '@uiw/react-textarea-code-editor';
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import React, { useEffect, useState } from "react"
import { SendHorizonal } from "lucide-react";

const CompletionsPage = () => {
    const [fullText, setFullText] = useState<string>("")
    const [completions, setCompletions] = useState<Completion[]>([])
    const [completionLog, setCompletionLog] = useState<CompletionLog[]>([])
    const [completionType, setCompletionType] = useState<CompletionType>("novel")
    const [completionTitle, setCompletionTitle] = useState<string>("")
    const [completionGuidance, setCompletionGuidance] = useState<string>("")

    useEffect(() => {
        const assembledString = completions.map((completion) => completion.content).join()
        setFullText(assembledString)
    }, [completions])
    
    return(
        <div className="w-full h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden p-4 lg:p-8">
            <div className="grid grid-cols-10 w-full h-full gap-2">
                <div className="col-span-2 w-full h-full themed-root gap-2 flex flex-col">
                    <h3 className="text-theme-text font-semibold">Completions</h3>
                    <div className="w-full gap-2 flex flex-col text-left">
                        {completionType !== "code" && (
                            <>
                            </>
                        )}
                        {completionType === "code" && (
                            <>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-span-6 w-full h-full themed-root gap-2 flex flex-col">
                    {completionType !== "code" && (
                        <>
                            <input className="themed-input w-full text-semibold text-4xl" placeholder="Title"></input>
                            <textarea 
                                value={fullText} 
                                onChange={(e)=> {setFullText(e.target.value)}} 
                                className="themed-input w-full flex-grow overflow-y-auto" 
                                placeholder="Write your text here..."
                            />
                            <div className="flex flex-row w-full gap-2">
                                <input className="themed-input flex-grow" placeholder="Guidance"/>
                                <button className="themed-button-pos w-1/12 flex flex-col justify-center items-center">
                                    <SendHorizonal size={26}/>
                                </button>
                            </div>
                        </>
                    )}
                    {completionType === "code" && (
                        <>  
                            <input className="themed-input w-full h-1/12 text-semibold text-4xl" placeholder="Filename"></input>
                            <CodeEditor
                                value={fullText}
                                language="ts"
                                placeholder="Put your code here..."
                                onChange={(evn) => setFullText(evn.target.value)}
                                padding={15}
                                rehypePlugins={[
                                    [rehypePrism, { ignoreMissing: true }],
                                    [
                                    rehypeRewrite,
                                    {
                                        rewrite: (node: any, index: any, parent: any) => {
                                        if (node.properties?.className?.includes("code-line")) {
                                            if (index === 0 && node.properties?.className) {
                                            node.properties.className.push("demo01");
                                            // console.log("~~~", index, node.properties?.className);
                                            }
                                        }
                                        if (node.type === "text" && node.value === "return" && parent.children.length === 1) {
                                            parent.properties.className.push("demo123");
                                        }
                                        }
                                    }
                                    ]
                                ]}
                                style={{
                                    fontSize: 16,
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                }}
                                className="themed-input h-11/12 w-full"
                                />
                        </>
                    )}
                </div>
                <div className="col-span-2 w-full h-full themed-root gap-2 flex flex-col">
                    <h3 className="text-theme-text font-semibold">Completion Settings</h3>
                    <div className="w-full gap-2 flex flex-col text-left">
                        <label className="text-theme-text font-semibold">Completion Type</label>
                        <select className="themed-input" onChange={(evn) => setCompletionType(evn.target.value as CompletionType)}>
                            <option value="novel">Novel</option>
                            <option value="code">Code</option>
                            <option value="song">Song</option>
                            <option value="script">Script</option>
                            <option value="other">Other</option>
                        </select>
                        {completionType !== "code" && (
                            <>
                            </>
                        )}
                        {completionType === "code" && (
                            <>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompletionsPage