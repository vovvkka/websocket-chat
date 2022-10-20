import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Button} from "@mui/material";

const Message = ({user, message, role, onDelete}) => {
    return (
        <Card sx={{margin: '10px'}}>
            <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography gutterBottom variant="body1" component="div">
                    <b>{user}:</b> {message}
                </Typography>
                {
                    role === 'moderator' ?
                        <Button size="small" color="error" onClick={onDelete}>Delete</Button> : null
                }
            </CardContent>
        </Card>
    );
};

export default Message;