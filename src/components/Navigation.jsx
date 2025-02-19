import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ mb: 3 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    React Assessment
                </Typography>
                {user ? (
                    <>
                        <Button color="inherit" onClick={() => navigate('/')}>
                            Home
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle2" component="span">
                                ReactUser
                            </Typography>
                            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                                Logout
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;