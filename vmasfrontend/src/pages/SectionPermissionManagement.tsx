import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import CustomModal from '../components/common/CustomModal';
import PageBar from '../components/common/PageBar';
import PermissionTable, { permission } from '../components/PermissionTable';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

function SectionPermissionManagement() {
    const params = useParams();
    const section_id = params?.id;

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
    const [allPermissions, setAllPermissions] = useState<permission[]>([])
    const [permID, setPermID] = useState(0);
    const [validated, setValidated] = useState(false);
    const [perm_section, setPermName] = useState('');
    const [perms_title, setPermTitle] = useState('');
    const [flashMessage, setFlashMessage] = useState('');


    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() == false) {
            e.stopPropagation();
        } else {
            try {
                if (permID === 0) {
                    const {data} = await axios.post(`/api/permissions/`, JSON.stringify({perm_section, perms_title, section:section_id}));
                    setFlashMessage('Permission successfully added');
                } else {
                    // edit existing permission of a section
                    const {data} = await axios.put(`api/permissions/${permID}/`, JSON.stringify({perm_section, perms_title}));
                    setFlashMessage('Permission successfully updated');
                }
                handleClose()
            } catch (e) {
                const err = e as AxiosError;
                console.log('handle error')
            }
        }
        setValidated(true);
    }

    useEffect(() => {
        const getPermissionsForSection = async (section_ID : string | undefined) => {
            try {
                const {data} = await axios.get(`/api/sections/${section_ID}/get-permissions/`)
                setAllPermissions(data);
            } catch (e) {
                const err = e as AxiosError;
                console.log('navigate to 404 page');
            }
        }
        getPermissionsForSection(section_id);
    }, []);


    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const handleOnDelete = async () => {
        const {data} = await axios.delete(`/api/permissions/${permID}`);
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