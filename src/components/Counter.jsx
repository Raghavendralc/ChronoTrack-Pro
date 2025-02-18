import { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";

const Counter = () => {
    const [count, setCount] = useState(0);

    // Animation for background color
    const props = useSpring({
        from: { backgroundColor: `rgba(0, 0, 255, 0)` },
        to: { backgroundColor: `rgba(0, 0, 255, ${count / 10})` },
        config: { tension: 120, friction: 14 }
    });

    // Save counter activity with timestamp
    const saveCounterActivity = (newCount) => {
        const now = new Date();
        const activity = {
            count: newCount,
            timestamp: now.toISOString(),
            formattedTime: now.toLocaleTimeString()
        };

        // Get existing history or initialize new array
        const history = JSON.parse(localStorage.getItem('counterHistory') || '[]');
        history.push(activity);
        localStorage.setItem('counterHistory', JSON.stringify(history));
    };

    const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);
        saveCounterActivity(newCount);
    };

    const handleDecrement = () => {
        const newCount = count - 1;
        setCount(newCount);
        saveCounterActivity(newCount);
    };

    const handleReset = () => {
        setCount(0);
        saveCounterActivity(0);
    };

    return (
        <animated.div style={props}>
            <Box sx={{ textAlign: "center", p: 3, minHeight: "200px" }}>
                <h2>Counter: {count}</h2>
                <Button 
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={handleIncrement}
                >
                    Increment
                </Button>
                <Button 
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={handleDecrement}
                >
                    Decrement
                </Button>
                <Button 
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </Box>
        </animated.div>
    );
};

export default Counter;