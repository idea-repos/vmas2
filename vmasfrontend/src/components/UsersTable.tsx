import React from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';


export interface user {
    _id : number;
    username : string,
    role : string,
    lastlogin: Date | string,
    status : string,
}

interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface UserTableProps {
    users : user[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
}

function UsersTable(props : UserTableProps) {


    const columns = [
        {
            path:'username', 
            label:'Username'
        },
        {   
            path:'roles', 
            label:'Roles'
        },
        {
            path:'lastlogin', 
            label:'Last Login'
        },
        {   
            path:'status', 
            label:'Status'
        },
        {
            label:'Action',
            key:'edit', 
            content: (user : user)=><Link to={`/users/${user._id}/edit`}>Edit</Link>
       }
   ]

        const {users, sortColumn, onSort} = props;
        return (
            <Table 
                columns={columns} 
                data={users} 
                onSort={onSort}
                sortColumn={sortColumn}/>  
        );
    
}

export default UsersTable;
