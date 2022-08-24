export const loginAction = (data) => {
    // console.log('data dari userAct:', data);
    return {
        type : 'LOGIN_SUCCESS',
        payload: data
    }
}


export const logoutAction = (data) => {
    return {
        type : 'LOGOUT_SUCCESS',
        payload: data
    }
}