import React from 'react'
import { Form, Row, Col, Button } from "react-bootstrap"

import { store } from '../models/Store'
import apiRequest from "../helpers/utils";
import Alert from "react-bootstrap/Alert";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        let user = store.getState().isUserAuthenticated

        this.state = {
            user,
            formUsername: new String(user.username),
            formEmail: new String(user.email),
            formPassword: '',
            editable: false,
            errors: ''
        }

    }

    handleUpdate(event) {
        switch (event.target.id) {
            case 'formEmail':
                this.setState({
                    ...this.state,
                    formEmail: event.target.value
                })
                break
            case 'formUsername':
                this.setState({
                    ...this.state,
                    formUsername: event.target.value
                })
                break
            case 'formPassword':
                this.setState({
                    ...this.state,
                    formPassword: event.target.value
                })
                break
        }
    }

    updateUserDetails(event) {
        event.preventDefault()

        // Send a request to the server
        let body = {}

        if (this.state.formEmail != this.state.user.email) {
            body['email'] = this.state.formEmail
        }

        if (this.state.formUsername != this.state.user.username) {
            body['username'] = this.state.formUsername
        }

        if (this.state.formPassword !== '') {
            body['password'] = this.state.formPassword
        }

        apiRequest('/user', 'PUT', body, (response, body) => {
            // Check if it was a success
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    user: body.user,
                    errors: ''
                })

                this.toggleEditable()

                store.dispatch({
                    type: 'LOGIN',
                    user: body.user
                })
            } else {
                if (body.errors !== null) {
                    let error = ''
                    if (body.errors.email !== undefined) {
                        error = body.errors.email[0]
                    } else if (body.errors.username !== undefined) {
                        error = body.errors.username[0]
                    } else if (body.errors.password !== undefined) {
                        error = body.errors.password[0]
                    }

                    this.setState({
                        ...this.state,
                        errors: error
                    })
                }
            }
        })
    }

    toggleEditable() {
        if (this.state.editable === false) {
            this.setState({
                ...this.state,
                editable: !this.state.editable
            })
        } else {
            // Need to reset the values here
            this.setState({
                ...this.state,
                editable: !this.state.editable,
                formUsername: this.state.user.username,
                formEmail: this.state.user.email,
                formPassword: ''
            })
        }
    }

    currentUserForm() {
        if (this.props.username === undefined) {
            return (
                <Form onSubmit={this.updateUserDetails.bind(this)} style={{marginBottom: '50px'}}>
                    <Alert variant='danger' className={this.state.errors === '' ? 'd-none' : 'd-block'}>
                        {this.state.errors}
                    </Alert>
                    <Form.Group as={Row} controlId='formEmail'>
                        <Form.Label column sm="2">Email: </Form.Label>
                        <Col>
                            <Form.Control type='email'
                                          plaintext={!this.state.editable}
                                          readOnly={!this.state.editable}
                                          value={this.state.formEmail}
                                          onChange={this.handleUpdate.bind(this)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId='formUsername'>
                        <Form.Label column sm='2'>Username: </Form.Label>
                        <Col>
                            <Form.Control type='text'
                                          plaintext={!this.state.editable}
                                          readOnly={!this.state.editable}
                                          value={this.state.formUsername}
                                          onChange={this.handleUpdate.bind(this)}/>
                        </Col>
                    </Form.Group>

                    {/* TODO Eventually allow updating password */}
                    {!this.state.editable ? null : (
                        <Form.Group as={Row} controlId='formPassword'>
                            <Form.Label column sm="2">Password: </Form.Label>
                            <Col>
                                <Form.Control type='password'
                                              value={this.state.formPassword}
                                              onChange={this.handleUpdate.bind(this)}/>
                            </Col>
                        </Form.Group>
                    )}

                    {!this.state.editable ? (
                        <Button onClick={this.toggleEditable.bind(this)}>
                            Edit Details
                        </Button>) : (
                        <>
                        <Button type='submit'>
                            Save
                        </Button>{' '}
                        <Button onClick={this.toggleEditable.bind(this)}>
                            Cancel
                        </Button>
                        </>
                        )
                    }
                </Form>
            )
        }
    }

    render() {
        return (
            <>
                <h1>{this.state.user.username}'s Profile</h1>

                {this.currentUserForm()}

                <Row>
                    <Col>
                        <h3>Bookmarked Videos</h3>
                    </Col>
                    <Col>
                        <h3>User's Uploaded Videos</h3>
                    </Col>
                </Row>
            </>
        )
    }
}