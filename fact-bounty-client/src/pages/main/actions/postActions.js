import axios from 'axios';
export const FETCH_POSTS = 'FETCH_POSTS';
export const LOADING = 'LOADING';
export const APPROVE_VOTE_COMPLETE = 'VOTE_COMPLETE';
export const VOTE_ERROR = 'VOTE_ERROR';

export const fetchPosts = () => dispatch => {
    fetch('/api/stories/all')
        .then(res => res.json())
        .then(posts => dispatch({
            type: FETCH_POSTS,
            payload: posts
        }))
        .catch(err => {
            console.error('Server response invalid', err);
        })
}

export const approveVote = (voteId) => dispatch => {
    dispatch({ type: LOADING })
    axios({
        baseURL: 'http://localhost:7000',
        url: '/api/stories/change-upvote-count',
        method: 'post',
        data: {
            story_id: voteId,
            change_val: 1
        },
        headers: { "Access-Control-Allow-Origin": "*" }
    })
        .then(res => {
            dispatch({
                type: APPROVE_VOTE_COMPLETE,
                id: voteId
            })
        })
        .catch(res => {
            dispatch({
                type: VOTE_ERROR,
                error: res
            })
        })
}