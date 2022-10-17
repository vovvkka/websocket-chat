import React from 'react';
import {Button, Grid, Typography} from "@mui/material";

const UserMenu = ({username}) => {

    return (
        <Grid container alignItems='center' justifyContent='space-between'>
            <Typography>Hello, {username}!</Typography>
            <Button color='inherit' sx={{marginX: '20px'}}>
                Logout
            </Button>
        </Grid>
    );
};

export default UserMenu;