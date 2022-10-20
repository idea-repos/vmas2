import React, { useEffect, useState } from 'react';
import PageBar from '../components/common/PageBar';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import ShowEntries from '../components/common/ShowEntries';
import SearchBox from '../components/common/SearchBox';
import Pagination from '../components/common/Pagination';
import TargetTable, { target, targetDetail } from '../components/TargetTable';
import { paginate } from '../utils/paginate';
import _ from 'lodash';
import { allTargets } from '../staticData';
import CustomModal from '../components/common/CustomModal';
import TargetViewTable from '../components/TargetViewTable';
import { useDispatch } from 'react-redux';


interface sortColumn {path:string, order : boolean | "asc" | "desc"};

function TargetManagement() {

    const dispatch = useDispatch();

    const [targets, setTargets] = useState<target[]>([]);
    const [targetId, setTargetId] = useState(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortColumn, setSortColumn] = useState<sortColumn>({path:'name', order:"asc"});
    const [singleTarget, setSingleTarget] = useState<target>({id:0, name:'', description:'', created_at:0, details:[], notes:''});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    const handleDeleteModalOnClose = () => {
        setTargetId(0)
        setIsDeleteModalOpen(false)
    };

    const handleViewModalOnClose = () => {
        setTargetId(0)
        setIsViewModalOpen(false)
    };

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

    const OpenModalForDelete = (id : number) => {
        setTargetId(id);
        setIsDeleteModalOpen(true);
    }

    const OpenModalForView = (target: target) => {
        setTargetId(target.id);
        setSingleTarget(target)
        setIsViewModalOpen(true);
    }

    const handleOnDelete = () => {
        // integrate backend here
        console.log(targetId)
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
                    <Button variant='primary' href='/target/add'>Create Target</Button>
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
                    OpenModalForDelete={OpenModalForDelete}
                    OpenModalForView={OpenModalForView}
                />

                <Pagination 
                    itemCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </Container>

            <CustomModal 
                buttons={[<Button onClick={handleOnDelete} variant="danger">Delete</Button>]}
                heading='Delete Role'
                show={isDeleteModalOpen}
                onHide={handleDeleteModalOnClose}
                >
                <Card body>
                    Are your sure  you want to delete the target?
                </Card>
            </CustomModal>
            
            <CustomModal 
                heading={`Target Detail (${singleTarget?.name})`}
                show={isViewModalOpen}
                onHide={handleViewModalOnClose}
                >
                <>
                    <div className='my-2'>
                        <div>
                            <strong>Target Name: {singleTarget?.name}</strong>
                            <span>{true}</span>
                        </div>
                        <div>
                            <strong>Description: {singleTarget?.description}</strong>
                            <span>{false}</span>
                        </div>
                    </div>
                    
                    <TargetViewTable targetDetails={singleTarget?.details}/>
                </>
            </CustomModal>
        </React.Fragment>
    );
}

export default TargetManagement;