import React from 'react';
import { Button } from 'react-bootstrap';
import { precedence } from '../../staticData';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface PrecedenceTableProps {
    precedences : precedence[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (precedence : precedence) => void,
    openModalOnDelete: (precedence: precedence) => void,
}

function PrecedenceTable({precedences, sortColumn, onSort, openModalOnEdit, openModalOnDelete} : PrecedenceTableProps) {
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
            content: (precedence : precedence) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(precedence)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(precedence)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={precedences} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default PrecedenceTable;