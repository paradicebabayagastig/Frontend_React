import { AuthContext } from "../../contexts/Auth";
import { useEffect,useContext, useState } from "react";
import Header from "../../components/Header";
import IceCreamCard from "../../components/flavorCard";
import axios from "axios";
import Stock from "../stock";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Box, Paper, Typography, Button,useTheme } from '@mui/material';
const Home = () => 

{   
    const authCtx = useContext(AuthContext)
    const name = authCtx.name
    var role = authCtx.role
    const navigate = useNavigate()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    role = role.replace(/_/g, ' ');
    const [stock,setStock] = useState([]);
    const [commande,setCommande] = useState([]);
    const checkStock = async ()=>{
      try{
        const response = await axios.get('http://localhost:3000/api/v1/stocks', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', 
          }
        })
          const allStocks = response.data;
          const today = new Date().toISOString();
          const filteredStocks = allStocks.filter(stock => 
            stock.pointVenteId == authCtx.id && stock.dateStock.slice(0,10) == today.slice(0,10)
          );
          console.log("today",today.slice(0,10));
        setStock(filteredStocks);
        
      }catch(error) {
          console.error('Error fetching stocks:', error);
      }
      
    }

    const checkCommande = async ()=>{
      try{
        const response = await axios.get('http://localhost:3000/api/v1/commandes', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', 
          }
        })
          const allCommandes = response.data;
          const today = new Date().toISOString();
          const filteredCommandes = allCommandes.filter(commande => 
            commande.idPointVente == authCtx.id && commande.dateCommande.slice(0,10) == today.slice(0,10)
          );
          console.log("today",today.slice(0,10));
        setCommande(filteredCommandes);
        
      }catch(error) {
          console.error('Error fetching stocks:', error);
      }
      
    }

    useEffect(()=>{
      checkStock()
      checkCommande()
    },[])
    
    const message = 'Hello, ' + role

    const handleCreateStock = async () => {
        const today = new Date().toISOString();

        try{
        const response = await axios.post('http://localhost:3000/api/v1/stocks', {
            pointVenteId: authCtx.id,
            dateStock: today,
        })
        console.log(response)
          const newStockId = parseInt(response.data.idStock); 
          navigate(`/stock/${newStockId}`);
      }catch(error){
          console.error('Error creating stock:', error);
      }
      };

      const handleCreateCommande =()=>{
        navigate('/commande');
      };

      return(
      <>
        <Box m="50px" >
            <Header title={message} subtitle={name} />
        </Box>
      
        { stock.length == 0 &&
          <Box>
        <Paper 
          elevation={3}
          sx={{
            margin:"50px",
            padding: theme.spacing(2),
            backgroundColor: colors.primary[400], // Transparent white background
            maxWidth: '400px',
          }}>
          <Typography variant="body1">
            Vous n'avez pas créé de stock pour aujourd'hui.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateStock}>
            Créer un stock
          </Button>
        </Paper>
        </Box>
      }
      { commande.length == 0 &&
          <Box>
        <Paper 
          elevation={3}
          sx={{
            margin:"50px",
            padding: theme.spacing(2),
            backgroundColor: colors.primary[400], // Transparent white background
            maxWidth: '400px',
          }}>
          <Typography variant="body1">
            Vous n'avez pas créé une Commande pour aujourd'hui.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateCommande}>
            Créer une commande
          </Button>
        </Paper>
        </Box>
      }
    </>

    );
    
    
}





export default Home;