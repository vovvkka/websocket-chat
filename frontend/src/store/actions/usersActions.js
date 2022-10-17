import axiosApi from "../../axiosApi";
import {historyPush} from "./historyActions";

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const CLEAR_REGISTER_ERRORS = 'CLEAR_REGISTER_ERRORS';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const CLEAR_LOGIN_ERRORS = 'CLEAR_LOGIN_ERRORS';

export const LOGOUT_USER = 'LOGOUT_USER';

const registerUserRequest = () => ({type: REGISTER_USER_REQUEST});
const registerUserSuccess = (user) => ({type: REGISTER_USER_SUCCESS, payload: user});
const registerUserFailure = (e) => ({type: REGISTER_USER_FAILURE, payload: e});
export const clearRegisterErrors = () => ({type: CLEAR_REGISTER_ERRORS});

const loginUserRequest = () => ({type: LOGIN_USER_REQUEST});
const loginUserSuccess = (user) => ({type: LOGIN_USER_SUCCESS, payload: user});
const loginUserFailure = (e) => ({type: LOGIN_USER_FAILURE, payload: e});
export const clearLoginErrors = () => ({type: CLEAR_LOGIN_ERRORS});

export const registerUser = userData => {
    return async dispatch => {
        try {
            dispatch(registerUserRequest());

            const response = await axiosApi.post('/users', userData);

            dispatch(registerUserSuccess(response.data));
            dispatch(historyPush('/'));
        } catch (e) {
            if (e.response && e.response.data) {
                dispatch(registerUserFailure(e.response.data));
            } else {
                dispatch(registerUserFailure({global: 'No internet'}));
            }
        }
    };
};

export const loginUser = userData => {
    return async dispatch => {
        try {
            dispatch(loginUserRequest());

            const response = await axiosApi.post('/users/sessions', userData);

            dispatch(loginUserSuccess(response.data.user));
            dispatch(historyPush('/'));
        } catch (e) {
            if (e.response && e.response.data) {
                dispatch(loginUserFailure(e.response.data));
            } else {
                dispatch(loginUserFailure({global: 'No internet'}));
            }
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await axiosApi.delete('/users/sessions');

            dispatch({type: LOGOUT_USER});
            dispatch(historyPush('/'));
        } catch (e) {
            console.log(e);
        }
    }
};
