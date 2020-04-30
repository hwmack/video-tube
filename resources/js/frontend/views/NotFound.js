import React from 'react'
import {Container, Row} from "react-bootstrap";

export default class NotFound extends React.Component {
    render() {
        return (
            <>
                <Container fluid className='offsetContainer'>
                    <Row className='justify-content-xl-center'>
                        <h1>
                            <img src='/logo.svg' id='public-logo'/>
                            VideoTube
                        </h1>
                    </Row>
                    <Row style={{marginTop: '80px'}} className='justify-content-xl-center'>
                        <h3>Could not find the page requested. Please return <a href='/'>home</a> and try again</h3>
                    </Row>
                </Container>
            </>
        )
    }
}