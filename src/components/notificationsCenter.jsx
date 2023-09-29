import React, { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import axios from 'axios';
import { AuthContext } from '../contexts/Auth';
import  ClearAllIcon  from '@mui/icons-material/ClearAll';

const NotificationsCenter = ()=> {
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
    <>
    <List sx={{ width: '100%', height:'100%',marginBottom:"0%", bgcolor: 'background.paper' }}>
    <Box
      sx={{
        width:"100%",
        hight:"30%"
      }}
    >
      <Typography
       variant="h3"
       sx={{
        marginLeft:"30px",
        color:colors.blueAccent[300]
       }}
       >Les Notifications</Typography>
    </Box>
    {notifications.map((notification, index) => (
      <>
        <Box 
          key={index}
          sx={{
            alignContent:"inline",
            p:3
          }}
        >
          {notification.text}
          <ClearAllIcon 
          sx={{
            float:"right"
          }}
          onclick={handleSwipe(notification.idLog)}
          />
        </Box>
        <Divider variant="inset" component="li" />
      </>
    ))}
    </List>
    </>
  );
}

export default NotificationsCenter;