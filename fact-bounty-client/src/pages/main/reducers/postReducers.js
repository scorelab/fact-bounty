import { FETCH_POSTS, LOADING, APPROVE_VOTE_COMPLETE, VOTE_ERROR } from '../actions/postActions';

const initialState = {
    items: [],
    loading: false,
    error: String
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_POSTS:
            return {
                ...state,
                items: action.payload
            }
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case APPROVE_VOTE_COMPLETE:
            return {
                ...state,
                loading: false,
                items: state.items.map((post) => {
                    if (post._id === action.id) {
                        post.approved_count += 1;
                    }
                    return post
                })
            }
        case VOTE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}