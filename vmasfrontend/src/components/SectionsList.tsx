import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

interface SectionsListProps {
    sectionName : string;
    isChecked : boolean;
    id: number;
    onHandleChange: (id : number, e:React.ChangeEvent<HTMLInputElement>) => void;
}

function SectionsList({sectionName, isChecked, id, onHandleChange} : SectionsListProps) {
    return (
        <Row className='my-3'>
            <Col sm={6}>
                <Row>
                    <Col sm={4}>
                        <p>{sectionName}</p>
                    </Col>
                    <Col sm={8}>
                        <Form.Check onChange={(e) => onHandleChange(id, e)} id={`${id}`} type='checkbox' defaultChecked={isChecked}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default SectionsList;