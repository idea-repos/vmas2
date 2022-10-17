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
import { region, regions } from '../../staticData';
import RegionTable, {sortColumn} from '../../components/dictionary/RegionTable';

function RegionManagement() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [addSubRegion, setAddSubRegion] = useState(false);
    const [inputSubRegion, setInputSubRegion] = useState("");
    const [regionID, setRegionID] = useState(0);
    const [regionName, setRegionName] = useState('');
    const [allRegions, setAllRegions] = useState<region[]>([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        setAllRegions(regions);
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setInputSubRegion("");
        setAddSubRegion(false);
        setRegionName('');
        setRegionID(0)
        setValidated(false)
        setShow(false)
    }

    const openModalOnDelete = (region: region) => {
        setRegionID(region.id);
        handleShowDelete();
    }

    const openModalOnAddSub = (region: region) => {
        console.log(region)
        setAddSubRegion(true);
        handleShow();
    }

    const openModalOnEdit = (region : region) => {
        setRegionName(region.name);
        setRegionID(region.id);
        handleShow()
    }
    
    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                if (addSubRegion) {
                    // add
                    setFlashMessage('Sub Region Added Successfully')
                } else if (regionID == 0) {
                    // add sub region
                    setFlashMessage('Region Created Successfully')
                } else {
                    // edit it 
                    setFlashMessage('Region Updated Successfully')
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
        setAllRegions(allRegions.filter(region => region.id !== regionID))
        handleCloseDelete()
        setFlashMessage('Region Deleted Successfully');
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = allRegions;
        
        if (searchQuery) {
            filtered = allRegions.filter(region => region.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }
    
    const {totalCount, data : page_roles} = getPageData()

    return (
        <>
            <PageBar title='Dictionary Management ( Region )'>
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

            <RegionTable 
                regions={page_roles}
                onSort={handleSort}
                sortColumn={sortColumn}
                openModalOnEdit={openModalOnEdit}
                openModalOnDelete={openModalOnDelete}
                openModalOnAddSub={openModalOnAddSub}
            />

            <Pagination 
                itemCount={totalCount} 
                pageSize={pageSize} 
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />

            <CustomModal
                heading='Add Category'
                buttons={[<Button form='form-region' variant="primary" type='submit'>Save</Button>]}
                show={show}
                onHide={handleClose}>
                    <Form noValidate id='form-region' validated={validated} onSubmit={handleSubmit}>
                        <Form.Control
                            defaultValue={regionID}
                            type="hidden"
                            aria-describedby="inputGroupPrepend"
                            />
                        <Form.Group className="mb-3" controlId="regionName">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">{addSubRegion ? "Sub Region" : "Name"}</InputGroup.Text>
                                <Form.Control
                                    defaultValue={addSubRegion ? inputSubRegion : regionName}
                                    type="text"
                                    onChange={addSubRegion ? e => {setInputSubRegion(e.target.value)}  :  e => {setRegionName(e.target.value)}}
                                    required
                                    />
                                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form>
            </CustomModal>

            <CustomModal 
                buttons={[<Button onClick={handleOnDelete} variant="danger">Delete</Button>]}
                heading='Delete Region'
                show={showDelete}
                onHide={handleCloseDelete}
                >
                <p>Are you sure to delete?</p>
            </CustomModal>
        </>
    );
}

export default RegionManagement;