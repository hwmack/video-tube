import React from 'react'
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class Register extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }

    }


    handleRegister() {
        // Send a request to register

        // Notify user to verify their email

        // Redirect them to home page
    }

    render() {
        return (
            <Container fluid className='offsetContainer'>
                <Row className='justify-content-xl-center'>
                    <h1>VideoTube</h1>
                </Row>
                <Row className='justify-content-xl-center'>
                    <Col lg={4}>
                        <Form>
                            <Form.Group controlId='formEmail'>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type='email' placeholder='Enter email'/>
                            </Form.Group>

                            <Form.Group controlId='formUsername'>
                                <Form.Label>Username:</Form.Label>
                                <Form.Control type='text' placeholder='Enter username'/>
                            </Form.Group>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type='password' placeholder='Enter password'/>
                            </Form.Group>

                            <Form.Group controlId='formPasswordConfirm'>
                                <Form.Label>Confirm Password:</Form.Label>
                                <Form.Control type='password' placeholder='Re-enter password'/>
                            </Form.Group>

                            <Button variant='primary' onClick={this.handleRegister}>
                                Register
                            </Button>

                            {' ' /* So the buttons will appear on the same line */}

                            <Link to='/login'>
                                <Button variant='outline-primary'>
                                    Log In
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}