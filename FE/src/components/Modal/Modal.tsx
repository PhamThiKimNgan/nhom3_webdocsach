import { useRef } from 'react'
import './Modal.scss'

const Modal = (props: { active: boolean, children: React.ReactNode }) => {
    return (
        <div className={`modal ${props.active ? 'active' : ''}`} >
            {props.children}
        </div>
    )
}
type ModalContentProps = {
    onClose: Function,
    children: React.ReactNode,
    style?: Object
}
export const ModalContent = (props: ModalContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const closeModal = () => {
        if (contentRef.current?.parentNode) {
            contentRef.current.parentElement?.classList.remove('active');
        }
        if (props.onClose) props.onClose()
    }
    return (
        <div ref={contentRef} className="modal__body active" style={props.style}>
            <div className="modal__body__close" onClick={closeModal}>
                <i className='bx bx-x fs-26'></i>
            </div>
            <div className="modal__content">
                {props.children}
            </div>
        </div>
    )
}


export default Modal
