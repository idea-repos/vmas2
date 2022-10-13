import React from 'react';
import { source } from '../../staticData';
import { Button } from 'react-bootstrap';
import Table from '../common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface SourceTableProps {
    sources : source[];
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnDelete: (source: source) => void,
}

function SourceTable({sources, sortColumn, onSort, openModalOnDelete} : SourceTableProps) {
    const columns = [
        {
            path:'source', 
            label:'Source'
        },
        {   
            path:'alias', 
            label:'Alias'
        },
        {
            path: 'intercept_on',
            label: 'Intercept On'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (source : source) =>
            <>
                <Button variant='secondary' size='sm' title='Edit' href={`/dir_mgmt/dict/listing/source/${source.id}`} className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button variant='danger' size='sm' title='Delete' onClick={() => openModalOnDelete(source)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={sources} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default SourceTable;