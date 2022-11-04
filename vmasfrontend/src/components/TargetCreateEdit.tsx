import React, { useState, useEffect } from 'react';
import { Col, Container, Form, InputGroup, Row, Button } from 'react-bootstrap';
import PageBar from './common/PageBar';
import { useParams } from 'react-router-dom';
import { getDataById } from '../staticData';
import { targetDetail } from '../types';


function TargetCreateEdit() {

    const params = useParams();
    const target_edit_id = params?.id;

    const [validated, setValidated] = useState(false);
    const [targetName, setTargetName] = useState('');
    const [targetDesc, setTargetDesc] = useState<string | undefined>('');
    const [targetSubDatas, setTargetSubDatas] = useState<targetDetail[]>([{id:1, attribute:'CallNumber', condition:'Contains', value:''}]);
    let [lastId, setLastId] = useState(targetSubDatas[0].id);

    useEffect(() => {
        if (target_edit_id) {
            const targetDetailed = getDataById(parseInt(target_edit_id))
            setTargetName(targetDetailed.name)
            setTargetDesc(targetDetailed.description)
            setTargetSubDatas(targetDetailed.details)
            setLastId(targetDetailed.details[targetDetailed.details.length-1].id)
        }
    }, [])

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (target_edit_id) {
            console.log('edit')
        } else {
            console.log('create')
        }
        setValidated(true);
    }

    const handleRemoveSubData = (id:number) => {
        if (targetSubDatas.length == 1) {
            setTargetSubDatas([{id:1, attribute:'CallNumber', condition:'Contains', value:''}]);
            setLastId(1);
        } else {
            setTargetSubDatas(targetSubDatas.filter((targetSubData) => targetSubData.id !== id))
        }
    }

    const handleAddSubData = () => {
        setLastId(++lastId);
        setTargetSubDatas([...targetSubDatas, 
            {id:lastId, attribute:'CallNumber', condition:'Contains', value:''}])
    }

    const hangleOnChange = (id:number, event : any) => {
        setTargetSubDatas(targetSubDatas.map((targetSubData, index) => {
            if (targetSubData.id === id) {
                if (event.target.name === 'attribute-select')
                    targetSubData.attribute = event.target.value;
                if (event.target.name === 'condition-select')
                    targetSubData.condition = event.target.value;
                if (event.target.name === 'input-value')
                    targetSubData.value = event.target.value;
            }
            return targetSubData
        }))
    }

    return (
        <React.Fragment>
            <PageBar title='Create Target' />
            
            <Container className='my-5'>
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col sm={6}>
                            <>
                                <Form.Group className="mb-3" controlId="targetName">
                                    <Form.Label style={{'float':'left'}}>Target Name</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            defaultValue={targetName}
                                            type="text"
                                            onChange={ e => {setTargetName(e.target.value)}}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="targetDesc">
                                    <Form.Label style={{'float':'left'}}>Description</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            defaultValue={targetDesc}
                                            as="textarea"
                                            onChange={ e => {setTargetDesc(e.target.value)}}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                {targetSubDatas.map((targetSubData, index) => 
                                    <Row key={index}>
                                        <Col sm={3}>
                                            <Form.Group className="mb-3" controlId={`attr-${targetSubData.id}`}>
                                                <Form.Label style={{'float':'left'}}>Attribute</Form.Label>
                                                <InputGroup>
                                                    <Form.Select 
                                                        name='attribute-select'
                                                        value={targetSubData.attribute} 
                                                        onChange={e => hangleOnChange(targetSubData.id, e)}>
                                                        <option value="CallNumber">CallNumber</option>
                                                        <option value="Mail">Mail</option>
                                                        <option value="ChatId">ChatId</option>
                                                        <option value="IMEI">IMEI</option>
                                                        <option value="IMSI">IMSI</option>
                                                        <option value="TMSI">TMSI</option>
                                                        <option value="SIPID">SIPID</option>
                                                    </Form.Select>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-3" controlId={`cond-${targetSubData.id}`}>
                                                <Form.Label style={{'float':'left'}}>Attribute</Form.Label>
                                                <InputGroup>
                                                    <Form.Select
                                                        name='condition-select'
                                                        value={targetSubData.condition} 
                                                        onChange={e => hangleOnChange(targetSubData.id, e)}>
                                                            <option value="Contains">Contains</option>
                                                            <option value="Equal">Equal</option>
                                                            <option value="Begins">Begins</option>
                                                            <option value="Ends">Ends</option>
                                                    </Form.Select>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-3" controlId={`value-${targetSubData.id}`}>
                                                <Form.Label style={{'float':'left'}}>Value</Form.Label>
                                                <InputGroup hasValidation>
                                                    <Form.Control
                                                        name='input-value'
                                                        as='input'
                                                        onChange={e => hangleOnChange(targetSubData.id, e)}
                                                        value={targetSubData.value}
                                                        type="text"
                                                        placeholder='Enter Text'
                                                        required
                                                    />
                                                    <Form.Control.Feedback type="invalid">Please fill value for the added row.</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Button onClick={() => handleRemoveSubData(targetSubData.id)} style={{'marginTop':'32px'}} variant='danger'>Remove</Button>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <Col sm={9}></Col>
                                    <Col sm={3}>
                                        <Button onClick={handleAddSubData} style={{'marginTop':'3px'}} variant='success'>Add More</Button>
                                    </Col>
                                </Row>
                                <Button className='mx-5' variant='primary' type='submit'>Create</Button>
                                <Button variant='primary' href='/target'>Skip</Button>
                            </>
                        </Col>
                    </Row>
                    
                </Form>
            </Container>
        </React.Fragment>
    );
}

export default TargetCreateEdit;