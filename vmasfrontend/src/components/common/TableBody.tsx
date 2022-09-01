import React, { Component } from 'react';
import _ from 'lodash';


interface TableBodyProps {
    data : any
    columns: any
}
 
interface TableBodyState {
}
 
// movie array 
class TableBody extends React.Component<TableBodyProps, TableBodyState> {
    
    renderCell = (item : any, column : any) => {
        if (column.content) return column.content(item);
        return _.get(item, column.path);
    }

    createKey = (item : any, column: any) => {
        return item._id + (column.path || column.key);
    }

    render() { 
        const {data, columns} = this.props;

        return ( 
            <tbody>
                {data.map((item: any)=> <tr key={item._id}>
                    {columns.map((column : any) => <td key={this.createKey(item, column)}>{this.renderCell(item, column)}</td>)}
                </tr>)}
            </tbody>
        );
    }
}
 
export default TableBody;