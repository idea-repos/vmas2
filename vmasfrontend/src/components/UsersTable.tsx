import React from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';


export interface user {
    id : number;
    username : string;
    role : string;
    lastlogin: Date | string;
    status : string;
    is_active: boolean | string;
}

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface UserTableProps {
    users : user[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
}

function UsersTable({users, sortColumn, onSort} : UserTableProps) {

    const columns = [
        {
            path:'username', 
            label:'Username'
        },
        {   
            path:'user_role', 
            label:'Roles'
        },
        {
            path:'last_login', 
            label:'Last Login'
        },
        {   
            path:'is_active', 
            label:'Status'
        },
        {
            label:'Action',
            key:'edit', 
            content: (user : user)=><Link to={`/users/${user.id}/edit`}>Edit</Link>
       }
   ]

        return (
            <Table 
                columns={columns} 
                data={users} 
                onSort={onSort}
                sortColumn={sortColumn}/>  
        );
    
}

export default UsersTable;
