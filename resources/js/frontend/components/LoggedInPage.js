import { Container } from 'react-bootstrap'
import * as React from 'react'

import { childrenWithProps } from '../helpers/utils'
import NavBar from '../views/NavBar'

export default function LoggedInPage(props) {
    // TODO Add Toasts to this component
    // TODO Add notification updates to this component

    let children = (
        <Container id='main-content'>
            {childrenWithProps(props.children, props)}
        </Container>
    )

    if (props.withContainer !== undefined) {
        children = childrenWithProps(props.children, props)
    }

    return (
        <>
            <NavBar update={true}/>
            {children}
        </>
    )
}