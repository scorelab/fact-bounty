export const FETCH_POSTS = 'FETCH_POSTS';

export const fetchPosts = () => dispatch => {
    fetch('/api/stories/all')
        .then(res => res.json())
        .then(posts => dispatch({
            type: FETCH_POSTS,
            payload: posts
        }));
}