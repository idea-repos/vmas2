import { Button } from 'react-bootstrap';
import Table from './common/Table';

export interface permission {
    id : number;
    perm_section : string,
    perms_title : string,
}

interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

interface RoleTableProps {
    permissions : permission[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalOnEdit: (permission : permission) => void,
    openModalOnDelete: (id: number) => void,
}


function RoleTable({permissions, sortColumn, onSort, openModalOnEdit, openModalOnDelete}:RoleTableProps) {
    
    const columns = [
        {
            path:'perms_title', 
            label:'Title'
        },
        {   
            path:'perm_section', 
            label:'Permission'
        },
        {
            label:'Actions',
            key:'edit', 
            content: (permission : permission) =>
            <>
                <Button onClick={() => openModalOnEdit(permission)} size='sm' variant='secondary' className='mx-1'><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <Button onClick={() => openModalOnDelete(permission.id)} size='sm' variant='danger'><i className="fa fa-trash" aria-hidden="true"></i></Button>
            </>
       }
    ]
    
    return (
        <Table 
            columns={columns} 
            data={permissions} 
            onSort={onSort}
            sortColumn={sortColumn}/>  
    );
}

export default RoleTable;