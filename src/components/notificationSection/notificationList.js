// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/Auth';
import { tokens } from '../../theme';

import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';


const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    
    '&:hover': {
        background: theme.palette.primary?.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
    const authCtx = useContext(AuthContext);
  const nom = authCtx.name;
  const role = authCtx.role;
  const [notifications,setNotifications] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const getData = async()=>{
    if(role == "ADMIN"){
      const response = await axios.get('http://localhost:3000/api/v1/notifications/admin', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setNotifications(response.data)
    }else if(role == "RESPONSABLE_LOGISTIQUE"){
      const response = await axios.get('http://localhost:3000/api/v1/notifications/responsable', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setNotifications(response.data)
    }
  }
  useEffect(()=>{
    getData();
  },[])
  
  const handleSwipe = async(id)=>{
    const i =parseInt(id);
    const response = await axios.patch(`http://localhost:3000/api/v1/notifications/${i}`,{
      seen:true
    })
  }
  

    return ( 
        <List
            sx={{
                width: '100%',
                maxWidth: '800px',
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: '800px'
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 1,
                    pt:1
                }
            }}
        >
            {notifications.map((notification)=>(
            <>
           <ListItemWrapper>
                    <ListItem>
                        <ListItemSecondaryAction>
                            <Typography  variant="caption" display="block" >
                                {notification.dateNotif.slice(0, 10)}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Grid  className="list-container">
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography>{notification.text}</Typography>
                        </Grid>
                    </Grid>
            </ListItemWrapper>
            <Divider />
            </>
            )) }
        </List>
    );
};

export default NotificationList;