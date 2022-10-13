import React from 'react';
import {  language } from '../../staticData';
import { Button } from 'react-bootstrap';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface LanguageTableProps {
    languages : language[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (language : language) => void,
    openModalOnDelete: (language: language) => void,
}

function LanguageTable({languages, sortColumn, onSort, openModalOnEdit, openModalOnDelete} : LanguageTableProps) {
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
            content: (language : language) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(language)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(language)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={languages} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default LanguageTable;