import axios from '../api/axios';
import React, { useEffect } from 'react';
import UsersTable, { user } from '../components/UsersTable';
import Pagination from '../components/common/Pagination';
import _ from 'lodash';
import { paginate } from '../utils/paginate';
import { useState } from 'react';
import PageBar from '../components/common/PageBar';
import SearchBox from '../components/common/SearchBox';
import ShowEntries from '../components/common/ShowEntries';
import { Alert, Button, Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../components/common/CustomModal';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

const GET_USERS_URL = 'api/users/'

function UserManagement() {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setUserId(0);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const [users, setUsers] = useState<user[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState(0);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'username', order:"asc"});
    const [flashMessage, setFlashMessage] = useState('');
    

    const handleDelete =  async (hardDelete:boolean) => {
        const DELETE_USER_URL = `api/users/${userId}`
        try {
            const {data} = await axios.delete(DELETE_USER_URL, { data: { hard_delete: hardDelete } })
            setFlashMessage(data.message)
            setUsers(users.filter(user => user.id !== userId))
            handleClose()
        } catch (e) {
            console.log('getting errror from backend')
        }
    }

    const openModalForDelete = (id:number) => {
        setUserId(id);
        handleShow();
    }

    const handlePageChange = (page:number) : void => {
        setCurrentPage(page)
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const {state} : {state:any} = useLocation();

    useEffect(() => {
        const getUsers = async () => {
            const {data} = await axios.get(GET_USERS_URL)
            const userMani = data.map((user : user) => {
                if (user.is_active == true) {
                    user['is_active'] = 'active'
                } else {
                    user['is_active'] = 'inactive'
                }
                return user
            })
            setUsers(userMani)
        }
        getUsers();
    }, [])

    const getPageData = () => {
        let filtered = users;
        
        if (searchQuery) {
            filtered = users.filter(user => user.username.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_users = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_users};
    }

    const {totalCount, data : page_users} = getPageData()
    
    return (
        <React.Fragment>
            <div className="container">
                <PageBar 
                    title='USER MANAGEMENT'
                    havingChildren={true}>
                        <a className='btn btn-secondary' href='users/create'>Create User</a>
                </PageBar>

                {state?.message && <Alert variant='success'>{state.message}</Alert>}
                
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
                
                <UsersTable 
                    users = {page_users}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    openModalForDelete={openModalForDelete}
                />

                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>

            <CustomModal 
                    heading='Delete User'
                    buttons={[
                                <Button onClick={() => handleDelete(false)} variant="warning">Soft Delete</Button>,
                                <Button onClick={() => handleDelete(true)} variant="danger">Hard Delete</Button>]}
                    show={show}
                    onHide={handleClose}
                    >
                    <Card body>
                        Deleting User From Database (Go For Hard Delete)
                        Securing Data Of User (Go For Soft Delete)
                    </Card>
            </CustomModal>
        </React.Fragment>
    )
}

export default UserManagement;
