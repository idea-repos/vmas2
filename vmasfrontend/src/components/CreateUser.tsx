import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PageBar from './common/PageBar';
import Container from 'react-bootstrap/Container';
import axios from '../api/axios';
import { AxiosError } from 'axios';

const CREATE_USER_URL = 'create-new-user/';
const GET_ROLES = 'roles/'

function CreateUser() {
    let params_user_id = useParams<string>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState<{id:number, name:string}[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [isactive, setIsActive] = useState(true);
    const [reportingOfficer, setReportingOfficer] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errResponse, setErrResponse] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        const getRoles = async () => {
            const {data} = await axios.get(GET_ROLES)
            setRoles(data)
        }
        getRoles();
    }, [])

    useEffect(() => {
        if (params_user_id?.id != null) {
            const SINGLE_USER_URL = `users/${params_user_id.id}/edit`;
            const getSingleUser = async () => {
                const {data} = await axios.get(SINGLE_USER_URL)
                setIsActive(data.status == "active")
                setUsername(data.username)
                setUserRole(data.roles)
            }
            getSingleUser();
        }
    }, [params_user_id])

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (params_user_id?.id == null){
            if (password != confirmPassword) {
                setErrResponse('Password not match')
                return;
            }
            try {
                const response = await axios.post(CREATE_USER_URL, JSON.stringify({username, password, roles, reportingOfficer}))
                console.log(response.data)
                // navigate('/users')
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
        } else {
            const EDIT_USER_URL = `users/${params_user_id.id}/edit/`
            try {
                const {data} = await axios.post(EDIT_USER_URL, JSON.stringify({username, isactive, roles, reportingOfficer}))
                console.log(data)
            } catch (e) {
                const err = e as AxiosError
                if (!err?.response) 
                    setErrResponse('Server Down Please Try Again Later')
                else
                    setErrResponse('Something Went Wrong')
            }
        }

        setValidated(true);
    };
    
    return (
        <>
            <PageBar title={params_user_id.id != null ? 'Edit User' : 'Create New User'}/>
            <Container className='my-5'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">User Name</InputGroup.Text>
                            <Form.Control
                                defaultValue={username}
                                type="text"
                                placeholder="Username"
                                aria-describedby="inputGroupPrepend"
                                onChange={ e => {setUsername(e.target.value)}}
                                required
                            />
                            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {
                        params_user_id?.id != null ? 
                                                <> 
                                                    <label className="form-label">Password</label>
                                                    <div className="form-text mb-3">
                                                        Raw passwords are not stored, so there is no way to see this user's password, but you can change the password using <a href={`../../users/${params_user_id.id}/password/change`} className='link'>this form </a>
                                                    </div>
                                                    <Form.Check
                                                        defaultChecked={false}
                                                        className='mb-3'
                                                        type='checkbox'
                                                        id='active'
                                                        onChange={e => setIsActive(!(isactive))}
                                                        label='Active: Unselect for deleting accounts.'/> 
                                                </> :
                                        
                                            <>
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
                                            </>
                    }
                    <Form.Group className="mb-3" controlId="roles">
                        <InputGroup>
                            <InputGroup.Text id="inputGroupPrepend">Roles</InputGroup.Text>
                            <Form.Select value={params_user_id?.id != null ? userRole : "1"} onChange={ e => {setUserRole(e.target.value)}}>
                                {roles.map(role => <option  key={role.id} value={role.id}>{role.name}</option>)}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reporting-officer">
                        <InputGroup>
                            <InputGroup.Text id="inputGroupPrepend">Reporting Officer</InputGroup.Text>
                            <Form.Select aria-label="Default select example" onChange={e => {setReportingOfficer(e.target.value)}}>
                                <option value='1'>User 1</option>
                                <option value="2">User 2</option>
                                <option value="3">User 3</option>
                                <option value="4">User 4</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    {errResponse && <div className="alert alert-danger mb-3">{errResponse} </div>}
                    <Button type="submit">Submit</Button>
                </Form>
            </Container>
        </>
    );
}

export default CreateUser;