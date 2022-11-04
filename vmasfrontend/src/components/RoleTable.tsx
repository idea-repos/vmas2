import React from 'react';
import Table from './common/Table';
import { Button } from 'react-bootstrap';
import { role, sortColumn } from '../types';


interface RoleTableProps {
    roles : role[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (role : role) => void,
    openModalOnDelete: (role: role) => void,
}


function RoleTable({roles, sortColumn, onSort, openModalOnEdit, openModalOnDelete}:RoleTableProps) {
    
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
                <Button variant='primary' size='sm' title='Manage Section' href={`role/${role.id}/sections`}><i className="fa fa-lock" aria-hidden="true"></i></Button>
                <Button variant='primary' size='sm' title='Manage Permission' className='mx-1'><i className="fa fa-user-secret" aria-hidden="true"></i></Button>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(role)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(role)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
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