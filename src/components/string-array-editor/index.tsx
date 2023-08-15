import './StringArrayEditor.scss'
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

const StringArrayEditor = (props: MultiInputEditorProps) => {
    const { value, onChange, className, id, disabled } = props;

    return (
        <div className="w-full gap-4" id={id}>
            {disabled ? null : (
            <button
                className="themed-button-pos w-full"
                onClick={() => {
                    if (onChange) {
                        onChange([...value, '']);
                    }
                }}
            >
                Add New
            </button>
            )}
            <div className="flex flex-col h-10vh overflow-y-auto">
            {value.map((item, index) => (
                <div key={index} className="w-full flex flex-row">
                    <textarea
                        className={"themed-input" + (disabled ? " w-full" : " w-4/5")}
                        value={item}
                        disabled={disabled}
                        onChange={(e) => {
                            if (onChange && !disabled) {
                                const newValue = [...value];
                                newValue[index] = e.target.value;
                                onChange(newValue);
                            }
                        }}
                    />
                    {disabled ? null : (
                    <button
                        className="themed-button-neg w-1/5"
                        onClick={() => {
                            if (onChange) {
                                const newValue = [...value];
                                newValue.splice(index, 1);
                                onChange(newValue);
                            }
                        }}
                    >
                        Remove
                    </button>
                    )}
                </div>
            ))}
            </div>
        </div>
    )
};


export default StringArrayEditor;