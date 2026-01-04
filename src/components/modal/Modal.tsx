'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import { XIcon } from 'lucide-react';

export interface ModalProps {
  children: ReactNode;
  className?: string;
  styles?: CSSProperties;
}

export const Modal = ({ children, className = '', styles = {} }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={modalRef}
      className={`relative bg-white rounded-lg shadow-xl flex flex-col ${className}`}
      onClick={(e) => e.stopPropagation()}
      style={styles}
    >
      {children}
    </div>
  );
};

const ModalHeader = ({ title, onClose }: { title: string; onClose?: () => void }) => {
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

const ModalContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 flex-1 ${className}`}>{children}</div>;
};

const ModalFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex items-center justify-end gap-2 p-6 pt-4 ${className}`}>{children}</div>;
};

// Modal 컴포넌트에 서브 컴포넌트 연결
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
