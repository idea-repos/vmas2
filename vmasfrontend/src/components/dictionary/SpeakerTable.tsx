import React from 'react';
import { Button } from 'react-bootstrap';
import { speaker } from '../../staticData';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface SpeakerTableProps {
    speakers : speaker[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (speaker : speaker) => void,
    openModalOnDelete: (speaker: speaker) => void,
}


function SpeakerTable({speakers, sortColumn, onSort, openModalOnEdit, openModalOnDelete}:SpeakerTableProps) {
    
    const columns = [
        {
            path:'name', 
            label:'Roles'
        },
        {   
            path:'created_at', 
            label:'No Of Users'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (speaker : speaker) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' onClick={() => openModalOnEdit(speaker)} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(speaker)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={speakers} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default SpeakerTable;