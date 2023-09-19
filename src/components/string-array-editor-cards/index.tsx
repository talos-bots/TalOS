import { useState } from 'react';
import './StringArrayEditorCards.scss'
import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { confirmModal } from '../confirm-modal';
interface MultiInputEditorPropsBase {
    value: string[];
    className?: string;
    id?: string;
    disabled?: boolean;
}

interface MultiInputEditorPropsEnabled extends MultiInputEditorPropsBase {
    disabled?: false;
    onChange: (value: string[]) => void;
}

interface MultiInputEditorPropsDisabled extends MultiInputEditorPropsBase {
    disabled: true;
    onChange?: (value: string[]) => void;
}

type MultiInputEditorProps = MultiInputEditorPropsEnabled | MultiInputEditorPropsDisabled;

const StringArrayEditorCards = (props: MultiInputEditorProps) => {
    const { value, onChange, className, id, disabled } = props;
    const [index, setIndex] = useState<number>(0);

    const handleIndexChange = (newIndex: number) => {
        if(newIndex >= 0 && newIndex < value.length) {
            setIndex(newIndex);
        }
    }

    return (
        <div className="w-full h-full" id={id}>
            <div className="flex flex-row h-full overflow-y-auto gap-1">
                <button className="themed-button-neg w-1/12 h-full flex justify-center items-center" onClick={() => handleIndexChange(index - 1)}>
                    <ArrowLeft size={32}/>
                </button>
                {value[index] !== undefined ? (
                    <textarea
                        className={(disabled ? "themed-input w-10/12" : "themed-input w-9/12")}
                        value={value[index]}
                        disabled={disabled}
                        onChange={(e) => {
                            if (onChange && !disabled) {
                                const newValue = [...value];
                                newValue[index] = e.target.value;
                                onChange(newValue);
                            }
                        }}
                    />
                ) : ( 
                    <textarea
                        className={(disabled ? "themed-input w-10/12" : "themed-input w-9/12")}
                        value={value[index]}
                        disabled={disabled}
                        onChange={(e) => {
                            if (onChange && !disabled) {
                                const newValue = [...value];
                                newValue[index] = e.target.value;
                                onChange(newValue);
                            }
                        }}
                    />
                )}
                {disabled ? null : (
                    <div className='flex flex-col w-1/12 gap-1'>
                        <button
                            className="themed-button-pos w-full h-1/2 flex justify-center items-center"
                            onClick={() => {
                                if (onChange) {
                                    onChange([...value, '']);
                                    setIndex(index + 1);
                                }
                            }}
                        >
                            <Plus size={32}/>
                        </button>
                        <button
                            className="themed-button-neg w-full h-1/2 flex justify-center items-center"
                            onClick={async () => {
                                if(!await confirmModal(`Are you sure you want to delete this? This cannot be undone.`)) return;
                                if (onChange) {
                                    const newValue = [...value];
                                    newValue.splice(index, 1);
                                    onChange(newValue);
                                    handleIndexChange(index - 1);
                                }
                            }}
                        >
                            <Minus size={32}/>
                        </button>
                    </div>
                )}
                <button className="themed-button-pos w-1/12 h-full flex justify-center items-center" onClick={() => handleIndexChange(index + 1)}>
                    <ArrowRight size={32}/>
                </button>
            </div>
        </div>
    )
};


export default StringArrayEditorCards;