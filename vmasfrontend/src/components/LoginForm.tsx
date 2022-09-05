import  Input from './common/Input';
import React, {useRef, useState, useEffect, useContext} from 'react';
import axios from '../api/axios';
import { AxiosError } from 'axios';


const LOGIN_URL = 'login/';

const LoginForm = () => {
    // const { setAuth } = useContext(AuthContext)
    const errRef = useRef<any>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        try {
            const respone = await axios.post(LOGIN_URL, JSON.stringify({username, password}))
            const user_id = respone?.data?.id;
            const roles = respone?.data?.roles;
            const user_detail = respone?.data?.user_detail;
            // setAuth({username, password, roles, user_detail, user_id})
            console.log(respone.data)
            setUsername('');
            setPassword('');
            setSuccess(true)
        } catch (error ) {
            const err = error as AxiosError
            if (!err?.response) {
                setErrMsg('No server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Passowrd');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
        }
    }

    return (
        <section>
            <h1>Login Form</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                    name='username' 
                    label='Username' 
                    type='text' 
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeHolder={'Enter the Username'}
                    value={username}
                    required={true}
                />
                <Input 
                    name='password' 
                    label='Password' 
                    type='password' 
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeHolder={'Enter the Password'}
                    value={password}
                    required={true}
                />
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
            
            {errMsg && <div className='alert alert-danger' aria-live='assertive' ref={errRef}>{errMsg}</div>}
        </section>
    );
}

export default LoginForm;