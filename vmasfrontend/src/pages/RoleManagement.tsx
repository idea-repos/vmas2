import axios from '../api/axios';
import React, { useEffect, useState } from 'react';
import PageBar from '../components/common/PageBar';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import CustomModal from '../components/common/CustomModal';
import { AxiosError } from 'axios';
import RoleTable, { role } from '../components/RoleTable';
import SearchBox from '../components/common/SearchBox';
import _ from 'lodash';
import { paginate } from '../utils/paginate';
import Pagination from '../components/common/Pagination';
import Alert  from 'react-bootstrap/Alert';
import ShowEntries from '../components/common/ShowEntries';


const GET_ROLES_URL = '/api/roles/'
const USER_REPORTING_TO = ''
const NEW_ROLE_ID = 0
interface sortColumn {path:string, order : boolean | "asc" | "desc"};

function RoleManagement () {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setRole] = useState('');
    const [roleId, setRoleId] = useState(NEW_ROLE_ID);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [allRole, setAllRole] = useState<{id:number, name:string, users_count:number}[]>([]);
    const [reports_to, setUserReportTo] = useState(USER_REPORTING_TO)
    const [validated, setValidated] = useState(false);
    const [errResponse, setErrResponse] = useState('');
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    const [searchQuery, setSearchQuery] = useState('');
    const [flashMessage, setFlashMessage] = useState("");

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const EDIT_ROLE_URL = `${GET_ROLES_URL}${roleId}/`
            if (roleId === 0) {
                try {
                    const {data} = await axios.post(GET_ROLES_URL, JSON.stringify({name, reports_to}));
                    setFlashMessage('New Role Created');
                    handleClose()
                } catch (e) {
                    const err = e as AxiosError;
                    if (err.response?.status == 400)
                        setErrResponse('Role already exists');
                }
            } else {
                try {
                    const {data} = await axios.put(EDIT_ROLE_URL, JSON.stringify({name, reports_to}));
                    handleClose()
                    setFlashMessage('Role Updated');
                } catch (e) {
                    const err = e as AxiosError;
                    if (err.response?.status == 400)
                        setErrResponse('Role already exists');
                }
            }
            
        }
        setValidated(true);
    };

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handlePageChange = (page:number) : void => {
        setCurrentPage(page)
    }

    const openModalOnEdit = (role : role) => {
        console.log(role)
        setRole(role.name);
        setRoleId(role.id);
        setUserReportTo(role.reports_to)
        handleShow()
    }

    useEffect(() => {
        const getRoles = async () => {
            const {data} = await axios.get(GET_ROLES_URL)
            setAllRole(data)
        }
        getRoles();
    }, [])

    const getPageData = () => {
        let filtered = allRole;
        
        if (searchQuery) {
            filtered = allRole.filter(role => role.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }

    const {totalCount, data : page_roles} = getPageData()

    return (
        <React.Fragment>
            <div className="container">
                <PageBar
                    havingChildren={true} 
                    title='Role Management'>
                    <Button variant="primary" onClick={handleShow}>
                        Add Role
                    </Button>
                </PageBar>
                
                {flashMessage && <Alert variant='success'>{flashMessage}</Alert>}
                
                <Row>
                    <Col sm={4}>
                        <ShowEntries 
                            pageSize={pageSize} 
                            handlePageSize={e => setPageSize(parseInt(e.target.value))}/>
                    </Col>
                    <Col sm={8}>
                        <SearchBox value={searchQuery} onChange={handleSearch} />
                    </Col>
                </Row>
                
                <RoleTable 
                    roles={page_roles}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    openModalOnEdit={openModalOnEdit}
                />

                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
                
                <CustomModal
                    errMessage={errResponse}
                    heading='Add Role'
                    havingSave={true}
                    saveButton={<Button form='role-form' variant="primary" type='submit'>Save</Button>}
                    show={show}
                    onHide={handleClose}>
                        <Form noValidate id='role-form' validated={validated} onSubmit={handleSubmit}>
                            <Form.Control
                                defaultValue={roleId}
                                type="hidden"
                                aria-describedby="inputGroupPrepend"
                            />
                            <Form.Group className="mb-3" controlId="rolename">
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">Role Name</InputGroup.Text>
                                    <Form.Control
                                        defaultValue={name}
                                        type="text"
                                        placeholder="Role Name"
                                        aria-describedby="inputGroupPrepend"
                                        onChange={ e => {setRole(e.target.value)}}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="reportTo">
                                <InputGroup>
                                    <InputGroup.Text id="inputGroupPrepend">Roles</InputGroup.Text>
                                    <Form.Select value={reports_to || ''} onChange={ e => {setUserReportTo(e.target.value)}}>
                                        <option value=''></option>
                                        {allRole.map(role => <option  key={role.id} value={role.id}>{role.name}</option>)}
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                </CustomModal>
            </div>
        </React.Fragment>
    );
}

export default RoleManagement;