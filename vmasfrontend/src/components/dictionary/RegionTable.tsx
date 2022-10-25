import React from 'react';
import { region } from '../../staticData';
import { Button } from 'react-bootstrap';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface RegionTableProps {
    regions : region[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (region : region) => void,
    openModalOnDelete: (region: region) => void,
    openModalOnAddSub: (region : region) => void,
}

function RegionTable({regions, sortColumn, onSort, openModalOnEdit, openModalOnDelete, openModalOnAddSub} : RegionTableProps) {
    const columns = [
        {
            path:'name', 
            label:'Name'
        },
        {   
            path:'sub_region', 
            label:'Sub Region'
        },
        {   
            path:'created_at', 
            label:'Created At'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (region : region) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(region)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(region)} className='mx-1'><i className="fa fa-trash" aria-hidden="true"></i></Button>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnAddSub(region)}><i className="fa fa-plus" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={regions} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default RegionTable;