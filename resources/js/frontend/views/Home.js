import * as React from 'react'
import { Container } from "react-bootstrap"

import NavBar from './NavBar'

export default class Home extends React.Component {
    render() {
        return (
            <>
                <NavBar/>
                <Container fluid>
                    { /* Contains all the videos or search results here */ }
                </Container>
            </>
        )
    }
}