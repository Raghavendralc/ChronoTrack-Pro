import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet'
];

const RichTextEditor = () => {
    const [content, setContent] = useState(
        localStorage.getItem("editorData") || ""
    );

    // Auto-save content to localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem("editorData", content);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [content]);

    return (
        <div style={{ marginTop: "20px",marginBottom: "30px" }}>
            <ReactQuill 
                theme="snow"
                value={content} 
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ height: "200px" }}
            />
        </div>
    );
};

export default RichTextEditor;