import axios from '../api/axios';
import React, { FormEvent, useEffect, useState } from 'react';
import PageBar from '../components/common/PageBar';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import CustomModal from '../components/common/CustomModal';
import RoleTable from '../components/RoleTable';
import SearchBox from '../components/common/SearchBox';
import _ from 'lodash';
import { paginate } from '../utils/paginate';
import Pagination from '../components/common/Pagination';
import Alert  from 'react-bootstrap/Alert';
import ShowEntries from '../components/common/ShowEntries';
import { role, sortColumn } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { createRole, deleteRole, loadRoles, updateRole } from '../store/roles';


const USER_REPORTING_TO = ''
const NEW_ROLE_ID = 0
const DEFAULT_ITEM_PER_PAGE = 5

function RoleManagement () {

    const dispatch = useDispatch();
    const fetchRoles : role[] = useSelector((state : any) => state.entities.roles.list);
    const [show, setShow] = useState(false);
    
    const handleClose = () => {
        setRoleId(NEW_ROLE_ID);
        setRole('')
        setUserReportTo(USER_REPORTING_TO)
        setShow(false)
    };
    
    const handleShow = () => setShow(true);

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [name, setRole] = useState('');
    const [roleId, setRoleId] = useState(NEW_ROLE_ID);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_ITEM_PER_PAGE);
    const [reports_to, setUserReportTo] = useState(USER_REPORTING_TO)
    const [validated, setValidated] = useState(false);
    const [errResponse, setErrResponse] = useState('');
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    const [searchQuery, setSearchQuery] = useState('');
    const [flashMessage, setFlashMessage] = useState("");

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (roleId === 0) {
                dispatch(createRole({name, reports_to}))
                setFlashMessage('New Role Created');
                handleClose()
            } else {
                dispatch(updateRole(roleId, {name, reports_to}))
                handleClose()
                setFlashMessage('Role Updated');
            } 
        }
        setValidated(true);
    };

    const handleOnDelete = (e : React.FormEvent) => {
        dispatch(deleteRole(roleId));
        handleCloseDelete()
        setFlashMessage('Role Deleted');
    }

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
        setRole(role.name);
        setRoleId(role.id);
        setUserReportTo(role.reports_to)
        handleShow()
    }

    const openModalOnDelete = (role: role) => {
        setRoleId(role.id);
        handleShowDelete();
    }

    useEffect(() => {
        // enhance performance (use memoize, callBack fn here)
        dispatch(loadRoles());
    }, [])

    const getPageData = () => {
        let filtered = fetchRoles;
        
        if (searchQuery) {
            filtered = filtered.filter(role => role.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
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
                    openModalOnDelete={openModalOnDelete}
                />

                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
                
                <CustomModal 
                    buttons={[<Button onClick={handleOnDelete} variant="danger">Delete</Button>]}
                    heading='Delete Role'
                    show={showDelete}
                    onHide={handleCloseDelete}
                    >
                    <Card body>
                        All users assigned this role will be treated as free users. 
                        Are your sure  you want to delete the role?
                    </Card>
                </CustomModal>

                <CustomModal
                    errMessage={errResponse}
                    heading='Add Role'
                    buttons={[<Button form='role-form-edit' variant="primary" type='submit'>Save</Button>]}
                    show={show}
                    onHide={handleClose}>
                        <Form noValidate id='role-form-edit' validated={validated} onSubmit={handleSubmit}>
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
                                    <InputGroup.Text id="inputGroupPrepend">Report To</InputGroup.Text>
                                    <Form.Select value={reports_to || ''} onChange={ e => {setUserReportTo(e.target.value)}}>
                                        <option value=''></option>
                                        {fetchRoles.map(role => <option  key={role.id} value={role.id}>{role.name}</option>)}
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