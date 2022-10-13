import React from 'react';
import { Button } from 'react-bootstrap';
import { receiver } from '../../staticData';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}
interface ReceiverTableProps {
    receivers : receiver[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (receiver : receiver) => void,
    openModalOnDelete: (receiver: receiver) => void,
}

function ReceiverTable({receivers, sortColumn, onSort, openModalOnEdit, openModalOnDelete} : ReceiverTableProps) {
    const columns = [
        {
            path:'name', 
            label:'Roles'
        },
        {   
            path:'created_at', 
            label:'Created At'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (receiver : receiver) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(receiver)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(receiver)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={receivers} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default ReceiverTable;