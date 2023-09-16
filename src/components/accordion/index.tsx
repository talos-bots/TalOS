import { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
interface AccordionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}
const Accordion = (props: AccordionProps) => {
    const { title, children, className } = props;
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if(localStorage.getItem(title)){
            let state = JSON.parse(localStorage.getItem(title)?.toString() || '{}');
            if(state.isExpanded === true){
                setIsExpanded(true);
            }
        }
    }, [title]);

    useEffect(() => {
        localStorage.setItem(title, JSON.stringify({isExpanded: isExpanded}));
    }, [isExpanded, title]);
    
    return (
        <div className={"pop-in themed-root w-full h-fit justify-center " +className}>
            <div className="text-2xl font-bold z-10 w-full flex justify-between items-center" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-row w-full">
                    <div className="flex flex-col w-1/2 items-left text-left justify-start">
                        {title}
                    </div>
                    <div className="flex flex-col w-1/2 items-end">
                        <button onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <AiOutlineUp/> : <AiOutlineDown/>}
                        </button>
                    </div>
                </div>
            </div>
            <div className={"overflow-y-auto transform origin-top transition-all duration-1000 ease-in-out " + (isExpanded ? "scale-y-100 max-h-[800px]" : "scale-y-0 max-h-0")}>
                {children}
            </div>
        </div>
    )

}

export default Accordion;