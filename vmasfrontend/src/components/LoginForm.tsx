<<<<<<< HEAD
import  Input from './common/Input';
import React, {useRef, useState, useEffect, useContext} from 'react';
=======
import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
>>>>>>> bootstrap-react
import axios from '../api/axios';
import { AxiosError } from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'login/';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errResponse, setErrResponse] = useState('');
    let navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const respone = await axios.post(LOGIN_URL, JSON.stringify({username, password}))
                const user_id = respone?.data?.id;
                const roles = respone?.data?.roles;
                const user_detail = respone?.data?.user_detail;
                navigate('/home');
            } catch (error ) {
                const err = error as AxiosError
                if (!err?.response) {
                    setErrResponse('Server Down Please Try Again Later')
                } else if (err.response?.status === 401) {
                    setErrResponse('Given Credential Is Not Correct')
                } else {
                    setErrResponse('Login Failed')
                }
                setUsername('')
                setPassword('')
            }
        }
        setValidated(true);
      };

    return (
        <>
            { errResponse &&  <Alert variant='danger'>{errResponse}</Alert>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Col} md="4" controlId="loginform">
                    <Form.Label>Username</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type="text"
                            name='username'
                            value={username}
                            placeholder="Username"
                            aria-describedby="inputGroupPrepend"
                            onChange={ e => {setUsername(e.target.value)}}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please Provide a Username
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        name='password' 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={ e => {setPassword(e.target.value)}}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Please Provide a Password
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Login</Button>
        </Form>
    </>
    );
}

export default LoginForm;