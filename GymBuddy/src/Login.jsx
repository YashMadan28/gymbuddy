import React from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

const Login = () => {
    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 10, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Email" variant="outlined" fullWidth required />
                    <TextField label="Password" type="password" variant="outlined" fullWidth required />
                    <Button variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Don't have an account? <a href="#">Sign up</a>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;