import axios from '../api/axios';
import React, { Component } from 'react';
import UsersTable, { user } from '../components/UsersTable';
import Pagination from '../components/common/Pagination';
import _ from 'lodash';
import { paginate } from '../utils/paginate';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

interface UserManagementState {
    users : user[],
    pageSize : number,
    currentPage : number,
    sortColumn : sortColumn,
}



class UserManagement extends Component {
    GET_USERS_URL = 'users/'

    state : UserManagementState = {
        users : [],
        pageSize: 4,
        currentPage : 1,
        sortColumn : {path:'username', order:"asc"}
    }
    
    handlePageChange = (page:number) : void => {
        this.setState({currentPage:page})
    }

    handleSort = (sortColumn : sortColumn) => {
        this.setState({sortColumn})
     }

    async componentDidMount () {
        const {data} = await axios.get('users/')
        console.log(data)
        this.setState({users : data})
    }

    getPageData = () => {

        let {users : allUsers, pageSize, currentPage, sortColumn} = this.state;

        const sorted = _.orderBy(allUsers, [sortColumn.path], [sortColumn.order]);

        const users = paginate(sorted, currentPage, pageSize);

        return {totalCount : sorted.length, data : users};
    }

    render() : JSX.Element {
        let {users : allUsers, sortColumn, currentPage, pageSize} = this.state;
        if (allUsers.length === 0) {
            return <p>No movies in the database</p>;
        }
        let {totalCount, data:users} = this.getPageData()
        return (
            <React.Fragment>
                <div className="container">
                    <UsersTable 
                        users = {users}
                        onSort={this.handleSort}
                        sortColumn={sortColumn}
                    />
                    <Pagination 
                        itemCount={totalCount} 
                        pageSize={pageSize} 
                        onPageChange={this.handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default UserManagement;