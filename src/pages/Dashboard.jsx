import { useState, useEffect } from 'react';
import { 
    Container, Paper, Typography, Grid, Box, Card, 
    CardContent, CircularProgress 
} from '@mui/material';
import { 
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer 
} from 'recharts';
import { useSpring, animated } from '@react-spring/web';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [counterHistory, setCounterHistory] = useState([]);
    const [editorContent, setEditorContent] = useState('');

    // Animation for dashboard elements
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 280, friction: 20 }
    });

    // Get current UTC time in required format
    const getCurrentUTCTime = () => {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Load data and start timer
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
                    setCounterHistory(JSON.parse(savedHistory));
                }

                // Load editor content
                const savedContent = localStorage.getItem('editorContent');
                if (savedContent) {
                    setEditorContent(savedContent);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();

        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(getCurrentUTCTime());
        }, 1000);

        // Initial time set
        setCurrentTime(getCurrentUTCTime());

        return () => {
            clearInterval(timer);
        };
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
                            <Typography variant="body1" sx={{ 
                                mb: 1,
                                fontFamily: 'monospace',
                                fontSize: '1.1rem',
                                whiteSpace: 'nowrap'
                            }}>
                                <strong>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</strong>{' '}
                                {currentTime}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                <strong>Current User's Login:</strong> TeAcHaCk
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Counter Actions
                                </Typography>
                                <Typography variant="h4">
                                    {counterHistory.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Words
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
                                    Characters
                                </Typography>
                                <Typography variant="h4">
                                    {contentStats.characters}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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

                {/* Content Statistics */}
                <Paper elevation={3} sx={{ p: 3 }}>
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
            </animated.div>
        </Container>
    );
};

export default Dashboard;