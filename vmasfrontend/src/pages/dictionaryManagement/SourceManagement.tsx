import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import CustomModal from '../../components/common/CustomModal';
import PageBar from '../../components/common/PageBar';
import SearchBox from '../../components/common/SearchBox';
import ShowEntries from '../../components/common/ShowEntries';
import _ from 'lodash';
import { paginate } from '../../utils/paginate';
import Pagination from '../../components/common/Pagination';
import { source, sources } from '../../staticData';
import SourceTable, {sortColumn} from '../../components/dictionary/SourceTable';

function SourceManagement() {
    const [sourceID, setSourceID] = useState(0);
    const [allSources, setAllSources] = useState<source[]>([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        setAllSources(sources);
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const openModalOnDelete = (source: source) => {
        setSourceID(source.id);
        handleShowDelete();
    }

    const handlePageChange = (page : number) => {
        setCurrentPage(page);
    }

    const handleOnDelete = async () => {
        setAllSources(allSources.filter(category => category.id !== sourceID))
        handleCloseDelete()
        setFlashMessage('Source Deleted Successfully');
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = allSources;
        
        if (searchQuery) {
            filtered = allSources.filter(source => source.source.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_roles = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_roles};
    }
    
    const {totalCount, data : page_roles} = getPageData()

    return (
        <>
            <PageBar title='Dictionary Management ( Category )'>
                <Button variant='primary' href='/dir_mgmt/dict/listing/source/name'>Search Source & Provide Alias</Button>
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

            <SourceTable 
                sources={page_roles}
                onSort={handleSort}
                sortColumn={sortColumn}
                openModalOnDelete={openModalOnDelete}
            />

            <Pagination 
                itemCount={totalCount} 
                pageSize={pageSize} 
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />

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

export default SourceManagement;