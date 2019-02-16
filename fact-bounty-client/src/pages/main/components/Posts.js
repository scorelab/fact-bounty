import React, { Component } from 'react';
import { postsList } from '../dummy.data';
import '../Posts.sass';
import Post from './Post';

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: postsList
        }
    }

    render() {
        return (
            <div className="postLayout">
                <div></div>
                <div className="postColumn">
                    {this.state.posts.map((post) => {
                        return (
                            <Post key={post.id} post={post} />
                        )
                    })}
                </div>
                <div></div>
            </div>
        )
    }
}

export default Posts;