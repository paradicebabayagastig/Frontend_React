

import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  styled,
  useTheme,
  Box,
  Button,
  IconButton,
  Modal,
  Switch,
  TextField
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { tokens } from "../theme";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { AuthContext } from '../contexts/Auth';


const IceCreamCard = ({ flavorName, flavorClass, flavorType, isAvailable, imageUrl, flavorId, removeProduit, reference: initialReference }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(isAvailable);
  const [reference, setReference] = useState(initialReference);
  const [editedReference, setEditedReference] = useState(initialReference);
  const [isEditingReference, setIsEditingReference] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setIsEditingReference(false); 
  };

  const handleClose = () => setOpen(false);

  const handleChange = async () => {
    const id = parseInt(flavorId);
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/produits/${id}`, {
        availability: !checked
      });
      setChecked(!checked);
      if (!checked) {
        toast.info("produit " + flavorName + " available");
      } else {
        toast.info("produit " + flavorName + " unavailable");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditReference = async () => {
    const id = parseInt(flavorId);
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/produits/${id}`, {
        reference: editedReference
      });
      setReference(editedReference); 
      toast.success("Reference updated successfully");
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update reference");
    }
  };

  const setHidden = async () => {
    const id = parseInt(flavorId);
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/produits/${id}`, {
        hidden: true
      });
      removeProduit(id);
      handleClose();
      toast.error('Le produit ' + flavorName + " a été ajouté au corbeille", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const authCtx = useContext(AuthContext);
  const token = authCtx.isAuthenticated;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 300,
    margin: 'auto',
    marginTop: theme.spacing(2),
    backgroundColor: colors.primary[400],
    display: 'flex',
    flexDirection: 'column',
  }));

  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    flex: '1 0 auto',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: colors.primary[400],
          border: '2px solid #000',
          boxShadow: 24,
          borderRadius: '30px',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography>
            Modifier la référence du produit
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={editedReference}
            onChange={(event) => setEditedReference(event.target.value)}
            sx={{ width: '100%', marginBottom: 2 }}
          />
          <Button
            onClick={handleEditReference}
            variant="contained"
            style={{
              backgroundColor: colors.primary[400],
              maxHeight: 30,
              marginTop: 18,
              color: 'white'
            }}
          >
            Enregistrer
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            style={{
              backgroundColor: colors.redAccent[400],
              maxHeight: 30,
              marginTop: 18,
              color: 'red'
            }}
          >
            Annuler
          </Button>
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
          <Typography variant="subtitle1" color="textSecondary">
  Reference: {isEditingReference ? (
    <TextField
      variant="outlined"
      size="small"
      value={editedReference}
      onChange={(event) => setEditedReference(event.target.value)}
      sx={{ width: '100%', marginTop: 2 }}
    />
  ) : (
    reference
  )}
</Typography>

        </StyledCardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 2,
          }}
        >
          <IconButton
            onClick={handleOpen}
            sx={{
              background: colors.primary[400],
              borderRadius: 50,
            }}
          >
            <EditIcon sx={{ color: colors.primary[100] }} />
          </IconButton>
          <IconButton
            onClick={setHidden}
            sx={{
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


