import React from 'react'
import { Row, Col, Badge, OverlayTrigger, Tooltip, Form, Button, Spinner, InputGroup, Card } from 'react-bootstrap'
import { GiPayMoney } from "react-icons/gi"
import { GoPlus, GoCheck } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { getBookmarkRequest, getVideoRequest, getCommentRequest } from '../models/Requests'

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
            }, () => {
                // Scroll to the bottom of the comments
                this.scrollToBottom()
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

    setVideoTime(seconds) {
        document.getElementById('video-view').currentTime = seconds
    }

    displayComments(comments) {
        return comments.map((comment, id) => {
            // Check if the content contains any values like a name or timestamp

            const timestampOrUserRe = /(@\S+|~\d+:\d+)/
            const timestampRe = /~(\d+:\d+)/
            const userRe = /@(\S+)/
            console.log(comment.content.split(timestampOrUserRe))
            let newContent = comment.content.split(timestampOrUserRe).map((item, idx) => {

                // Check if it matches a timestamp
                const timestamp = timestampRe.exec(item)
                if (timestamp !== null) {
                    const times = timestamp[1].split(':')
                    const minutes = Number(times[0]) * 60
                    const seconds = Number(times[1])

                    return (
                        <Link key={idx} to='#' onClick={() => this.setVideoTime(minutes + seconds)}>
                            {item}
                        </Link>
                    )
                }

                // Check if it matches a user
                const user = userRe.exec(item)
                if (user !== null) {
                    const user = userRe.exec(item)

                    return (
                        <Link key={idx} to={`/profile/${user[1]}`}>
                            {item}
                        </Link>
                    )
                }

                // Or just return the standard text
                return item
            })

            return (
                <Card key={id}
                      bg='dark'
                      border='primary'
                      className='m-2 p-2 w-100'
                      style={{ height: 'auto' }}>
                    <Card.Text>
                        {newContent}
                        <br/>
                        <small>
                            Created {comment.created_at} by
                            <Link to={`/profile/${comment.user.username}`}>
                                {' ' + comment.user.username}
                            </Link>
                        </small>
                    </Card.Text>
                </Card>
            )
        })
    }

    sendCreateCommentRequest(event) {
        event.preventDefault()

        const comment = document.getElementById('comment-input');
        getCommentRequest(this.state.video_id, comment.value)((request, body) => {
            if (request.status === 200) {
                const newComments = this.state.comments
                newComments.push(body.comment)

                this.setState({
                    ...this.state,
                    comments: this.state.comments
                }, () => {
                    comment.value = ""
                    this.scrollToBottom()
                })
            } else {
                alert("Problem saving comment")
            }
        })
    }

    scrollToBottom() {
        const section = document.getElementById('comments-section')
        section.scrollTop = section.scrollHeight
    }

    sendBookmarkRequest() {
        getBookmarkRequest(this.state.video_id, !this.state.bookmarked)((response, body) => {
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    bookmarked: !this.state.bookmarked
                })
            } else {
                console.log('Error handling bookmark')
            }
        })
    }

    bookmarkButton() {
        return (
            <OverlayTrigger placement='right' overlay={(
                <Tooltip id='tooltip'>
                    {(this.state.bookmarked) ? 'Bookmarked Video' : 'Bookmark'}
                </Tooltip>
            )}>
                <Button onClick={this.sendBookmarkRequest.bind(this)} className='mx-2'>
                    {this.state.bookmarked ? <GoCheck/> : <GoPlus/>}
                </Button>
            </OverlayTrigger>
        )
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
                        <video id='video-view' className='embed-responsive-item' controls
                               preload='auto' poster={this.state.thumbnail_url}>
                            <source src={this.state.video_url} type='video/mp4' />
                        </video>
                    </Col>
                    <Col md={3}>
                        <Row id='comments-section'
                             className='p-2'>
                            {this.displayComments(this.state.comments)}
                            <div style={{ height: '50px', width: '100%' }}>
                                { /* Hidden div to add some spacing from the bottom of the scrolling window */ }
                            </div>
                        </Row>
                        <Row>
                            <Form className='w-100'
                                  style={{position: 'absolute', bottom: '1px'}}
                                  onSubmit={this.sendCreateCommentRequest.bind(this)}>
                                <InputGroup>
                                    <Form.Control
                                        id='comment-input'
                                        type='text'
                                        placeholder='Write a comment...'/>
                                    <InputGroup.Append>
                                        <OverlayTrigger placement='bottom' overlay={(
                                            <Tooltip id='tooltip'>
                                                Tip User
                                            </Tooltip>
                                        )}>
                                            <Button onClick={() => alert("To tip this user for this video")}>
                                                <GiPayMoney/>
                                            </Button>
                                        </OverlayTrigger>
                                    </InputGroup.Append>
                                </InputGroup>
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
                                <div>
                                    {this.state.description}
                                </div>
                            </Col>

                            <Col lg={3}>
                                <Row className='d-flex justify-content-end align-items-center'>
                                    <b>{this.state.views} views</b>
                                    {this.bookmarkButton()}
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
                        {/* Not sure what will go here */}
                    </Col>
                </Row>
            </>
        )
    }
}