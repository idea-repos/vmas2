import React, { useEffect, useState } from 'react';
import UsersTable from '../components/UsersTable';
import Pagination from '../components/common/Pagination';
import _ from 'lodash';
import { paginate } from '../utils/paginate';
import PageBar from '../components/common/PageBar';
import SearchBox from '../components/common/SearchBox';
import ShowEntries from '../components/common/ShowEntries';
import { Alert, Button, Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
import CustomModal from '../components/common/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, loadUsers } from '../store/users';
import { sortColumn, user } from '../types';


function UserManagement() {

    const dispatch = useDispatch();
    const fetchUsers = useSelector((state : any) => state.entities.users.list);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setUserId(0);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState(0);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'username', order:"asc"});
    const [_flashMessage, setFlashMessage] = useState('');
    

    const handleDelete =  (hardDelete:boolean) => {
        dispatch(deleteUser(userId, hardDelete))
        handleClose()
        setFlashMessage('User Deleted Succesfully');
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
        // enhance performance (use memoize, callBack fn here)
        dispatch(loadUsers())
    }, [])

    const getPageData = () => {
        let filtered = (fetchUsers as user[]);
        
        if (searchQuery) {
            filtered  = filtered.filter(user => user.username.toLowerCase().startsWith(searchQuery.toLowerCase()));
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
