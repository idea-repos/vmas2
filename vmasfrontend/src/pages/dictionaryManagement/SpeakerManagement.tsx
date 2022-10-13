import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import CustomModal from '../../components/common/CustomModal';
import PageBar from '../../components/common/PageBar';
import { AxiosError } from 'axios';
import axios from '../../api/axios';
import { allSpeaker, speaker } from '../../staticData';
import SearchBox from '../../components/common/SearchBox';
import ShowEntries from '../../components/common/ShowEntries';
import _ from 'lodash';
import { paginate } from '../../utils/paginate';
import SpeakerTable, {sortColumn} from '../../components/dictionary/SpeakerTable';
import Pagination from '../../components/common/Pagination';

function SpeakerManagement() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false)
    const [speakerID, setSpeakerID] = useState(0);
    const [speakerName, setSpeakerName] = useState('');
    const [allSpeakers, setAllSpeakers] = useState<speaker[]>([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        setAllSpeakers(allSpeaker);
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setSpeakerName('');
        setSpeakerID(0)
        setValidated(false)
        setShow(false)
    }

    const openModalOnDelete = (speaker: speaker) => {
        setSpeakerID(speaker.id);
        handleShowDelete();
    }

    const openModalOnEdit = (speaker : speaker) => {
        setSpeakerName(speaker.name);
        setSpeakerID(speaker.id);
        handleShow()
    }
    
    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {

            } catch (err) {
                const error = err as AxiosError;
            }
        }
        setValidated(true);
    }

    const handlePageChange = (page : number) => {
        setCurrentPage(page)
    }

    const handleOnDelete = async (e : React.FormEvent) => {
        e.preventDefault();
        const DEL_SPEAKER = `dict_mgmt/speaker/${speakerID}/`;
        const {data} = await axios.delete(DEL_SPEAKER);
        setAllSpeakers(allSpeaker.filter(speaker => speaker.id !== speakerID))
        handleCloseDelete()
        setFlashMessage('Role Deleted');
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = allSpeaker;
        
        if (searchQuery) {
            filtered = allSpeaker.filter(speaker => speaker.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }
    
    const {totalCount, data : page_roles} = getPageData()

    return (
        <>
            <PageBar title='Dictionary Management ( Speaker )'>
                <Button variant='primary' onClick={handleShow}>Add Speaker</Button>
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

            <SpeakerTable 
                    speakers={page_roles}
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
                buttons={[<Button form='form-speaker' variant="primary" type='submit'>Save</Button>]}
                show={show}
                onHide={handleClose}>
                    <Form noValidate id='form-speaker' validated={validated} onSubmit={handleSubmit}>
                        <Form.Control
                            defaultValue={speakerID}
                            type="hidden"
                            aria-describedby="inputGroupPrepend"
                            />
                        <Form.Group className="mb-3" controlId="rolename">
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">Name</InputGroup.Text>
                                <Form.Control
                                    defaultValue={speakerName}
                                    type="text"
                                    aria-describedby="inputGroupPrepend"
                                    onChange={ e => {setSpeakerName(e.target.value)}}
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

export default SpeakerManagement;