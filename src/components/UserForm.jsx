import { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

const UserForm = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });
    const [isDirty, setIsDirty] = useState(false);

    // Handle unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (field) => (e) => {
        setUser({ ...user, [field]: e.target.value });
        setIsDirty(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            ...user,
            id: `USER_${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        setIsDirty(false);
        alert("User data saved successfully!");
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <TextField 
                label="Name" 
                fullWidth 
                margin="normal" 
                value={user.name}
                onChange={handleChange("name")} 
                required
            />
            <TextField 
                label="Email" 
                type="email"
                fullWidth 
                margin="normal" 
                value={user.email}
                onChange={handleChange("email")} 
                required
            />
            <TextField 
                label="Phone" 
                fullWidth 
                margin="normal" 
                value={user.phone}
                onChange={handleChange("phone")} 
                required
            />
            <TextField 
                label="Address" 
                fullWidth 
                margin="normal" 
                value={user.address}
                onChange={handleChange("address")} 
                multiline
                rows={3}
                required
            />
            <Button 
                type="submit" 
                variant="contained" 
                sx={{ mt: 2 }}
                disabled={!isDirty}
            >
                Save
            </Button>
        </Box>
    );
};

export default UserForm;