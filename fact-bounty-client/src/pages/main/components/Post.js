import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';
import '../Posts.sass';

const styles = {
    cardContent: {
        padding: 0
    },
    card: {
        marginBottom: '7px',
        height: '175px',
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
            userInput: null
        }
    }

    render() {
        const { post } = this.props;
        return (
            <Card style={styles.card}>
                <CardContent style={styles.cardContent}>
                    <div className="container">
                        <div className="image">
                            <img src="" alt="fact-bounty"></img>
                        </div>
                        <div className="details">
                            <div className="title"><h4>{post.title}</h4></div>
                            <div className="content"><p>{post.content}</p></div>
                        </div>
                    </div>
                    <div className="vote-status"></div>
                </CardContent>
            </Card>
        )
    }

}

export default Post;