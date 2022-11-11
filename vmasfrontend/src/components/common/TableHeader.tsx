import React, {Component} from 'react';
import { sortColumn } from '../../types';

interface TableHeaderProps {
    columns : {path? : string, label? : string, key? : string}[],
    sortColumn : sortColumn,
    onSort : (sortColumn : sortColumn) => void,
}
 

function TableHeader({columns, sortColumn : sortC, onSort} : TableHeaderProps) {
    
    const raiseSort = (path : string | undefined) => {
        const sortColumn = {...sortC};
        if (sortColumn.path === path) {
             sortColumn.order = (sortColumn.order === "asc" ? "desc" : "asc")
        } else {
            if (path !== undefined)
                sortColumn.path = path;
            sortColumn.order = "asc";
        }
        onSort(sortColumn);
    }

    const renderSortIcon = (column : any) => {
        
        if (column.path !== sortC.path) return null;
        if (sortC.order === "asc" ) return <i className="fa fa-sort-asc"></i>;
        return <i className="fa fa-sort-desc"></i>;
    }

    return (
        <thead>
            <tr>
                {columns.map(column => <th className='clickable' key={column.path || column.key}
                                                onClick={()=>raiseSort(column.path)}>
                                                {column.label}{renderSortIcon(column)}</th>)}
            </tr>
        </thead>
    );
}
 
export default TableHeader;