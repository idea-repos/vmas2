import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { sortColumn, target } from '../types';
import Table from './common/Table';


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
                    <Button onClick={() => OpenModalForDelete(target.id)} variant='danger' size='sm'><i className="fa fa-trash" aria-hidden="true"></i></Button>{' '}
                    <Button onClick={() => OpenModalForView(target)} variant='secondary' size='sm'><i className="fa fa-eye" aria-hidden="true"></i></Button>{' '}
                    <Button onClick={() => navigateToEdit(target)} variant='primary' size='sm' ><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
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