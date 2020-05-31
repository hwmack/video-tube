import * as React from 'react'
import { CardDeck, Row, Spinner } from 'react-bootstrap'

import VideoTile from '../components/VideoTile'
import { getRecommendationsRequest, getSearchVideosRequest } from '../models/Requests'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        const query = props.match.params.query;

        this.state = {
            searchQuery: query === undefined ? '' : query,
            loading: true,
            bottom: false,
            page: 1,
            videos: [] // List of videos to display
        }
    }

    componentDidMount() {
        /* Fetch some initial videos to display */
        this.fetchVideos()

        // Set this variable to give the method a static signature
        // Which allows to remove the event listener when unmounting the component
        this.scrollListener = this.handleScrollEvent.bind(this)

        window.addEventListener('scroll', this.scrollListener)
    }

    componentWillUnmount() {
        // Unregister the scroll event
        window.removeEventListener('scroll', this.scrollListener)
    }

    handleScrollEvent() {
        if (!this.state.loading && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
            this.fetchVideos()
        }
    }

    componentDidUpdate(prevProps) {
        const query = this.props.match.params.query;
        if (query !== prevProps.match.params.query) {
            // We need to update the state and get new videos
            this.setState({
                ...this.state,
                videos: [],
                searchQuery: query === undefined ? '' : query,
                page: 1
            }, () => this.fetchVideos())
        }
    }

    fetchVideos() {
        this.setState({
            ...this.state,
            loading: true,
        })

        const callback = (response, body) => {
            if (body.data.length === 0) {
                this.setState({
                    ...this.state,
                    bottom: true,
                })
            } else {
                this.setState({
                    ...this.state,
                    videos: this.state.videos.concat(body.data),
                    page: this.state.page + 1, // Increment the page
                    loading: false,
                })
            }
        }

        if (this.state.searchQuery === '') {
            getRecommendationsRequest(this.state.page)(callback)
        } else {
            getSearchVideosRequest(this.state.searchQuery, this.state.page)(callback)
        }
    }

    renderVideos(videos) {
        if (videos === undefined || videos.length === 0) {
            return ''
        }

        let grid = []

        for (let i = 0; i < (videos.length / 4); i++) {
            let row = []

            for (let j = 0; j < 4; j++) {
                let video = videos[(4*i)+j]
                if (video === undefined) {
                    row.push(<VideoTile key={j} empty={true}/>)
                } else {
                    row.push(<VideoTile key={j}
                                        id={video.id}
                                        title={video.title}
                                        time={video.created_at}
                                        thumbnail={video.thumbnail}/>)
                }
            }

            grid.push(<CardDeck key={i}>{row}</CardDeck>)
            grid.push(<br key={-1*(i+1)}/>) // Make the key unique
        }

        return grid
    }

    renderLoader() {
        let spinner = (<Spinner animation="border"/>)
        let bottom = (<b>Reached the end</b>)
        return (
            <Row className='align-items-center justify-content-center'>
                {this.state.bottom ? bottom : spinner}
            </Row>
        )
    }

    render() {
        return (
            <>
                {this.state.searchQuery !== '' ? <h2>Search: {this.state.searchQuery}</h2> : ''}
                {this.renderVideos(this.state.videos)}
                {this.state.loading ? this.renderLoader() : null}
            </>
        )
    }
}