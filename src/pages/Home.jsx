import { Container, Paper, Typography } from "@mui/material";
import Counter from "../components/Counter";
import UserForm from '../components/UserForm';
import RichTextEditor from '../components/RichTextEditor';

const Home = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Counter
                </Typography>
                <Counter />
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    User Form
                </Typography>
                <UserForm />
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Rich Text Editor
                </Typography>
                <RichTextEditor />
            </Paper>
        </Container>
    );
};

export default Home;