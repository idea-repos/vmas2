import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import PageBar from '../components/common/PageBar';

function PasswordChange() {

    let params_user_id = useParams<string>();
    let navigate = useNavigate();

    const EDIT_USER_URL = `api/users/${params_user_id.id}/`

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [errResponse, setErrResponse] = useState('');

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (password != confirmPassword) {
                setErrResponse('Password not match')
                return;
            }
            try {
                const {data} = await axios.put(EDIT_USER_URL, JSON.stringify({password}))
                navigate('/users', {state : {message : 'User Password Changed'}})
            } catch (e) {
                const err = e as AxiosError
                if (!err?.response)
                    setErrResponse('Server Down Please Try Again Later')
                else if (err.response.status == 409)
                    setErrResponse('Username already exists')
                else {
                    setErrResponse('Something Went Wrong')
                }
            }
        }

        setValidated(true);
    };
    
    return (
        <div>
            <PageBar title='Change Password' />
            
            <Form className='my-5' noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="password">
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">Password</InputGroup.Text>
                            <Form.Control
                            type="password"
                            placeholder="password"
                            aria-describedby="inputGroupPrepend"
                            onChange={ e => {setPassword(e.target.value)}}
                            required
                            />
                            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirm-password">
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">Confirm Password</InputGroup.Text>
                            <Form.Control
                            type="password"
                            placeholder="confirm password"
                            onChange={ e => {setConfirmPassword(e.target.value)}}
                            aria-describedby="inputGroupPrepend"
                            required
                            />
                            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {errResponse && <Alert variant='danger'>{errResponse}</Alert>}
                    <Button type="submit">Submit</Button>
                </Form>
        </div>
    );
}

export default PasswordChange;