import React from 'react';
import {Link} from "react-router-dom";
import {makeStyles} from "tss-react/mui";
import {AppBar, Container, Grid, Toolbar, Typography} from "@mui/material";
import Anonymous from "../Anonymous/Anonymous";

const useStyles = makeStyles()(theme => ({
    mainLink: {
        color: 'inherit',
        textDecoration: 'none',
        fontWeight: 'bold',
        '&:hover': {
            color: 'inherit',
        },
        fontSize: '30px'
    },
    staticToolbar: {
        marginBottom: theme.spacing(6),
    },
    toolbar: {
        backgroundColor: `${theme.palette.grey["900"]} !important`,
        padding: '15px'
    }
}));

const AppToolbar = () => {
    const {classes} = useStyles();

    return (
        <>
            <AppBar position="fixed" className={classes.toolbar}>
                <Container>
                    <Toolbar>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                                <Link to="/" className={classes.mainLink}>
                                    Chat
                                </Link>
                            </Typography>
                            <Grid item>
                                {<Anonymous/>}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar className={classes.staticToolbar}/>
        </>
    );
};

export default AppToolbar;