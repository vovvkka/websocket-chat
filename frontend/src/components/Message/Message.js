import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Message = ({user, message}) => {
    return (
        <Card sx={{margin: '10px'}}>
            <CardContent>
                <Typography gutterBottom variant="body1" component="div">
                    <b>{user}:</b> {message}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Message;