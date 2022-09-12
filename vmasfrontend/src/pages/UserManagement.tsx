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
import { Alert, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

const GET_USERS_URL = 'api/users/'

function UserManagement() {

    const [users, setUsers] = useState<user[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'username', order:"asc"});
     

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
                />
                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </React.Fragment>
    )
}

export default UserManagement;
