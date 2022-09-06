import React, { Component } from 'react';
import _ from 'lodash';


interface TableBodyProps {
    data : any
    columns: any
}
 
function TableBody({data, columns} : TableBodyProps) {
    
    const renderCell = (item : any, column : any) => {
        if (column.content) return column.content(item);
        return _.get(item, column.path);
    }

    const createKey = (item : any, column: any) => {
        return item._id + (column.path || column.key);
    }

    return ( 
        <tbody>
            {data.map((item: any)=> <tr key={item.id}>
                {columns.map((column : any) => <td key={createKey(item, column)}>{renderCell(item, column)}</td>)}
            </tr>)}
        </tbody>
    );
}
 
export default TableBody;