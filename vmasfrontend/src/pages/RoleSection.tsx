import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PageBar from '../components/common/PageBar';
import SectionsList from '../components/SectionsList';
import { section } from '../types';


function RoleSection() {

    let params = useParams();
    let navigate = useNavigate();

    const [allSections, setAllSections] = useState<section[]>([]);
    const [sections_allowed, setSectionAllowed] = useState<number[]>([]);
    const [sections_notallowed, setSectionNotAllowed] = useState<number[]>([]);

    const handleSubmit = async (event : React.FormEvent) => {
        event.preventDefault();
        const URL = `api/roles/${params.id}/update-sections/`
        
        try {
            const {data} = await axios.put(URL, JSON.stringify({sections_allowed, sections_notallowed}));
            navigate('/roles')
        } catch (e) {
            const error = e as AxiosError;
            
        }
    }

    const onHandleChange = (id : number, e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSectionAllowed([...sections_allowed, id]);
            setSectionNotAllowed(sections_notallowed.filter(section => section !== id))
        } else {
            setSectionAllowed(sections_allowed.filter(section => section !== id));
            setSectionNotAllowed([...sections_notallowed, id]);
        }
    }

    useEffect(() => {
        const URL = `api/roles/${params.id}/get-sections/`
        
        const getSections = async () => {
            let {data} = await axios.get(URL);
            setAllSections(data);
            
            setSectionAllowed(data
                .filter((section : section) => section.allowed === true)
                .map((section : section)=> section.id))
                
            setSectionNotAllowed(data
                .filter((section : section) => section.allowed === false)
                .map((section : section)=> section.id))
        }
        getSections();
    }, [])

    return (
        <React.Fragment>
            <PageBar title='Assgin Section'/>

            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={2}>
                            <p>Sections</p>
                        </Col>
                        <Col sm={8}>
                            <p>Assignment</p>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                {allSections.map(section => <SectionsList
                                                 key={section.id} 
                                                 id={section.id} 
                                                 onHandleChange={onHandleChange}
                                                 sectionName={section.section_name} 
                                                 isChecked={section.allowed} />)}
            
                <Button style={{'float':'left'}} type='submit' variant='primary'>Submit</Button>
            </Form>
        </React.Fragment>
    );
}

export default RoleSection;