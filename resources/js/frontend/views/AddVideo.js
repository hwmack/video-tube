import React from 'react'
import { Form, Col, Row, Button } from "react-bootstrap";

export default class AddVideo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <h1>Add Video</h1>
                <br/>
                <Form noValidate validated={null}>
                    <Form.Group as={Row} controlId="formTitle">
                        <Col sm={8}>
                            <Form.Control type="text" placeholder="Title" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId='formDescription'>
                        <Col sm={8}>
                            <Form.Control as='textarea' rows='3' placeholder='Description'/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId='formTags'>
                        <Col>
                            <Form.Control placeholder='Tags'/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId='formVideo'>
                        <Col>
                            <Form.File custom>
                                <Form.File.Input />
                                <Form.File.Label data-browse="Select">
                                    Video File
                                </Form.File.Label>
                                <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                            </Form.File>
                        </Col>
                    </Form.Group>

                    <Button type='submit'>Upload Video</Button>
                </Form>
            </>
        );
    }
}