import * as React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function goTo(url) {
    return event => store.getState().history.push(url)
}

export default function VideoTile(props) {
    if (props.empty) {
        return (
            <Card bg='dark' border='dark'/>
        )
    }
    return (
        <Card bg='dark' border='dark' className='video-tile' onClick={goTo(`/video/${props.id}`)}>
            <Card.Img variant='top' src='https://via.placeholder.com/300x200' height='150px'/>
            {props.title}
            <small className='text-white-50'>Created {props.time}</small>
        </Card>
    )
}