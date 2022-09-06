import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface CustomModal {
    children : any,
    havingSave?: boolean,
    heading: string,
    show : boolean,
    onHide : () => void,
    saveButton?: any,
    errMessage? :string,
}

function CustomModal({children, heading, show, onHide, havingSave, saveButton, errMessage} : CustomModal) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
            <Modal.Title>{heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {errMessage && <div className='alert alert-danger'>{errMessage}</div>}
            <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Close
            </Button>
            {havingSave && saveButton}
            </Modal.Footer>
        </Modal>
    );
}

export default CustomModal;