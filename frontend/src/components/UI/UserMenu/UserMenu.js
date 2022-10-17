import React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {logoutUser} from "../../../store/actions/usersActions";

const UserMenu = ({username}) => {
    const dispatch = useDispatch();

    return (
        <Grid container alignItems='center' justifyContent='space-between'>
            <Typography>Hello, {username}!</Typography>
            <Button color='inherit' sx={{marginX: '20px'}} onClick={() => dispatch(logoutUser())}>
                Logout
            </Button>
        </Grid>
    );
};

export default UserMenu;