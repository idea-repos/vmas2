import React, { useEffect, useState } from 'react';
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap';

interface perms {
    id: number,
    name:string,
    permitted:boolean,
}

interface PermissionPrivilegeProps {
    heading : string,
    permissionData: perms[],
}

function PermissionPrivilege({heading, permissionData} : PermissionPrivilegeProps) {
    return (
        <>
            <Row>
                <Card>
                    <Card.Body>{heading}</Card.Body>
                </Card>
                <Col sm={4}>
                    <ListGroup className='my-1'>
                        {permissionData.map(perm => <ListGroup.Item>{perm.name}</ListGroup.Item>)}
                    </ListGroup>
                </Col>
                    <Col sm={8}>
                        {permissionData.map(perm =>  <Form.Check defaultChecked={perm.permitted} className='mt-3' type="checkbox" />)}
                    </Col>
            </Row>               
        </>
    );
}

export default PermissionPrivilege;