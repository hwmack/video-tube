import * as React from 'react'
import { Card } from 'react-bootstrap'

function goTo(url) {
    return _ => store.getState().history.push(url)
}

export default function VideoTile(props) {
    if (props.empty) {
        return (
            <Card bg='dark' border='dark'/>
        )
    }

    const thumbnail = (props.thumbnail === undefined)
        ? 'https://via.placeholder.com/300x200' : `/storage/thumbnails/${props.thumbnail}`

    return (
        <Card bg='dark' border='dark' className='video-tile' onClick={goTo(`/video/${props.id}`)}>
            <Card.Img variant='top' src={thumbnail} height='150px'/>
            {props.title}
            <small className='text-white-50'>Created {props.time}</small>
        </Card>
    )
}