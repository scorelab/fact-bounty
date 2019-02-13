import React, { Component } from 'react';
import '../Posts.sass';
import Post from './Post';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions/postActions';

class Posts extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         posts: postsList
    //     }
    // }

    componentDidMount() {
        this.props.fetchPosts();
    }

    render() {
        return (
            <div className="postLayout">
                <div></div>
                <div className="postColumn">
                    {this.props.posts.map((post) => {
                        return (
                            <Post key={post._id} post={post} />
                        )
                    })}
                </div>
                <div></div>
            </div>
        )
    }
}

const mapStatetoProps = state => ({
    posts: state.posts.items
})

export default connect(mapStatetoProps, { fetchPosts })(Posts);