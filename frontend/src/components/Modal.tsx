import React from "react";
import { IoMdClose } from "react-icons/io";


interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-header">
        {title && <h3 className="modal-title">{title}</h3>}
        <button
          className="modal-close-button"
          onClick={() => onClose()}
        >
          <IoMdClose size={16} />
        </button>
      </div>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
