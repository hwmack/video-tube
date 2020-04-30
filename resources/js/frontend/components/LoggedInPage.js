import NavBar from "../views/NavBar";
import {Container} from "react-bootstrap";
import * as React from "react";

export default function LoggedInPage(props) {
    return (
        <>
           <NavBar/>
            <Container id='main-content' >
                {props.children}
            </Container>
        </>
    )
}