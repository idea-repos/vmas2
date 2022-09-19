import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Table from './common/Table';

export interface targetDetail {
    id: number
    attribute : string,
    condition: string,
    value: string
}

export interface target {
    id : number;
    name : string;
    created_at : Date | number;
    notes: string;
    description?: string;
    details: targetDetail[]
}

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface TargetTableProps {
    targets: target[];
    onSort : (sortColumn : sortColumn) => void;
    sortColumn : sortColumn;
    OpenModalForDelete: (id:number) => void;
    OpenModalForView: (target:target) => void;
}

function TargetTable({targets, sortColumn, onSort, OpenModalForDelete, OpenModalForView} : TargetTableProps) {

    const navigate = useNavigate();

    const navigateToEdit = (item:target) => {
        navigate(`${item.id}/edit`, {state: {data:item}})
    }

    const columns = [
        {
            path:'name', 
            label:'Target'
        },
        {   
            path:'created_at', 
            label:'Created' 
        },
        {
            label:'Action',
            key:'del-view-edit', 
            content: (target: target) =>
                <>
                    <Button onClick={() => OpenModalForDelete(target.id)} variant='danger' size='sm'>Delete</Button>{' '}
                    <Button onClick={() => OpenModalForView(target)} variant='secondary' size='sm'>View</Button>{' '}
                    <Button onClick={() => navigateToEdit(target)} variant='primary' size='sm' >Edit</Button>
                </>
       },
       {   
            path:'notes', 
            label:'Notes'
       } 
   ]

    return (
        <Table 
                columns={columns} 
                data={targets} 
                onSort={onSort}
                sortColumn={sortColumn}/>  
    );
}

export default TargetTable;