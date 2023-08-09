import { FunctionComponent } from "react";
import themeProps from "../themes/Themes";

interface AttachmentMenuProps {
  isOpen: boolean;
  themeProps: themeProps;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ isOpen, themeProps }) => {
  const attachmentMenuClass = isOpen ? "attachment-menu-open" : "attachment-menu-closed";

  return (
    <div className="attachment-containter">
      <div className={`w-[35px] h-[177px] flex flex-col pt-[52px] px-0 pb-0 box-border items-center justify-start gap-[10px] ml-[.73%] mb-[65px] ${attachmentMenuClass}`}>
      <button className={`cursor-pointer border-none p-0 bg-${themeProps.bgColor} relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0`}>
          <img
            className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden"
            alt=""
            src="/chat-page-assets/file.svg"
          />
        </button>
        <button className={`cursor-pointer [border:none] p-0 bg-${themeProps.bgColor} relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0`}>
          <img
            className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden"
            alt=""
            src="/chat-page-assets/code.svg"
          />
        </button>
        <button className={`cursor-pointer [border:none] p-0 bg-${themeProps.bgColor} relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0`}>
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
