import { EntryPostion, LoreEntry } from "@/classes/Lorebook";
import Accordian from "@/components/accordian";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

interface EntryCrudProps {
    entry: LoreEntry | null;
    onSave?: (entry: LoreEntry) => void;
    onEdit?: (entry: LoreEntry) => void;
    onDelete?: (entry: LoreEntry) => void;
}

const EntryCrud = (props: EntryCrudProps) => {
    const { entry, onSave, onDelete, onEdit } = props;
    const [entryName, setEntryName] = useState<string>('');
    const [entryContent, setEntryContent] = useState<string>('');
    const [entryEnabled, setEntryEnabled] = useState<boolean>(true);
    const [entryKeys, setEntryKeys] = useState<string[]>([]);
    const [entryCaseSensitive, setEntryCaseSensitive] = useState<boolean>(false);
    const [entryPriority, setEntryPriority] = useState<number>(0);
    const [entryComment, setEntryComment] = useState<string>('');
    const [entrySelective, setEntrySelective] = useState<boolean>(false);
    const [entryConstant, setEntryConstant] = useState<boolean>(false);
    const [entrySecondaryKeys, setEntrySecondaryKeys] = useState<string[]>([]);
    const [entryPostion, setEntryPosition] = useState<EntryPostion>('after_char');

    useEffect(() => {
        if(entry) {
            setEntryName(entry.name);
            setEntryContent(entry.content);
            setEntryEnabled(entry.enabled);
            setEntryKeys(entry.keys);
            setEntryCaseSensitive(entry.case_sensitive);
            setEntryPriority(entry.priority);
            setEntryComment(entry.comment);
            setEntrySelective(entry.selective);
            setEntryConstant(entry.constant);
            setEntrySecondaryKeys(entry.secondary_keys);
            setEntryPosition(entry.position);
        }
    }, [entry]);

    const handleEntryUpdate = async () => {
        if(entry) {
            entry.name = entryName;
            entry.content = entryContent;
            entry.enabled = entryEnabled;
            entry.keys = entryKeys;
            entry.case_sensitive = entryCaseSensitive;
            entry.priority = entryPriority;
            entry.comment = entryComment;
            entry.selective = entrySelective;
            entry.constant = entryConstant;
            entry.secondary_keys = entrySecondaryKeys;
            entry.position = entryPostion;
            if(onEdit === undefined) return;
            onEdit(entry);
        }else{
            const newEntry = new LoreEntry()
            newEntry.name = entryName;
            newEntry.content = entryContent;
            newEntry.enabled = entryEnabled;
            newEntry.keys = entryKeys;
            newEntry.case_sensitive = entryCaseSensitive;
            newEntry.priority = entryPriority;
            newEntry.comment = entryComment;
            newEntry.selective = entrySelective;
            newEntry.constant = entryConstant;
            newEntry.secondary_keys = entrySecondaryKeys;
            newEntry.position = entryPostion;
            if(onSave === undefined) return;
            onSave(newEntry);
        }
    }

    const handleEntryDelete = async () => {
        if(entry) {
            if(onDelete === undefined) return;
            onDelete(entry);
        }else{
            setEntryName('');
            setEntryContent('');
            setEntryEnabled(true);
            setEntryKeys([]);
            setEntryCaseSensitive(false);
            setEntryPriority(0);
            setEntryComment('');
            setEntrySelective(false);
            setEntryConstant(false);
            setEntrySecondaryKeys([]);
            setEntryPosition('after_char');
        }
    }

    return (
        <Accordian title={entryName || 'New Entry'}>
            <div className="w-full gap-4 text-left overflow-y-auto grid grid-rows-2">
                <div className="grid grid-cols-2 row-span-1 gap-2">
                    <div className="col-span-1 h-full gap-2">
                        <div className="flex flex-col h-1/4">
                            <label htmlFor="entry-name" className="font-semibold">Name</label>
                            <input className="themed-input w-full" id="entry-name" type="text" value={entryName} onChange={e => setEntryName(e.target.value.trim())} />
                        </div>
                        <div className="flex flex-col h-3/4">
                            <label htmlFor="entry-content" className="font-semibold">Content</label>
                            <textarea className="themed-input w-full h-full" id="entry-content" value={entryContent} onChange={e => setEntryContent(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-span-1 h-full">
                        <div className="flex flex-col h-1/4">
                            <label htmlFor="entry-keys" className="font-semibold">Keys</label>
                            <textarea className="themed-input w-full" id="entry-keys" value={entryKeys.join(',')} onChange={e => setEntryKeys(e.target.value.trim().split(','))} />
                        </div>
                        <div className="flex flex-col h-1/4">
                            <label htmlFor="entry-secondary-keys" className="font-semibold">Secondary Keys</label>
                            <textarea className="themed-input w-full" id="entry-secondary-keys" value={entrySecondaryKeys.join(',')} onChange={e => setEntrySecondaryKeys(e.target.value.trim().split(','))} />
                        </div>
                        <div className="flex flex-col h-2/4">
                            <label htmlFor="entry-comment" className="font-semibold">Comment</label>
                            <textarea className="themed-input w-full h-full" id="entry-comment" value={entryComment} onChange={e => setEntryComment(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row-span-1 grid grid-cols-2 gap-2">
                    <div className="col-span-1 flex flex-col gap-1">
                        <div className="themed-input">
                            <label htmlFor="entry-enabled w-full" className="font-semibold">Enabled</label>
                            <div className="flex flex-col items-center text-left w-full">
                                <ReactSwitch 
                                    id="entry-enabled" 
                                    checked={entryEnabled} 
                                    onChange={e => setEntryEnabled(e)} 
                                    handleDiameter={30}
                                    width={60}
                                    uncheckedIcon={false}
                                    checkedIcon={true}
                                />
                            </div>
                        </div>
                        <label htmlFor="entry-priority" className="font-semibold">Priority</label>
                        <input className="themed-input w-full" id="entry-priority" type="number" value={entryPriority} onChange={e => setEntryPriority(parseInt(e.target.value))} />
                        <label htmlFor="entry-position" className="font-semibold">Position</label>
                        <select className="themed-input w-full" id="entry-position" value={entryPostion} onChange={e => setEntryPosition(e.target.value as EntryPostion)}>
                            <option value="after_char">After Character</option>
                            <option value="before_char">Before Character</option>
                        </select>
                    </div>
                    <div className="col-span-1 flex flex-col gap-1">
                        <div className="themed-input">
                            <label htmlFor="entry-enabled w-full" className="font-semibold">Constant</label>
                            <div className="flex flex-col items-center text-left w-full">
                                <ReactSwitch 
                                    id="entry-enabled" 
                                    checked={entryConstant} 
                                    onChange={e => setEntryConstant(e)} 
                                    handleDiameter={30}
                                    width={60}
                                    uncheckedIcon={false}
                                    checkedIcon={true}
                                />
                            </div>
                        </div>
                        <div className="themed-input">
                            <label htmlFor="entry-enabled w-full" className="font-semibold">Selective</label>
                            <div className="flex flex-col items-center text-left w-full">
                                <ReactSwitch 
                                    id="entry-enabled" 
                                    checked={entrySelective} 
                                    onChange={e => setEntrySelective(e)} 
                                    handleDiameter={30}
                                    width={60}
                                    uncheckedIcon={false}
                                    checkedIcon={true}
                                />
                            </div>
                        </div>
                        <div className="themed-input">
                            <label htmlFor="entry-enabled w-full" className="font-semibold">Case Sensitive</label>
                            <div className="flex flex-col items-center text-left w-full">
                                <ReactSwitch 
                                    id="entry-enabled" 
                                    checked={entryCaseSensitive} 
                                    onChange={e => setEntryCaseSensitive(e)} 
                                    handleDiameter={30}
                                    width={60}
                                    uncheckedIcon={false}
                                    checkedIcon={true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-1">
                            <button className="themed-button-pos w-1/2" onClick={() => handleEntryUpdate()}>Save</button>
                            <button className="themed-button-neg w-1/2" onClick={() => handleEntryDelete()}>{entry !== null ? 'Delete' : 'Clear'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </Accordian>
    );
}
export default EntryCrud;