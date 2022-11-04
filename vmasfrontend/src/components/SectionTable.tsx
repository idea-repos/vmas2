import React from 'react';
import { Button } from 'react-bootstrap';
import { section, sortColumn } from '../types';
import Table from './common/Table';


interface SectionTableProps {
    sections : section[];
    onSort : (sortColumn : sortColumn) => void;
    sortColumn : sortColumn;
    onHandleEdit : (section: section) => void;
    onHandleDelete: (id : number) => void;
}

function SectionTable({sections, onSort, sortColumn, onHandleEdit, onHandleDelete} : SectionTableProps) {

    const columns = [
        {
            path:'section_name', 
            label:'Section Name'
        },
        {   
            path:'section_desc', 
            label:'Section Description'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (section:section) =>
            <>
                <Button href={`section/${section.id}/permissions`} variant='primary' size='sm'><i className="fa fa-lock" aria-hidden="true"></i></Button>
                <Button className='mx-1' onClick={() => onHandleEdit(section)} variant='secondary' size='sm'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button onClick={() => onHandleDelete(section.id)} variant='danger' size='sm'><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]

    return (
        <Table 
            columns={columns} 
            sortColumn={sortColumn}
            onSort={onSort}
            data={sections}/>
    );
}

export default SectionTable;