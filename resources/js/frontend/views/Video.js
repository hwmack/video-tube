import React from 'react'
import { Row, Col, Badge, Container, Form, Button, Spinner } from 'react-bootstrap'
import { GoPlus } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { getVideoRequest } from '../models/Requests'

export default class Video extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            video_id: props.match.params.id,
            video_url: '',
            thumbnail_url: '',
            title: '',
            description: '',
            bookmarked: false,
            views: 0,
            owner: null,
            comments: []
        }
    }

    getVideo() {
        this.setState({
            ...this.state,
            loading: true,
        })

        getVideoRequest(this.state.video_id)((request, body) => {
            if (request.status !== 200) {
                console.log('Error when fetching video')
            }

            const description = body.description.split('\n').map((text, i) => {
                return (
                    <p key={i}>
                        {text}
                    </p>
                )
            })

            this.setState({
                ...this.state,
                loading: false,
                title: body.title,
                description: description,
                views: body.watch_count,
                created: body.created_at,
                video_url: `/storage/${body.location}`,
                thumbnail_url: `/storage/thumbnails_full/${body.thumbnail}`,
                bookmarked: body.bookmarked,
                owner: body.user,
                comments: body.comments,
                tags: body.tags,
            })
        })
    }

    componentDidMount() {
        // Get the video information
        this.getVideo()
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({
                ...this.state,
                video_id: this.props.match.params.id,
            }, () => this.getVideo())
        }
    }

    displayTags(tags) {
        return tags.map((item, i) => {
            return (
                <Badge className='m-1' variant='secondary' key={i}>
                    <Link to={`/search/${item.name}`} className='tag-item' style={{ color: 'white' }}>
                        {item.name}
                    </Link>
                </Badge>
            )
        })
    }

    render() {
        if (this.state.loading) {
            return (
                <Row className='align-items-center justify-content-center p-5'>
                    <Spinner animation="border"/>
                </Row>
            )
        }

        return (
            <>
                <Row className='m-0'>
                    <Col md={9} className='embed-responsive embed-responsive-16by9'>
                        <video className='embed-responsive-item' controls preload='auto' poster={this.state.thumbnail_url}>
                            <source src={this.state.video_url} type='video/mp4' />
                        </video>
                    </Col>
                    <Col md={3}>
                        <Row className='p-2'>
                            Comments will go here
                        </Row>
                        <Row>
                            <Form className='w-100' style={{position: 'absolute', bottom: '1px'}}>
                                <Form.Control
                                    type='text'
                                    placeholder='Write a comment...'/>
                            </Form>
                        </Row>
                    </Col>
                </Row>

                <Row className='m-2 d-flex'>
                    <Col lg={9}>
                        <Row>
                            <Col lg={9}>
                                <h1 className=''>{this.state.title}</h1>
                                <small className=''>
                                    Uploaded by
                                    <Link to={`/profile/${this.state.owner.username}`}>
                                        {' ' + this.state.owner.username}
                                    </Link>,
                                    {' ' + this.state.created}
                                </small>
                                <p>
                                    {this.state.description}
                                </p>
                            </Col>

                            <Col lg={3}>
                                <Row className='d-flex justify-content-end align-items-center'>
                                    <b>{this.state.views} views</b>
                                    <Button className='mx-2'><GoPlus/></Button>
                                </Row>
                                <br/>
                                <Row
                                    // style={{ maxWidth: '', overflow: 'scroll' }}
                                    className='p-0 d-flex justify-content-end align-items-center'>
                                    <b>Tags: </b>
                                    {this.displayTags(this.state.tags)}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>

                    </Col>
                </Row>
            </>
        )
    }
}