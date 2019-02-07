import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Link } from 'react-router-dom';
import postImg1 from '../president.jpg';
import LinesEllipsis from 'react-lines-ellipsis';
import '../Posts.sass';

const styles = {
    cardContent: {
        padding: 0
    },
    card: {
        marginBottom: '7px',
        boxShadow: '0 0 0 0',
        backgroundColor: '#fafafa',
        color: '#424242'
    }
}

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postStatus: 'true',
            userInput: null,
            postContent: ""
        }
    }

    componentDidMount() {
        this.setState({
            postContent: this.props.post.content
        })
    }

    handleReflow = (rleState) => {
        console.log("reflow");
    }

    render() {
        const { post } = this.props;
        return (
            <div className="hover-container">
                <Card style={styles.card}>
                    <CardContent style={styles.cardContent}>
                        <div className="container">
                            <div className="image">
                                <img src={postImg1} alt="fact-bounty" className="post-img"></img>
                            </div>
                            <div className="details">
                                {/* <div className="title"><span>{post.title}</span></div> */}
                                <div className="title">{post.title}</div>
                                <div className="date">{post.date}</div>
                                <div className="content">
                                    <LinesEllipsis
                                        text={this.state.postContent}
                                        maxLine='3'
                                        ellipsis='...'
                                        onReflow={this.handleReflow}
                                    />
                                </div>
                                <div className="read-more"><Link to="/post">Read more</Link></div>
                            </div>
                        </div>
                        <div className="vote-status"></div>
                    </CardContent>
                </Card>
            </div>
        )
    }

}

export default Post;