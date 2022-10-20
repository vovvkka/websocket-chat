import React, {useEffect, useState} from 'react';
import {Alert, Avatar, Container, Grid, Link, Typography} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import {LockOpenOutlined} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {clearLoginErrors, loginUser} from "../../store/actions/usersActions";
import ButtonWithProgress from "../../components/UI/ButtonWithProgress/ButtonWithProgress";
import {Link as RouterLink} from "react-router-dom";
import FormElement from "../../components/UI/FormElement/FormElement";

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
        width: '80%',
        margin: '15px auto',
    },
    link: {
        marginTop: '20px'
    }
}));

const Login = () => {
    const {classes} = useStyles();
    const dispatch = useDispatch();
    const error = useSelector(state => state.users.loginError);
    const loading = useSelector(state => state.users.loginLoading);

    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            dispatch(clearLoginErrors());
        }
    }, [dispatch]);


    const inputChangeHandler = (name, value) => {
        setUser(prev => ({...prev, [name]: value}));
    };

    const submitFormHandler = e => {
        e.preventDefault();
        dispatch(loginUser({...user}));
    };

    return (
        <Container maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOpenOutlined/>
                </Avatar>
                <Typography component="h1" variant="h6" sx={{marginBottom: '20px'}}>
                    Login
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
                    />

                    <FormElement
                        type="password"
                        required={true}
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={(e) => inputChangeHandler(e.target.name, e.target.value)}
                    />

                    {error && (
                        <Alert severity="error" className={classes.alert}>
                            Error! {error.message}
                        </Alert>
                    )}

                    <Grid item xs={12}>
                        <ButtonWithProgress
                            loading={loading}
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </ButtonWithProgress>
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex-end">
                    <Grid item className={classes.link}>
                        <Link component={RouterLink} to="/register">
                            Don't have an account? Register
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default Login;