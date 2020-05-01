import React from 'react'
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";

import apiRequest from "../helpers/utils";
import { store } from '../models/Store'

export default class ResetPassword extends React.Component {
    constructor(props){
        super(props);

        let params = new URL(window.location).searchParams

        console.debug(props.match.params.token)
        console.debug(params.get('email'))

        this.state = {
            token: props.match.params.token,
            email: params.get('email'),
            password: '',
            password_confirmation: '',
            serverError: '',
            success: false
        }
    }

    handleUpdate(event) {
        switch (event.target.id) {
            case 'formPassword':
                this.setState({
                    ...this.state,
                    password: event.target.value
                })
                break
            case 'formPasswordConfirm':
                this.setState({
                    ...this.state,
                    password_confirmation: event.target.value
                })
                break
        }
    }

    handleForgotPassword(event) {
        event.preventDefault()

        const data = {
            token: this.state.token,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
        }

        this.setState({
            ...this.state,
            serverError: ''
        })

        apiRequest('/password/reset', 'POST', data, (response, body) => {
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    success: true
                })

                store.dispatch({
                    type: 'LOGIN',
                    user: body.user
                })

                setTimeout(_ => this.props.history.push('/'), 1000)
            } else {
                this.setState({
                    ...this.state,
                    serverError: body.errors.password[0] // FIXME this will cause an error some time
                })
            }
        }, err => console.log(err))
    }

    render() {
        return (
            <Container fluid className='offsetContainer'>
                <Row className='justify-content-xl-center'>
                    <h1>
                        <img src='/logo.svg' id='public-logo'/>
                        VideoTube
                    </h1>
                </Row>
                <Row className='justify-content-xl-center'>
                    <Col lg={4}>
                        <Form onSubmit={this.handleForgotPassword.bind(this)}>

                            <h4>Reset Password</h4>

                            <Alert variant='danger' className={this.state.serverError === '' ? 'd-none' : 'd-block'}>
                                {this.state.serverError}
                            </Alert>

                            <Alert variant='success' className={this.state.success === false ? 'd-none' : 'd-block'}>
                                Successfully changed your password!
                            </Alert>
                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='password'
                                        required
                                        placeholder='Enter password'
                                        onChange={this.handleUpdate.bind(this)}/>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId='formPasswordConfirm'>
                                <Form.Label>Confirm Password:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='password'
                                        required
                                        placeholder='Re-enter password'
                                        onChange={this.handleUpdate.bind(this)}/>
                                </InputGroup>
                            </Form.Group>

                            <Button variant='primary' type='submit'>
                                Reset Password
                            </Button>

                            {' ' /* So the buttons will appear on the same line */}

                            <Link to='/'>
                                <Button variant='outline-primary'>
                                    Go Home
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}