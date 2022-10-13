import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import CustomModal from '../../components/common/CustomModal';
import PageBar from '../../components/common/PageBar';
import { AxiosError } from 'axios';
import SearchBox from '../../components/common/SearchBox';
import ShowEntries from '../../components/common/ShowEntries';
import _ from 'lodash';
import { paginate } from '../../utils/paginate';
import Pagination from '../../components/common/Pagination';
import { language, languages } from '../../staticData';
import LanguageTable, {sortColumn} from '../../components/dictionary/LanguageTable';

function LanguageManagement() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false)
    const [languageID, setLanguageID] = useState(0);
    const [languageName, setLanguageName] = useState('');
    const [allLanguages, setAllLanguages] = useState<language[]>([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        setAllLanguages(languages);
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setLanguageName('');
        setLanguageID(0)
        setValidated(false)
        setShow(false)
    }

    const openModalOnDelete = (language: language) => {
        setLanguageID(language.id);
        handleShowDelete();
    }

    const openModalOnEdit = (language : language) => {
        setLanguageName(language.name);
        setLanguageID(language.id);
        handleShow()
    }
    
    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                if (languageID == 0) {
                    // add
                    setFlashMessage('Language Created Successfully')
                } else {
                    // edit it 
                    setFlashMessage('Language Updated Successfully')
                }
                handleClose();
            } catch (err) {
                const error = err as AxiosError;
            }
        }
        setValidated(true);
    }

    const handlePageChange = (page : number) => {
        setCurrentPage(page)
    }

    const handleOnDelete = async () => {
        setAllLanguages(allLanguages.filter(language => language.id !== languageID))
        handleCloseDelete()
        setFlashMessage('Language Deleted');
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = allLanguages;
        
        if (searchQuery) {
            filtered = allLanguages.filter(language => language.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }
    
    const {totalCount, data : page_roles} = getPageData()

    return (
        <>
            <PageBar title='Dictionary Management ( Language )'>
                <Button variant='primary' onClick={handleShow}>Add Language</Button>
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

            <LanguageTable 
                languages={page_roles}
                onSort={handleSort}
                sortColumn={sortColumn}
                openModalOnEdit={openModalOnEdit}
                openModalOnDelete={openModalOnDelete}
            />

            <Pagination 
                itemCount={totalCount} 
                pageSize={pageSize} 
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />

            <CustomModal
                heading='Add Role'
                buttons={[<Button form='form-language' variant="primary" type='submit'>Save</Button>]}
                show={show}
                onHide={handleClose}>
                    <Form noValidate id='form-language' validated={validated} onSubmit={handleSubmit}>
                        <Form.Control
                            defaultValue={languageID}
                            type="hidden"
                            aria-describedby="inputGroupPrepend"
                            />
                        <Form.Group className="mb-3" controlId="languageName">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">Name</InputGroup.Text>
                                <Form.Control
                                    defaultValue={languageName}
                                    type="text"
                                    aria-describedby="inputGroupPrepend"
                                    onChange={ e => {setLanguageName(e.target.value)}}
                                    required
                                    />
                                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form>
            </CustomModal>

            <CustomModal 
                buttons={[<Button onClick={handleOnDelete} variant="danger">Delete</Button>]}
                heading='Delete Role'
                show={showDelete}
                onHide={handleCloseDelete}
                >
                <p>Are you sure to delete?</p>
            </CustomModal>
        </>
    );
}


export default LanguageManagement;