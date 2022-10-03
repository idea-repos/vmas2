import React from 'react';
import { Col, Row } from 'react-bootstrap';

interface section {
    id: number;
    section_name: string;
    section_desc: string;
    allowed: boolean;
}

interface SectionsListProps {
}

function SectionsList({} : SectionsListProps) {
    return (
        <Row>
            <Col>
            </Col>
        </Row>
    );
}

export default SectionsList;