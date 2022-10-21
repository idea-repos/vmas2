import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PageBar from './common/PageBar';
import Container from 'react-bootstrap/Container';
import axios from '../api/axios';
import { role } from './RoleTable';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { loadRoles } from '../store/roles';
import { createUser, updateUser } from '../store/users';

const DEFAULT_USER_ROLE = '5' // Operator 1
const DEFAULT_USER_OFFICER = '0' // No one

function CreateUser() {
    let params_user_id = useParams<string>();
    
    const dispatch = useDispatch();
    const roles = useSelector((state:any) => state.entities.roles.list);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [group, setUserRole] = useState<string>(DEFAULT_USER_ROLE);
    const [is_active, setIsActive] = useState<any>();
    let [reporting_officer, setReportingOfficer] = useState<string | null>(DEFAULT_USER_OFFICER);
    const [allReportingOfficer, setAllReportinOfficer] = useState<{id:number, username:string}[]>([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errResponse, setErrResponse] = useState('');
    const [validated, setValidated] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(loadRoles())
    }, [])

    useEffect(() => {
        if (params_user_id?.id != null) {
            const SINGLE_USER_URL = `api/users/${params_user_id.id}/`;
            const getSingleUser = async () => {
                const {data} = await axios.get(SINGLE_USER_URL)
                setUsername(data.username)
                setIsActive(data.is_active)
                setUserRole(data.group)
                setReportingOfficer(data.reporting_officer)
            }
            getSingleUser();
        }
    }, [params_user_id])

    useEffect(() => {
        const REPORTIN_USER_URL = `api/reportofficer/${group}/`;
        const getAllReportingUsers = async () => {
            const {data} = await axios.get(REPORTIN_USER_URL);
            setAllReportinOfficer(data);
        }
        getAllReportingUsers();
        setReportingOfficer(DEFAULT_USER_OFFICER);
    }, [group])

    const handleSubmit = (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (params_user_id?.id == null){
            if (password != confirmPassword) {
                setErrResponse('Password not match')
                return;
            } else {
                dispatch(createUser({username, password, group, reporting_officer}))
                navigate('/users')
            }
        } else {
            if (reporting_officer === '0') {
                reporting_officer = null
            }
            dispatch(updateUser(parseInt(params_user_id.id), {username,is_active ,group, reporting_officer}))
            navigate('/users')
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
                                                        defaultChecked={is_active}
                                                        onChange={e => setIsActive(e.target.value)}
                                                        className='mb-3'
                                                        type='checkbox'
                                                        id='active'
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
                            <Form.Select value={group} onChange={ e => {setUserRole(e.target.value)}}>
                                {roles.map((role : role) => <option  key={role.id} value={role.id}>{role.name}</option>)}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reporting-officer">
                        <InputGroup>
                            <InputGroup.Text id="inputGroupPrepend">Reporting Officer</InputGroup.Text>
                            <Form.Select value={reporting_officer == null ? '0':reporting_officer} onChange={e => {setReportingOfficer(e.target.value)}}>
                                <option disabled value='0'></option>
                                {allReportingOfficer.map(officer => <option key={officer.id} value={officer.id}>{officer.username}</option>)}
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