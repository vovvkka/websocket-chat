import axiosApi from "../../axiosApi";
import {historyPush} from "./historyActions";

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const CLEAR_REGISTER_ERRORS = 'CLEAR_REGISTER_ERRORS';

export const LOGOUT_USER = 'LOGOUT_USER';

const registerUserRequest = () => ({type: REGISTER_USER_REQUEST});
const registerUserSuccess = (user) => ({type: REGISTER_USER_SUCCESS, payload: user});
const registerUserFailure = (e) => ({type: REGISTER_USER_FAILURE, payload: e});
export const clearRegisterErrors = () => ({type: CLEAR_REGISTER_ERRORS});

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

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await axiosApi.delete('/users/sessions');

            dispatch({type: LOGOUT_USER});
            dispatch(historyPush('/'));
        } catch (e) {

        }
    }
};
