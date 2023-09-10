import { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
interface AccordianProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}
const Accordian = (props: AccordianProps) => {
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
        <div className={"themed-box w-full h-fit justify-center " +className}>
            <div className="text-2xl font-bold z-10 w-full flex justify-between items-center" onDoubleClick={() => setIsExpanded(!isExpanded)}>
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
            {isExpanded && <>{children}</>}
        </div>
    )

}

export default Accordian;