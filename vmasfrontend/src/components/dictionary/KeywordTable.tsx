import React from 'react';
import { keyword } from '../../staticData';
import { Button } from 'react-bootstrap';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface KeywordTableProps {
    keywords : keyword[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (keyword : keyword) => void,
    openModalOnDelete: (keyword: keyword) => void,
}

function KeywordTable({keywords, sortColumn, onSort, openModalOnEdit, openModalOnDelete} : KeywordTableProps) {
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
            content: (keyword : keyword) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(keyword)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(keyword)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={keywords} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}


export default KeywordTable;