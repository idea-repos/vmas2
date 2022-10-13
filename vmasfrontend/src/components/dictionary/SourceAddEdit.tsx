import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { source, sources } from '../../staticData';
import PageBar from '../common/PageBar';

function SourceAddEdit() {
    const params = useParams<string>();

    const [source, setSource] = useState<source>();
    const [newSource, setNewSource] = useState('');
    const [alias, setNewAlias] = useState('');
    const [validated, setValidated] = useState(false);
    const [errResponse, setErrResponse] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if (params?.id !== "name" && params?.id !== undefined) {
            const getSourceById = (id : number) => {
                const data = sources.filter(source => source.id == id)[0]
                setSource(data)
                setNewAlias(data.alias)
            }
            getSourceById(parseInt(params.id))
        }
    }, [params])

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (params?.id == "name"){
            
        } else {

        }
        setValidated(true);
    }

    return (
        <React.Fragment>
            <PageBar title={params.id == 'name' ? 'GIVE ALIAS (SOURCE) WRITE CORRECT SOURCE. EVEN AUTO COMPLETE OPTION IS GIVEN' : `EDIT (${source?.source})`}/>
        
        <Container className='my-5'>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="source">
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">Source:</InputGroup.Text>
                        <Form.Control
                            defaultValue={source?.source}
                            readOnly={params?.id !== "name" ? true : false}
                            type="text"
                            onChange={ e => setNewSource(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="alias">
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">Alias:</InputGroup.Text>
                        <Form.Control
                            defaultValue={alias}
                            type="text"
                            onChange={ e => setNewAlias(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                
                {errResponse && <div className="alert alert-danger mb-3">{errResponse} </div>}
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
        </React.Fragment>
    );
}

export default SourceAddEdit;