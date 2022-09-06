import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Table from './common/Table';


export interface role {
    id : number;
    name : string,
    users_count : number,
    reports_to : string,
}

interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface RoleTableProps {
    roles : role[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (role : role) => void,
}


function RoleTable({roles, sortColumn, onSort, openModalOnEdit}:RoleTableProps) {
    
    const columns = [
        {
            path:'name', 
            label:'Roles'
        },
        {   
            path:'users_count', 
            label:'No Of Users'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (role : role) =>
            <>
                <button className='btn btn-primary btn-sm'>Privilege</button>
                <button onClick={() => openModalOnEdit(role)} className='btn btn-secondary btn-sm mx-1'>Edit</button>
                <button className='btn btn-danger btn-sm '>Delete</button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={roles} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default RoleTable;