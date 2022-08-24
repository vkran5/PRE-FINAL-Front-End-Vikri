const INITIAL_STATE = {
    image : '',
    caption: ''
}

export const postReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'POST_SUCCESS':
            return { ...state, ...action.payload }
        default:
            return state;
    }
}
