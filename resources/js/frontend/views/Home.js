import * as React from 'react'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [] // List of videos to display
        }

        /* Fetch some initial videos to display */
        this.fetchVideos()
    }

    fetchVideos() {

    }

    render() {
        return (
            <b>Display all the videos here</b>
        )
    }
}