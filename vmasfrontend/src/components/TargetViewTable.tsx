import React from 'react';
import { Table } from 'react-bootstrap';

interface targetDetail {
    attribute?: string,
    condition?: string,
    value?: string
}

interface TargetViewTableProps {
    targetDetails: targetDetail[];
}

function TargetViewTable ({targetDetails} : TargetViewTableProps) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Attribute</th>
                    <th>Condition</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {targetDetails.map((target, index) => 
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{target.attribute}</td>
                            <td>{target.condition}</td>
                            <td>{target.value}</td>
                        </tr>)}
            </tbody>
        </Table>
    );
}

export default TargetViewTable;