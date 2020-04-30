import NavBar from "../views/NavBar";
import {Container} from "react-bootstrap";
import * as React from "react";

export default function LoggedInPage(props) {
    // TODO Add Toasts to this component
    return (
        <>
           <NavBar/>
            <Container id='main-content' >
                {props.children}
            </Container>
        </>
    )
}