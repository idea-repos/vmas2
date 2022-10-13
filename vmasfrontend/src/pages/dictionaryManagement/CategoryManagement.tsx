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
import { categories, category } from '../../staticData';
import CategoryTable, {sortColumn} from '../../components/dictionary/CategoryTable';

function CategoryManagement() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false)
    const [categoryID, setKeywordID] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const [allCategories, setAllKeywords] = useState<category[]>([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        setAllKeywords(categories);
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setCategoryName('');
        setKeywordID(0)
        setValidated(false)
        setShow(false)
    }

    const openModalOnDelete = (category: category) => {
        setKeywordID(category.id);
        handleShowDelete();
    }

    const openModalOnEdit = (category : category) => {
        setCategoryName(category.name);
        setKeywordID(category.id);
        handleShow()
    }
    
    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                if (categoryID == 0) {
                    // add
                    setFlashMessage('Category Created Successfully')
                } else {
                    // edit it 
                    setFlashMessage('Category Updated Successfully')
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
        setAllKeywords(allCategories.filter(category => category.id !== categoryID))
        handleCloseDelete()
        setFlashMessage('Category Deleted Successfully');
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = allCategories;
        
        if (searchQuery) {
            filtered = allCategories.filter(category => category.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }
    
    const {totalCount, data : page_roles} = getPageData()

    return (
        <>
            <PageBar title='Dictionary Management ( Category )'>
                <Button variant='primary' onClick={handleShow}>Add Category</Button>
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

            <CategoryTable 
                categories={page_roles}
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
                heading='Add Category'
                buttons={[<Button form='form-category' variant="primary" type='submit'>Save</Button>]}
                show={show}
                onHide={handleClose}>
                    <Form noValidate id='form-category' validated={validated} onSubmit={handleSubmit}>
                        <Form.Control
                            defaultValue={categoryID}
                            type="hidden"
                            aria-describedby="inputGroupPrepend"
                            />
                        <Form.Group className="mb-3" controlId="categoryName">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">Name</InputGroup.Text>
                                <Form.Control
                                    defaultValue={categoryName}
                                    type="text"
                                    aria-describedby="inputGroupPrepend"
                                    onChange={ e => {setCategoryName(e.target.value)}}
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

export default CategoryManagement;