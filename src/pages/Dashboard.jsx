import { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Grid, Box, Card,
    CardContent, CircularProgress
} from '@mui/material';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSpring, animated } from '@react-spring/web';

const Dashboard = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [counterHistory, setCounterHistory] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(true);

    // Format current UTC time in YYYY-MM-DD HH:MM:SS format
    const format = {
        year: now.getUTCFullYear(),
        month: String(now.getUTCMonth() + 1).padStart(2, '0'),
        day: String(now.getUTCDate()).padStart(2, '0'),
        hours: String(now.getUTCHours()).padStart(2, '0'),
        minutes: String(now.getUTCMinutes()).padStart(2, '0'),
        seconds: String(now.getUTCSeconds()).padStart(2, '0')
    };

    return `${format.year}-${format.month}-${format.day} ${format.hours}:${format.minutes}:${format.seconds}`;
};
useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(getCurrentUTCTime());
    }, 1000);

    return () => clearInterval(timer);
}, []);

// Animation for cards
const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
});

useEffect(() => {
    const loadData = () => {
        try {
            // Load user data
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }

            // Load counter history
            const savedHistory = localStorage.getItem('counterHistory');
            if (savedHistory) {
                const history = JSON.parse(savedHistory);
                setCounterHistory(history);
            }

            // Load editor content
            const savedContent = localStorage.getItem('editorData') || '';
            setEditorContent(savedContent);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    loadData();
    const intervalId = setInterval(loadData, 30000);
    return () => clearInterval(intervalId);
}, []);

// Calculate content statistics
const contentStats = {
    characters: editorContent.length,
    words: editorContent.trim().split(/\s+/).filter(Boolean).length,
    lines: editorContent.split('\n').length,
    paragraphs: editorContent.split('\n\n').filter(Boolean).length
};

if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
        </Box>
    );
}

return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <animated.div style={fadeIn}>
            {/* Current Session Info */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Current Session Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Current Date and Time (UTC):</strong> {getCurrentUTCTime()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Current User's Login:</strong> {user?.username || 'Not logged in'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Quick Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Current Counter Value
                            </Typography>
                            <Typography variant="h4">
                                {counterHistory[counterHistory.length - 1]?.count || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Words in Editor
                            </Typography>
                            <Typography variant="h4">
                                {contentStats.words}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Last Activity
                            </Typography>
                            <Typography variant="body1">
                                {counterHistory[counterHistory.length - 1]?.formattedTime || 'No activity'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Content Statistics */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Content Statistics
                </Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { name: 'Characters', value: contentStats.characters },
                                { name: 'Words', value: contentStats.words },
                                { name: 'Lines', value: contentStats.lines },
                                { name: 'Paragraphs', value: contentStats.paragraphs }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Counter Activity Chart */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Counter Activity History
                </Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={counterHistory}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="formattedTime"
                                label={{ value: 'Time', position: 'bottom' }}
                            />
                            <YAxis
                                label={{ value: 'Counter Value', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#8884d8"
                                name="Counter Value"
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* User Profile */}
            {userData && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        User Profile Data
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Name:</strong> {userData.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {userData.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phone:</strong> {userData.phone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {userData.address}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </animated.div>
    </Container>
);
};

export default Dashboard;