import React from 'react';
import { Tab } from 'react-bootstrap';
import Table from './common/Table';

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

export interface section {
    id: number;
    section_name: string,
    section_desc: string,
    status: true
}

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
                <button className='btn btn-primary btn-sm'>Privilege</button>
                <button onClick={() => onHandleEdit(section)} className='btn btn-secondary btn-sm mx-1'>Edit</button>
                <button onClick={() => onHandleDelete(section.id)} className='btn btn-danger btn-sm '>Delete</button>
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