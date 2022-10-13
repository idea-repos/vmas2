import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import PageBar from '../components/common/PageBar';


interface RolePermission {
    id: number;
    perm_section : string;
    perm_title : string;
    section_name : string;
    section : number;
    section_allowed : boolean;
    perm_allowed : boolean;
}

function RolePermission() {

    let params = useParams();
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        const getAllData = async () => {
            const URL = `api/roles/${params.id}/get-permissions/`
            const {data} = await axios.get(URL);
            setAllData(data);
        }
        getAllData();
    }, [])

    return (
        <React.Fragment>
            <PageBar title='Assign Permission'/>

            <Row>
                <Col sm={4}>
                   <p>Permissions</p>
                </Col>
                <Col sm={8}>
                    <p>Assignment</p>
                </Col>
            </Row>
        
            
        </React.Fragment>
    );
}

export default RolePermission;