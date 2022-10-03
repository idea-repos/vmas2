import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import PageBar from '../components/common/PageBar';

function RoleSection() {

    let params = useParams();
    const [allSections, setAllSections] = useState();

    useEffect(() => {
        const URL = `api/roles/${params.id}/get-sections/`
        const getSections = async () => {
            let {data} = await axios.get(URL);
            setAllSections(data);
        }
        getSections();
    }, [])

    return (
        <React.Fragment>
            <PageBar title='Assgin Section'/>

            <Row>
                <Col sm={4}>
                    <Row>
                        <Col sm={2}>
                            <p>Sections</p>
                        </Col>
                        <Col sm={10}>
                            <p>Assignment</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default RoleSection;