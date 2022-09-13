import React, { useEffect, useState } from 'react';
import PageBar from '../components/common/PageBar';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ShowEntries from '../components/common/ShowEntries';
import SearchBox from '../components/common/SearchBox';
import Pagination from '../components/common/Pagination';
import TargetTable, { target } from '../components/TargetTable';
import { paginate } from '../utils/paginate';
import _ from 'lodash';
import { allTargets } from '../staticData';

interface sortColumn {path:string, order : boolean | "asc" | "desc"};

function TargetManagement() {

    const [targets, setTargets] = useState<target[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'username', order:"asc"});
    
    useEffect(() => {
        setTargets(allTargets)
    }, [])

    const handleSearch = (query : string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handlePageChange = (page:number) : void => {
        setCurrentPage(page)
    }

    const handleSort = (sortColumn : sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPageData = () => {
        let filtered = targets;
        
        if (searchQuery) {
            filtered = targets.filter(target => target.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        } 

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
        const page_targets = paginate(sorted, currentPage, pageSize);
        return {totalCount : sorted.length, data : page_targets};
    }

    const {totalCount, data : page_targets} = getPageData()

    return (
        <React.Fragment>
            <Container className='container'>
                <PageBar 
                    title='TARGETS MANAGEMENT'
                    havingChildren={true}>
                    <Button variant='primary' href='#'>Create Target</Button>
                </PageBar>

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

                <TargetTable 
                    targets = {page_targets}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                />

                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </Container>
        </React.Fragment>
    );
}

export default TargetManagement;