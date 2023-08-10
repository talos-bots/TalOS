import { FunctionComponent } from "react";

interface AttachmentMenuProps {
  isOpen: boolean;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ isOpen }) => {
  const attachmentMenuClass = isOpen ? "attachment-menu-open" : "attachment-menu-closed";

  return (
    <div className="attachment-containter">
      <div className={`w-[35px] h-[177px] flex flex-col pt-[52px] px-0 pb-0 box-border items-center justify-start gap-[10px] ml-[.73%] mb-[65px] ${attachmentMenuClass}`}>
      <button className={`cursor-pointer border-none p-0 bg-lime-200 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
          <img
            className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden"
            alt=""
            src="/chat-page-assets/file.svg"
          />
        </button>
        <button className={`cursor-pointer [border:none] p-0 bg-lime-200 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
          <img
            className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden"
            alt=""
            src="/chat-page-assets/code.svg"
          />
        </button>
        <button className={`cursor-pointer [border:none] p-0 bg-lime-200 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
          <img
            className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden"
            alt=""
            src="/chat-page-assets/imageplus.svg"
          />
        </button>
      </div>
    </div>
  );
};

export default AttachmentMenu;
