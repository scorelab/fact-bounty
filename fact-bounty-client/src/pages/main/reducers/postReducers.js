import { FETCH_POSTS, LOADING, APPROVE_VOTE_COMPLETE, VOTE_ERROR, FAKE_VOTE_COMPLETE, MIX_VOTE_COMPLETE, NO_MORE, INCREMENT_PAGE } from '../actions/postActions';

const initialState = {
    items: [],
    loading: false,
    error: String,
    nextPage: 1,
    hasMore: true
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_POSTS:
            const more = action.payload.length < 7 ? false : true
            return {
                ...state,
                items: state.items.concat(action.payload),
                hasMore: more,
                loading: true
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
                    if (post._id === action.post._id) {
                        post.approved_count = action.post.approved_count;
                        post.fake_count = action.post.fake_count;
                        post.mixedvote_count = action.post.mixedvote_count;
                    }
                    return post
                })
            }
        case FAKE_VOTE_COMPLETE:
            return {
                ...state,
                loading: false,
                items: state.items.map((post) => {
                    if (post._id === action.post._id) {
                        post.approved_count = action.post.approved_count;
                        post.fake_count = action.post.fake_count;
                        post.mixedvote_count = action.post.mixedvote_count;
                    }
                    return post
                })
            }
        case MIX_VOTE_COMPLETE:
            return {
                ...state,
                loading: false,
                items: state.items.map((post) => {
                    if (post._id === action.post._id) {
                        post.approved_count = action.post.approved_count;
                        post.fake_count = action.post.fake_count;
                        post.mixedvote_count = action.post.mixedvote_count;
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
        case INCREMENT_PAGE:
            return {
                ...state,
                nextPage: state.nextPage + 1,
                loading: false
            }
        case NO_MORE:
            return {
                ...state,
                hasMore: false
            }
        default:
            return state;
    }
}