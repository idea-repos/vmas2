import axios from '../api/axios';
import React, { Component, useEffect } from 'react';
import UsersTable, { user } from '../components/UsersTable';
import Pagination from '../components/common/Pagination';
import _ from 'lodash';
import { paginate } from '../utils/paginate';
import { useState } from 'react';
import PageBar from '../components/common/PageBar';
import SearchBox from '../components/common/SearchBox';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

const GET_USERS_URL = 'users/'

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

    useEffect(() => {
        const getUsers = async () => {
            const {data} = await axios.get(GET_USERS_URL)
            setUsers(data)
        }
        getUsers();
    })

    const getPageData = () => {
        let filtered = users;
        
        if (searchQuery) {
            filtered = users.filter(user => user.username.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_users = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_users};
    }

    if (users.length === 0) {
        return <p>No movies in the database</p>;
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
                <SearchBox value={searchQuery} onChange={handleSearch} />
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
