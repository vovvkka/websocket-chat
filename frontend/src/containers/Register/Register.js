import React, {useEffect, useState} from 'react';
import {Avatar, Container, Grid, Link, Typography} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import {LockOutlined} from "@mui/icons-material";
import FormElement from "../../components/UI/FormElement/FormElement";
import {useDispatch, useSelector} from "react-redux";
// import {clearRegisterErrors, registerUser} from "../store/actions/usersActions";
import ButtonWithProgress from "../../components/UI/ButtonWithProgress/ButtonWithProgress";
import {Link as RouterLink} from 'react-router-dom';
import {clearRegisterErrors, registerUser} from "../../store/actions/usersActions";

const useStyles = makeStyles()(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(2),
        backgroundColor: `${theme.palette.grey["800"]} !important`,
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: `${theme.spacing(1, 0)} !important`,
        backgroundColor: `${theme.palette.grey["800"]} !important`,
    },
    alert: {
        margin: theme.spacing(3, 0),
        width: '100%',
    },
    link: {
        marginTop: '20px'
    }
}));

const Register = () => {
    const {classes} = useStyles();
    const dispatch = useDispatch();
    const error = useSelector(state => state.users.registerError);
    const loading = useSelector(state => state.users.registerLoading);

    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            dispatch(clearRegisterErrors());
        }
    }, [dispatch]);

    const inputChangeHandler = (name, value) => {
        setUser(prev => ({...prev, [name]: value}));
    };

    const submitFormHandler = e => {
        e.preventDefault();
        dispatch(registerUser({...user}));
    };

    const getFieldError = fieldName => {
        try {
            return error.error[fieldName].message;
        } catch {
            return undefined;
        }
    };

    return (
        <Container maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h6" sx={{marginBottom: '20px'}}>
                    Sign up
                </Typography>

                <Grid
                    component="form"
                    onSubmit={submitFormHandler}
                    container
                    spacing={2}
                >
                    <FormElement
                        required={true}
                        label="Username"
                        name="username"
                        value={user.username}
                        onChange={(e) => inputChangeHandler(e.target.name, e.target.value)}
                        error={getFieldError('username')}
                    />

                    <FormElement
                        type="password"
                        required = {true}
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={(e) => inputChangeHandler(e.target.name, e.target.value)}
                        error={getFieldError('password')}
                    />

                    <Grid item xs={12}>
                        <ButtonWithProgress
                            loading={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </ButtonWithProgress>
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex-end">
                    <Grid item className={classes.link}>
                        <Link component={RouterLink} to="/login">
                            Already have an account? Login
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default Register;