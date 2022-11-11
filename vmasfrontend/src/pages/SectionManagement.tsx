import { AxiosError } from 'axios';
import _ from 'lodash';
import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import axios from '../api/axios';
import CustomModal from '../components/common/CustomModal';
import PageBar from '../components/common/PageBar';
import Pagination from '../components/common/Pagination';
import SearchBox from '../components/common/SearchBox';
import ShowEntries from '../components/common/ShowEntries';
import SectionTable from '../components/SectionTable';
import { paginate } from '../utils/paginate';
import { section, sortColumn } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { createSection, deleteSection, loadSections, updateSection } from '../store/sections';


function SectionManagement() {
    
    const dispatch = useDispatch();
    const fetchSections : section[] = useSelector((state:any) => state.entities.sections.list);

    const [sectionID, setSectionID] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [section_name, setSectionName] = useState('');
    const [section_desc, setSectionDesc] = useState('');
    const [flashMessage, setFlashMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

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

            /*
                will remove try catch in the future instead we modify the api call
                if will auto detech wheather call is POST or PUT
            */
            try {
                if (sectionID === 0) {
                    dispatch(createSection({section_name, section_desc}));
                    setFlashMessage('Section Added successfully');
                    handleClose()
                } else {
                    dispatch(updateSection(sectionID, {section_name, section_desc}));
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

    const handleDelete = () => {
        dispatch(deleteSection(sectionID));
        /*
        instead of flash message we ll create generic way to toast a notify inside api 
        ie (middleware) in the future
        */
        setFlashMessage('Section Deleted Successfully');
        handleCloseDelete();
    }

    const handlePageChange = (page : number) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        dispatch(loadSections());
    }, [])

    const getPageData = () => {
        let filtered = fetchSections;
        
        if (searchQuery) {
            filtered = fetchSections.filter(section => section.section_name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const pageSections = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : pageSections};
    }

    const {totalCount, data : pageSections} = getPageData()

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
                sections={pageSections}
                sortColumn={sortColumn}
                onSort={handleSort}
                onHandleEdit={openModalOnEdit}
                onHandleDelete={openModalOnDelete}/>

            <Pagination 
                itemCount={totalCount} 
                pageSize={pageSize} 
                onPageChange={handlePageChange}
                currentPage={currentPage}
                />

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