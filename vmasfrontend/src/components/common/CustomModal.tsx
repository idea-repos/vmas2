import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';


interface CustomModal {
    children : any,
    heading: string,
    show : boolean,
    onHide : () => void,
    buttons?: any[],
    errMessage? :string,
}

function CustomModal({children, heading, show, onHide, buttons, errMessage} : CustomModal) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
            <Modal.Title>{heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {errMessage && <Alert variant='success'>{errMessage}</Alert>}
            {buttons?.length && 
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    {buttons?.map((button, index) => <div key={index}>{button}</div>)}
                </Modal.Footer>
            }
        </Modal>
    );
}

export default CustomModal;