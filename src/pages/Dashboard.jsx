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
    const [currentTime, setCurrentTime] = useState('');
    const [counterHistory, setCounterHistory] = useState([]);
    const [editorContent, setEditorContent] = useState('');

    // Animation config
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 280, friction: 20 }
    });

    // Get current UTC time
    const getCurrentUTCTime = () => {
        const now = new Date();
        return now.toISOString()
            .replace('T', ' ')
            .split('.')[0];
    };

    // Calculate content statistics
    const calculateContentStats = (content) => {
        // Get content from localStorage if not provided
        const textContent = content || localStorage.getItem('editorContent') || '';

        // Remove HTML tags and decode HTML entities
        const div = document.createElement('div');
        div.innerHTML = textContent;
        const plainText = div.textContent || div.innerText || '';

        return {
            characters: plainText.length,
            words: plainText.trim().split(/\s+/).filter(word => word.length > 0).length,
            lines: (plainText.match(/\n/g) || []).length + 1,
            paragraphs: plainText.split(/\n\s*\n/).filter(para => para.trim().length > 0).length
        };
    };

    // Load data from localStorage
    useEffect(() => {
        const loadData = () => {
            try {
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

        // Cleanup timer
        return () => clearInterval(timer);
    }, []);

    // Set up content stats update
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'editorContent') {
                setEditorContent(e.newValue || '');
            }
        };

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);

        // Initial load
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            setEditorContent(savedContent);
        }

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const contentStats = calculateContentStats(editorContent);

    // Loading state
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const formatChartData = (history) => {
        return history.map(item => ({
            ...item,
            // Format the timestamp to show only time HH:MM:SS
            displayTime: new Date(item.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
        }));
    };

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
                                <strong>Current User's Login:</strong> User
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Words
                                </Typography>
                                <Typography variant="h4">
                                    {contentStats.words}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Lines
                                </Typography>
                                <Typography variant="h4">
                                    {contentStats.lines}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                </Grid>

                {/* Counter Activity Chart */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Counter Activity History
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={formatChartData(counterHistory)}
                                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="displayTime"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    tick={{ fontSize: 12 }}
                                    label={{
                                        value: 'Time (HH:MM:SS)',
                                        position: 'bottom',
                                        offset: 8
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Counter Value',
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: -5
                                    }}
                                />
                                <Tooltip
                                    formatter={(value, name) => [value, 'Counter Value']}
                                    labelFormatter={(label) => `Time: ${label}`}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8884d8"
                                    name="Counter Value"
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* Content Statistics Chart */}
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