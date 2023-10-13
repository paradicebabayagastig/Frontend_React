import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { useEffect } from 'react';


const OrderItemForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data,setData] = useState('')

  useEffect(() => {
    const date = new Date(props.date);
    const bon = date.toISOString().split('T')[0];
    setData(bon);
  }, []);

  useEffect(() => {
    console.log("bon:",data)
  },[data])

  const cardStyle = {
    backgroundColor:colors.primary[500],
    borderRadius: '10px',
    border: `1px solid ${colors.grey[300]}`,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '400px',
   
   // Increased padding for more spacious appearance
  };

  const titleStyle = {
    color: colors.primary[100], // Using your blue accent color
    marginBottom: '16px',
  };

  const subTitleStyle = {
    color: colors.pinkAccent[100],
    marginBottom: '16px'
  }

  const inputStyle = {
    marginBottom: '16px',
  };

  const modifyButtonStyle = {
    // display:"flex",
    // gap:5,
    marginTop: '12px',
    marginBottom: '12px',
    marginRight: 15,
    float: 'right'
  };

  return (
    <Container>
      <Card style={cardStyle}>
        <CardContent>
          <Box display="flex" gap={4} alignContent='center'>
          <Typography variant="h5" style={titleStyle}>
            Bon Commande n°{props.index+1}
          </Typography>
          {
            (props.type === "SUITE") && (
              <Chip label="SUITE" sx={{
                background:colors.pinkAccent[400],
              }}/>
            )
          }  
          </Box>
          
          <TextField
            label="Date Livraison"
            type="date"
            variant="outlined"
            value={data}
            fullWidth
            style={inputStyle}
            InputLabelProps={{ shrink: true }} // Keep label above input
            disabled
          />
        </CardContent>
        <div style={modifyButtonStyle}>
          {
            (props.checked? <Link to={`/bonCommande/info/${props.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ 
              background: colors.primary[400], 
              color: colors.primary[100],
              '&:hover':{
                background: colors.pinkAccent[400], 
                color: colors.primary[100],

              }
              }}>
              Voir Plus
            </Button>
          </Link> :  <Link to={`/bonCommande/${props.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ 
              background: colors.primary[400],
              color: colors.primary[100],
              '&:hover':{
                background: colors.pinkAccent[400], 
                color: colors.primary[100],

              } }}>
              Modifier
            </Button>
          </Link>)
          }
          
          
        </div>
      </Card>
    </Container>)
    
  ;
};

export default OrderItemForm;
