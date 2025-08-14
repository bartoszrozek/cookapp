import React from "react";
import { IoMdClose } from "react-icons/io";
import DivButton from "../DivButton";


interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {

  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-header">
        {title && <h3 className="modal-title">{title}</h3>}
        <DivButton
          onClick={() => onClose()}
        >
          <IoMdClose size={24} />
        </DivButton>
      </div>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
