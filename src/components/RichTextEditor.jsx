import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Paper } from '@mui/material';

const RichTextEditor = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        // Load saved content
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            setContent(savedContent);
        }
    }, []);

    const handleChange = (value) => {
        setContent(value);
        // Save to localStorage
        localStorage.setItem('editorContent', value);
    };

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ minHeight: '200px' }}>
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleChange}
                    style={{ height: '150px' }}
                />
            </Box>
        </Paper>
    );
};

export default RichTextEditor;