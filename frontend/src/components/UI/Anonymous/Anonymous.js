import React from 'react';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";

const Anonymous = () => {
  return (
    <>
      <Button component={Link} to="/register" color="inherit" sx={{fontWeight: 'bold'}}>
        Register
      </Button>
      <Button component={Link} to="/login" color="inherit" sx={{fontWeight: 'bold'}}>
        Login
      </Button>
    </>
  );
};

export default Anonymous;