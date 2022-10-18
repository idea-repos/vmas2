import React, {useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import axios from '../api/axios';
import { AxiosError } from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/auth/authSlice';
import { useLoginMutation } from '../store/auth/authApiSlice';


const LOGIN_URL = 'login/';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errResponse, setErrResponse] = useState('');
    let navigate = useNavigate();


    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();
    
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setErrResponse('')
    }, [username, password])

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const respone = await login({username, password}).unwrap();
                console.log(respone);
                dispatch(setCredentials({...respone, username}))
                setUsername('')
                setPassword('')
                navigate('/home');
            } catch (error ) {
                const err = error as AxiosError
                if (!err?.response) {
                    setErrResponse('No Server Response')
                } else if (err.response?.status === 401) {
                    setErrResponse('Given Credential Is Not Correct')
                } else if (err.response?.status === 400) {
                    setErrResponse('UnAuthorized User')
                } else {
                    setErrResponse('Login Failed')
                } 
            }
        }
        setValidated(true);
    };

    const content = isLoading ? <h1>Loading ...</h1> : 
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
    return content;
}

export default LoginForm;