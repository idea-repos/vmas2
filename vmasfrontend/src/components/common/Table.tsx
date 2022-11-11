import React, {Component} from 'react';
import { sortColumn } from '../../types';
import TableBody from './TableBody';
import TableHeader from './TableHeader';


interface TableProps {
    columns : any[],
    sortColumn: sortColumn,
    onSort : (sortColumn : sortColumn) => void
    data? : any[]
}

const Table = (props: TableProps) => {
    const {columns, sortColumn, onSort, data} = props
    
    return (
        <table className="table">
            <TableHeader 
                    columns={columns} 
                    sortColumn={sortColumn} 
                    onSort={onSort}/>
            <TableBody data={data} columns={columns}/>
        </table>
    )
}

export default Table;