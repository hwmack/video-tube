import React from 'react'
import { Form, Col, Row, Button, Modal } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'

import { store } from '../models/Store'
import { VIDEO_DISPLAY } from '../models/Actions'
import { uploadVideoRequest } from '../models/Requests'

export default class AddVideo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            description: '',
            tags: '',
            file: null,
            fileValue: 'Video',
            // TODO Add a loading bar if I get time
            error: '',
            uploading: false,
            dragging: false,
        }
    }

    componentDidMount() {
        this.dropZone = document.getElementById('drag-target')
        this.dropZoneDrag = this.handleDrag.bind(this)
        this.dropZoneDrop = this.handleDrop.bind(this)
        this.dropZoneClear = this.clearDrag.bind(this)

        document.addEventListener('dragover', this.dropZoneDrag)
        this.dropZone.addEventListener('drop', this.dropZoneDrop)
        document.addEventListener('dragexit', this.dropZoneClear)
        document.addEventListener('drop', this.dropZoneClear)
    }

    componentWillUnmount() {
        document.removeEventListener('dragover', this.dropZoneDrag)
        this.dropZone.removeEventListener('drop', this.dropZoneDrop)
        document.removeEventListener('dragexit', this.dropZoneClear)
        document.removeEventListener('drop', this.dropZoneClear)
    }

    clearDrag(event) {
        event.preventDefault()

        this.setState({
            ...this.state,
            dragging: false,
        })
    }

    /**
     * Handle a user dragging a file onto the form
     */
    handleDrag(event) {
        event.preventDefault()

        this.setState({
            ...this.state,
            dragging: true,
        })
    }

    /**
     * Handle when the user drops the file
     */
    handleDrop(event) {
        event.preventDefault()

        // Check its a file type
        if (!event.dataTransfer.types[0].includes('file')) {
            return;
        }

        const file = event.dataTransfer.files.length === 0 ? null : event.dataTransfer.files[0]
        const fileValue = file === null ? 'Video' : file.name
        this.setState({
            ...this.state,
            file,
            fileValue,
            dragging: false,
        })
    }

    hide() {
        store.dispatch({
            type: VIDEO_DISPLAY,
            display: false,
        })
    }

    // Upload a video to the server
    uploadVideo() {
        /* Clear the error message */
        this.setState({
            ...this.state,
            error: '',
            uploading: true
        })

        uploadVideoRequest(this.state.title, this.state.description, this.state.tags, this.state.file)(
            (request, body) => {
                if (request.status === 200) { // Success!
                    this.setState({
                        ...this.state,
                        error: '',
                        uploading: false
                    })

                    store.dispatch({
                        type: VIDEO_DISPLAY,
                        display: false,
                    })

                    store.getState().history.push(`/video/${body.video}`)
                } else if (request.status === 422) { // Something was invalid with the form
                    let error = ''

                    if (body.errors.title !== undefined)
                        error = body.errors.title[0]
                    else if (body.errors.description !== undefined)
                        error = body.errors.description[0]
                    else if (body.errors.tags !== undefined)
                        error = body.errors.tags[0]
                    else if (body.errors.video !== undefined)
                        error = body.errors.video[0]

                    this.setState({
                        ...this.state,
                        error,
                        uploading: false
                    })
                } else {
                    this.setState({
                        ...this.state,
                        error: 'An unknown error ocurred',
                        uploading: false
                    })
                }
            })
    }

    handleFormInput(event) {
        switch (event.target.id) {
            case 'formTitle':
                this.setState({
                    ...this.state,
                    title: event.target.value,
                })
                break
            case 'formDescription':
                this.setState({
                    ...this.state,
                    description: event.target.value,
                })
                break
            case 'formTags':
                this.setState({
                    ...this.state,
                    tags: event.target.value,
                })
                break
            case 'formVideo':
                // Fill the values from the event
                const file = event.target.files.length === 0 ? null : event.target.files[0]
                const fileValue = file === null ? 'Video' : file.name
                this.setState({
                    ...this.state,
                    file,
                    fileValue,
                })
                break
        }
    }

    formContent() {
        return (
            <>
                <Alert variant='danger' className={this.state.error === '' ? 'd-none' : 'd-block'}>
                    {this.state.error}
                </Alert>
                <Alert variant='success' className={this.state.uploading === false ? 'd-none' : 'd-block'}>
                    Uploading..
                </Alert>
                <Form.Group as={Row} controlId="formTitle">
                    <Col>
                        <Form.Control type="text" placeholder="Title" onChange={this.handleFormInput.bind(this)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='formDescription'>
                    <Col>
                        <Form.Control as='textarea'
                                      rows='3'
                                      placeholder='Description'
                                      onChange={this.handleFormInput.bind(this)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='formTags'>
                    <Col>
                        <Form.Control
                            placeholder='Tags (separated by ",")'
                            onChange={this.handleFormInput.bind(this)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='formVideo'>
                    <Col>
                        <Form.File custom>
                            <Form.File.Input onChange={this.handleFormInput.bind(this)}/>
                            <Form.File.Label data-browse="Select">
                                {this.state.fileValue}
                            </Form.File.Label>
                            <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                        </Form.File>
                    </Col>
                </Form.Group>
            </>
        )
    }

    renderDrag() {
        return (
            <p>
                Drag here
            </p>
        )
    }

    render() {
        return (
            <Modal show={true} onHide={this.hide.bind(this)}>
                <Modal.Header>
                    <Modal.Title>Upload Video</Modal.Title>
                </Modal.Header>
                <Modal.Body id='drag-target'>
                    {this.state.dragging ? this.renderDrag() : this.formContent()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.hide.bind(this)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.uploadVideo.bind(this)}>
                        Upload Video
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}