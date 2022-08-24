const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    post: [],
    profile_img : '',
    verification: '',
    reset_password: ''
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, ...action.payload }
        case 'LOGOUT_SUCCESS':
            return INITIAL_STATE
        default:
            return state;
    }
}
