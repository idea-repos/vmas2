import React from 'react';
import { category } from '../../staticData';
import { Button } from 'react-bootstrap';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface CategoryTableProps {
    categories : category[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (category : category) => void,
    openModalOnDelete: (category: category) => void,
}

function CategoryTable({categories, sortColumn, onSort, openModalOnEdit, openModalOnDelete} : CategoryTableProps) {
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
            content: (category : category) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(category)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(category)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={categories} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default CategoryTable;