import { Completion } from "../../classes/Completion"
import { CompletionLog } from "../../classes/CompletionLog"
import { CompletionType } from "../../types"
import CodeEditor from '@uiw/react-textarea-code-editor';
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import { useEffect, useState } from "react"
import { SendHorizonal } from "lucide-react";
import { deleteCompletion, getCompletions, saveNewCompletion, updateCompletion } from "../../api/dbapi";
import CompletionLogDetails from "./completion-log-details";

const CompletionsPage = () => {
    const [fullText, setFullText] = useState<string>("")
    const [completions, setCompletions] = useState<Completion[]>([])
    const [currentLog, setCurrentLog] = useState<CompletionLog | null>(null)
    const [completionLogs, setCompletionLogs] = useState<CompletionLog[]>([])
    const [completionType, setCompletionType] = useState<CompletionType>("novel")
    const [completionTitle, setCompletionTitle] = useState<string>("")
    const [completionGuidance, setCompletionGuidance] = useState<string>("")

    useEffect(() => {
        const assembledString = completions.map((completion) => completion.content).join()
        setFullText(assembledString)
    }, [completions])

    useEffect(() => {
        console.log("Current Log Changed!")
        if(currentLog){
            setCompletions(currentLog.completions)
            setCompletionTitle(currentLog.name)
            setCompletionType(currentLog.type)
        }
    }, [currentLog])

    useEffect(() => {
        const fetchLogs = async () => {
            const fetchedLogs = await getCompletions()
            if(fetchedLogs){
                setCompletionLogs(fetchedLogs)
            }
        }
        fetchLogs()
    }, [])

    const newCompletionLog = async () => {
        const newLog = new CompletionLog()
        newLog.type = completionType
        newLog.name = "New Completion Log"
        await saveNewCompletion(newLog)
        setCompletionLogs([...completionLogs, newLog])
        setCurrentLog(newLog)
    }

    const deleteCompletionLog = async (log: CompletionLog) => {
        const newLogs = completionLogs.filter((l) => l._id !== log._id)
        setCompletionLogs(newLogs)
        if(currentLog?._id === log._id){
            setCurrentLog(null)
            setCompletions([])
        }
        await deleteCompletion(log._id)
    }

    const editCompletionLog = async (log: CompletionLog) => {
        const newLogs = completionLogs.map((l) => {
            if(l._id === log._id){
                return log
            }
            return l
        })
        setCompletionLogs(newLogs)
        if(currentLog?._id === log._id){
            setCurrentLog(log)
        }
    }

    const saveCurrentLog = async () => {
        if(currentLog){
            const newLog = currentLog
            newLog.completions = completions
            newLog.name = completionTitle
            await updateCompletion(newLog)
        }else{
            console.log("No current log to save!")
        }
    }
      
    return(
        <div className="w-full h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden p-4 lg:p-8">
            <div className="grid grid-cols-10 w-full h-full gap-2">
                <div className="col-span-2 w-full h-full themed-root gap-2 flex flex-col">
                    <h3 className="text-theme-text font-semibold">Completion Logs</h3>
                    <div className="w-full gap-2 flex flex-col text-left overflow-y-auto">
                    <div
                        onClick={() => {newCompletionLog()}}
                        title="New Completion Log"
                        className={`rounded-theme-border-radius object-cover bg-theme-box border-theme-border-width border-theme-border hover:bg-theme-hover-pos p-2 flex flex-col justify-center items-center relative cursor-pointer`}
                    >
                        New Completion Log
                    </div>
                        {completionLogs.map((log) => {
                            return(
                                <CompletionLogDetails key={log._id} chat={log} onClick={(log) => setCurrentLog(log)} onDelete={(e) => {deleteCompletionLog(e)}} onEdit={(e) => {editCompletionLog(e)}}/>
                            )
                        })}
                    </div>
                </div>
                <div className="col-span-6 w-full h-full themed-root gap-2 flex flex-col">
                    {completionType !== "code" && (
                        <>
                            <input className="themed-input w-full text-semibold text-4xl" placeholder="Title" onChange={(e) => setCompletionTitle(e.target.value)} value={completionTitle}></input>
                            <textarea
                                value={fullText}
                                onChange={(e) => {setFullText(e.target.value);}}
                                className="themed-input w-full flex-grow overflow-y-auto overflow-x-contain"
                                placeholder="Write your text here..."
                            />
                            <div className="flex flex-row w-full gap-2">
                                <input className="themed-input flex-grow" placeholder="Guidance" onChange={(e) => setCompletionGuidance(e.target.value)}/>
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