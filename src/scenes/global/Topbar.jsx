import { Box, IconButton, Modal, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { AuthContext } from "../../contexts/Auth";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import NotificationsCenter from "../../components/notificationsCenter";
import NotificationSection from "../../components/notificationSection/index"

//import SearchIcon from "@mui/icons-material/Search";


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const authCtx = useContext(AuthContext); 
  const [open,setOpen] = useState(false);
  const handleOpen = ()=> setOpen(!open) 
  const handleClose = ()=>setOpen(false)
  
  const handleClick = () => {
    axios.post("http://localhost:3000/api/v1/auth/logout")
    .then(()=>{
          authCtx.logout()
    })
    .catch((err)=>{console.log(err)})

  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}  sx={{
      background:colors.primary[400],
      marginLeft:0.5,
      marginRight:0.5,
      borderRadius:2,
      marginTop:0.5
    }}>
      {/* SEARCH BAR */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          width:"35%",
          transform:'translate(1000px,0px)'
        }}
      >
        <NotificationsCenter/>
      </Modal>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpen}>
          <NotificationsOutlinedIcon />        
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton>
          <PersonOutlinedIcon />
          <Link to="/profile "/>
        </IconButton>

        <IconButton onClick={handleClick}>
          <LogoutIcon  />
        </IconButton>
        <Box sx={{
          transform:'translate(950px,0px)'
        }}>
        <NotificationSection />
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;