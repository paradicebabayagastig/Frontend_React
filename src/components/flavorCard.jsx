import React, { useState,useRef, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  styled,
  useTheme,
  Popover,
  List, 
  ListItem,
  ListItemText,
  Box,
  Button,
  IconButton,
  Modal,
  Switch,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { tokens } from "../theme";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { AuthContext } from '../contexts/Auth';


const IceCreamCard = ({ flavorName, flavorClass, flavorType, isAvailable, imageUrl, flavorId, removeProduit }) => {
    const [open,setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [checked,setChecked] = useState(isAvailable)

    const  handleChange = async ()=>{
      const id = parseInt(flavorId)
        try {const response = await axios.patch(`http://localhost:3000/api/v1/produits/${id}`,{
            availability:!checked
          })
          setChecked(!checked)
          if(!checked)
            toast.info("produit"+flavorName+" available")
          else
            toast.info("produit"+flavorName+" unavailable")
        }catch(err) {
            console.log(err)
        }

    }
    const  setHidden = async ()=>{
      const id = parseInt(flavorId)
        try {const response = await axios.patch(`http://localhost:3000/api/v1/produits/${id}`,{
            hidden:true
          })
          removeProduit(id)
          handleClose()
          toast.error('Le produit '+flavorName+" a été ajoutée au corbeille", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }catch(err) {
            console.log(err)
        }
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: colors.primary[400],
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius:'30px',
        p: 4,
    };
    const deleteProduit = async () => {
        const id = parseInt(flavorId)
        try {const response = await axios.delete(`http://localhost:3000/api/v1/produits/${id}`,{
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            
            },
          })
        console.log(response)
        removeProduit(id)
        handleClose()

        }
        catch(err) {
            console.log(err)
            handleClose()
        }
    }

    const authCtx = useContext(AuthContext)
    const token = authCtx.isAuthenticated
    const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 300,
    margin: 'auto',
    marginTop: theme.spacing(2),
    backgroundColor: colors.primary[400],
    display: 'flex',
    }));

    const StyledCardContent = styled(CardContent)(({ theme }) => ({
    flex: '1 0 auto',
    overflow: 'hidden', // Hide overflow for text
    maxHeight: '120px', // Limit the height of the card content
    }));

    const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    width: 120,
    height: 120,
    objectFit: 'cover',
    }));

  return (
    <Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>
                ajouter au corbeil?
              </Typography>
              <Box sx={{
                display:'flex',
                mt:2,
                gap:5,
              }}>
                <Button onClick={setHidden} variant="contained" style={{ backgroundColor: colors.redAccent[400],maxHeight: 30,marginTop:18, color: 'red' }}>
                  oui
                </Button>
                <Button onClick={handleClose} variant="contained" style={{ backgroundColor: colors.greenAccent[400],maxHeight: 30,marginTop:18, color: 'green' }}>
                  non
                </Button>
              </Box>
              
            </Box>
        </Modal>
        <StyledCard>
            <StyledCardContent>
                <Typography variant="h5" component="div">
                {flavorName}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                Class: {flavorClass}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                Type: {flavorType}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                Available: {isAvailable ? 'Yes' : 'No'}
                </Typography>
            </StyledCardContent>
            <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Align buttons in the center horizontally
          marginLeft: 3,
          marginTop: 1,
          marginRight: 3,
        }}
      >
        <IconButton
          onClick={handleOpen} 
          sx={{
            marginBottom: 1,
            background: colors.primary[400],
            borderRadius: 50,
          }}
        >
          <ClearIcon sx={{ color: colors.primary[100] }} />
        </IconButton>
        <Switch
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'label': 'controlled' }}
        />
      </Box>            
        </StyledCard>
        
    </Box>
  );
};

export default IceCreamCard;
