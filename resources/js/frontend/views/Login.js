import React from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { store } from '../models/Store'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            remember: false
        }

        store.subscribe(() => {
            debugger
            this.setState({
                ...this.state,
                email: "something"
            })

            console.log(this.state)
        })
    }

    handleLogin() {
        debugger
        store.dispatch({
            type: '',
            text: 'something'
        })
    }

    updateForm(event) {
        switch (event.target.id) {
            case 'formEmail':
                this.localState.email = event.target.value
                break
            case 'formPassword':
                this.localState.password = event.target.value
                break
            case 'formRemember':
                this.localState.remember = event.target.checked
                break
        }

        console.log(this.localState)
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
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Enter password'
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Form.Group controlId='formRemember'>
                                <Form.Check
                                    type="switch"
                                    label="Remember me"
                                    onChange={this.updateForm.bind(this)}/>
                            </Form.Group>

                            <Button variant='primary' onClick={this.handleLogin}>
                                Log In
                            </Button>
                            {' '}
                            <Link to='/register'>
                                <Button variant='outline-primary'>
                                    Register
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;