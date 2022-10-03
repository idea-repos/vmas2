import React from 'react';
import { useParams } from 'react-router-dom';

function RoleSection() {

    let params = useParams();

    return (
        <h1>{params.id}</h1>
    );
}

export default RoleSection;