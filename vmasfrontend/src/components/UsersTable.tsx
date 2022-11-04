import { Link } from 'react-router-dom';
import Table from './common/Table';
import { Button } from 'react-bootstrap';
import { sortColumn, user } from '../types';


interface UserTableProps {
    users : user[],
    onSort : (sortColumn : sortColumn) => void,
    sortColumn : sortColumn;
    openModalForDelete: (id : number) => void,
}

function UsersTable({users, sortColumn, onSort, openModalForDelete} : UserTableProps) {

    const columns = [
        {
            path:'username', 
            label:'Username'
        },
        {   
            path:'user_role', 
            label:'Roles'
        },
        {
            path:'last_login', 
            label:'Last Login'
        },
        {   
            path:'status', 
            label:'Status'
        },
        {
            label:'Action',
            key:'edit', 
            content: (user : user) =>
                <>
                <Button variant='danger' onClick={() => openModalForDelete(user.id)} size='sm'><i className="fa fa-trash" aria-hidden="true"></i></Button>
                <Link className='btn btn-primary btn-sm mx-1' to={`/users/${user.id}/edit`}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
                </>
       }
   ]

        return (
            <Table 
                columns={columns} 
                data={users} 
                onSort={onSort}
                sortColumn={sortColumn}/>  
        );
    
}

export default UsersTable;
