import { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import axios from '../api/axios';
import CustomModal from '../components/common/CustomModal';
import PageBar from '../components/common/PageBar';
import SearchBox from '../components/common/SearchBox';
import ShowEntries from '../components/common/ShowEntries';
import SectionTable, { section, sortColumn } from '../components/SectionTable';



const SECTION_URL = '/api/sections'

function SectionManagement() {
    
    const [sectionID, setSectionID] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [allSections, setAllSections] = useState<section[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [section_name, setSectionName] = useState('');
    const [section_desc, setSectionDesc] = useState('');
    const [flashMessage, setFlashMessage] = useState("");
    const [validated, setValidated] = useState(false);

    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'section_name', order:'asc'})
    
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setSectionID(0);
        setSectionName('');
        setSectionDesc('');
        setValidated(false);
        setShow(false);
    };
    
    const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                if (sectionID === 0) {
                    const ADD_SECTION_URL = '/api/section'
                    const {data} = await axios.post(ADD_SECTION_URL, JSON.stringify({section_name, section_desc}));
                    setFlashMessage('Section Added successfully');
                    handleClose()
                } else {
                    const EDIT_SECTION_URL = `${SECTION_URL}/${sectionID}/`;
                    const {data} = await axios.post(EDIT_SECTION_URL, JSON.stringify({section_name, section_desc}));
                    setFlashMessage('Section Updated successfully');
                    handleClose()
                }
            } catch (e) {
                const err = e as AxiosError;
            }
        }
        setValidated(true);
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const openModalOnEdit = (section:section) => {
        setSectionID(section.id);
        setSectionName(section.section_name);
        setSectionDesc(section.section_desc);
        handleShow();
    }

    const openModalOnDelete = (id: number) => {
        setSectionID(id);
        setShowDelete(true)
    }

    const handleCloseDelete = () => {
        setSectionID(0);
        setShowDelete(false)
    };

    const handleDelete = async () => {
        const DELETE_SECTION_URL = `${SECTION_URL}/${sectionID}`
        try {
            const {data} = await axios.delete(DELETE_SECTION_URL);
            setFlashMessage('Section Deleted Successfully');
            handleCloseDelete();
        } catch (e) {
            const error = e as AxiosError;
        }
        
    }

    useEffect(() => {
        const getSections = async () => {
            const {data} = await axios.get(SECTION_URL);
            setAllSections(data);
        }
        getSections();
    }, [])

    return (
        <React.Fragment>
            <PageBar havingChildren={true} title='Section Management'>
                <Button variant="primary" onClick={handleShow}>
                    Create Section
                </Button>
            </PageBar>

            {flashMessage && <Alert variant='success'>{flashMessage}</Alert>}
                
            <Row>
                <Col sm={4}>
                    <ShowEntries 
                        pageSize={pageSize} 
                        handlePageSize={e => setPageSize(parseInt(e.target.value))}/>
                </Col>
                <Col sm={8}>
                    <SearchBox value={searchQuery} onChange={handleSearch} />
                </Col>
            </Row>

            <SectionTable 
                sections={allSections}
                sortColumn={sortColumn}
                onSort={handleSort}
                onHandleEdit={openModalOnEdit}
                onHandleDelete={openModalOnDelete}/>

            <CustomModal 
                heading='Add Section'
                onHide={handleClose}
                show={show}
                buttons={[<Button type='submit' form='section-form' variant='primary'>Add</Button>] }>
                        <Form noValidate id='section-form' validated={validated} onSubmit={handleSubmit}>
                            <Form.Control
                                defaultValue={sectionID}
                                type="hidden"
                                readOnly
                                aria-describedby="inputGroupPrepend"
                            />
                            <Form.Group className="mb-3" controlId="rolename">
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">Role Name</InputGroup.Text>
                                    <Form.Control
                                        defaultValue={section_name}
                                        type="text"
                                        placeholder="Section Name"
                                        onChange={e => setSectionName(e.target.value)}
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="sectionDesc">
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">Role Name</InputGroup.Text>
                                    <Form.Control
                                        defaultValue={section_desc}
                                        type="text"
                                        onChange={e => setSectionDesc(e.target.value)}
                                        placeholder="Section Desc"
                                        aria-describedby="inputGroupPrepend"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form>
            </CustomModal>

            <CustomModal
                heading='Delete Section'
                show={showDelete}
                onHide={handleCloseDelete}
                buttons={[<Button onClick={handleDelete} variant='danger'>Delete</Button>]}>
                    <Card body>
                        Are you sure to delete the section?
                    </Card>
            </CustomModal>

        </React.Fragment>
    );
}

export default SectionManagement;