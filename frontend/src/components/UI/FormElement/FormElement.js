import React from 'react';
import {Grid, TextField} from "@mui/material";

const FormElement = (props) => {
    return (
        <Grid item xs={12}>
            <TextField
                type={props.type}
                required={props.required}
                label={props.label}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                error={Boolean(props.error)}
                helperText={props.error}
                autoComplete={props.name}
            />
        </Grid>
    );
};

export default FormElement;