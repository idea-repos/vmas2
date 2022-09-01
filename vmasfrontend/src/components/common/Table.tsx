import React, {Component} from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';


const Table = (props: any) => {
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