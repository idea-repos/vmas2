import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CustomModal from '../components/common/CustomModal';
import PageBar from '../components/common/PageBar';
import PermissionTable from '../components/PermissionTable';
import { sortColumn, permission } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { createPermissionForSection, deletePermissionForSection, loadPermissionsForSection, updatePermissionForSection } from '../store/sections';


function SectionPermissionManagement() {
    const section_id = useParams()?.id;
    const dispatch = useDispatch();
    const allPermissions : permission[] = useSelector((state:any) => state.entities.sections.sectionPermissions)
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => {
        setPermID(0);
        setShowDelete(false);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setPermID(0);
        setPermName('');
        setPermTitle('');
        setValidated(false)
        setShow(false)
    };
    const handleShow = () => setShow(true)
    
    const openModalOnEdit = (permission : permission) => {
        setPermID(permission.id);
        setPermName(permission.perm_section);
        setPermTitle(permission.perms_title);
        handleShow();
    }

    const openModalOnDelete = (id : number) => {
        setPermID(id);
        setShowDelete(true);
    }

    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'perm_title', order:"asc"});
    const [permID, setPermID] = useState(0);
    const [validated, setValidated] = useState(false);
    const [perm_section, setPermName] = useState('');
    const [perms_title, setPermTitle] = useState('');
    const [flashMessage, setFlashMessage] = useState('');


    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() == false) {
            e.stopPropagation();
        } else {
            if (permID === 0) {
                // error need to confirm the url for creating permission of a section
                dispatch(createPermissionForSection(section_id, {perm_section, perms_title}))
                setFlashMessage('Permission successfully added');
            } else {
                dispatch(updatePermissionForSection(permID, {perm_section, perms_title}))
                setFlashMessage('Permission successfully updated');
            }
            handleClose()
        }
        setValidated(true);
    }

    useEffect(() => {
        dispatch(loadPermissionsForSection(section_id));
    }, []);


    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const handleOnDelete = async () => {
        dispatch(deletePermissionForSection(permID));
        handleCloseDelete();
        setFlashMessage('Permission deleted successfully');
    }

    return (
        <React.Fragment>

            <PageBar title='Add Permission on Section'>
                <Button onClick={handleShow}>Add Permission</Button>
            </PageBar>

            {flashMessage && <Alert className='mt-3' variant='success'>{flashMessage}</Alert>}

            <PermissionTable 
                sortColumn={sortColumn}
                onSort={handleSort}
                permissions={allPermissions}
                openModalOnEdit={openModalOnEdit}
                openModalOnDelete={openModalOnDelete}
            />

            <CustomModal
                heading='Add Permission'
                show={show}
                onHide={handleClose}
                buttons={[<Button type='submit' variant='primary' form='perm-add-edit'>Add</Button>]}>
                
                    <Form noValidate id='perm-add-edit' validated={validated} onSubmit={handleSubmit}>
                        <Form.Control
                            defaultValue={permID}
                            type="hidden"
                            aria-describedby="inputGroupPrepend"
                        />
                        <Form.Group className="mb-3" controlId="permName">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">Permission Name</InputGroup.Text>
                                <Form.Control
                                    defaultValue={perm_section}
                                    type="text"
                                    onChange={ e => {setPermName(e.target.value)}}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="permTitle">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">Permission Title</InputGroup.Text>
                                <Form.Control
                                    defaultValue={perms_title}
                                    type="text"
                                    onChange={ e => {setPermTitle(e.target.value)}}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                    </Form>
            </CustomModal>

            <CustomModal
                    buttons={[<Button onClick={handleOnDelete} variant="danger">Delete</Button>]}
                    heading='Delete Permission'
                    show={showDelete}
                    onHide={handleCloseDelete}
                    >
                    <Card body>
                        Are your sure  you want to delete the permission?
                    </Card>
            </CustomModal>
        </React.Fragment>
    );
}

export default SectionPermissionManagement;