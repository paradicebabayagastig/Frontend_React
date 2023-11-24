import { AuthContext } from "../../contexts/Auth";
import { useEffect,useContext, useState } from "react";
import Header from "../../components/Header";
import IceCreamCard from "../../components/flavorCard";
import axios from "axios";
import pertes from "../pertes";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Box, Paper, Typography, Button,useTheme, IconButton } from '@mui/material';
import  BarChart  from '../../components/barChart2'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    const today = new Date()
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Adding 1 to get the correct month



    
    // Format the month as two digits (e.g., '01' for January, '12' for December)
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    
    // Combine year and month as 'YYYY-MM' string
    const initialDate = `${year}-${formattedMonth}`;

    
    const [date, setDate] = useState(initialDate);

    //states for checking order 
    const [stockExists, setStockExists] = useState();
    const [commandeExists, setCommandeExists] = useState();


    

    
    
    // Helper function to increment or decrement the month
    const changeMonth = (increment) => {
      const [currentYear, currentMonth] = date.split('-').map(Number);
  
      let newYear = currentYear;
      let newMonth = currentMonth + (increment ? 1 : -1);
  
      // Handle the case where the month goes beyond December or before January
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
  
      // Format the new month as two digits
      const newFormattedMonth = newMonth < 10 ? `0${newMonth}` : `${newMonth}`;
  
      // Update the date state with the new values
      setDate(`${newYear}-${newFormattedMonth}`);
    };

      // Function to increment the month
  const handleMonthIncrement = () => {
    changeMonth(true);
  };

  // Function to decrement the month
  const handleMonthDecrement = () => {
    changeMonth(false);
  };
    
 
  // fuction to check stock created 

  const checkStockForToday = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/stocks/check/${authCtx.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { hasStock } = response.data;
      console.log("test stock :",hasStock)
      setStockExists(hasStock);
    } catch (error) {
      console.error("Error checking stock:", error);
    }
  };

  
  





    const checkCommande = async ()=>{
      try{
        const response = await axios.get(`http://localhost:3000/api/v1/commandes/check/${authCtx.id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', 
          }
        })
          const commandeId = response.data.hasCommande;
          console.log("today",commandeId);
        setCommandeExists(commandeId);
        
      }catch(error) {
          console.error('Error fetching pertess:', error);
      }
      
    }

    useEffect(()=>{
      checkCommande()
      checkStockForToday()
    },[])

  useEffect(()=> {
    console.log('test commande existance : ', commandeExists)
  },[commandeExists])
    

    const message = 'Hello, ' + role
    

      const handleCreateCommande = () => {
        if (stockExists) {
          alert("Vous pouvez créé votre commande pour aujourd'hui.");
          navigate('/commande');
        } else {
          alert("Vous devez créé un stock d'abord !");
        }
      };



     

      const handleCreateStock =()=>{
        navigate('/stock');
      };



      return (
        <Box>
          <Box m="50px">
            <Header title={message} subtitle={name} />
          </Box>
      
          {(role === 'Point de vente') && (
            <Box
              display="flex"
              justifyContent="center"
              gap={10}  
            >
              {/* Stock Section */}
              <div style={{ flex: 1 }}>
                {stockExists===null? (
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: "50px",
                      padding: theme.spacing(2),
                      backgroundColor: colors.primary[400],
                      maxWidth: '400px',
                    }}
                  >
                    <Typography variant="body1">
                      Vous n'avez pas de stock pour aujourd'hui :{"("}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: colors.pinkAccent[400],
                        width: 300,
                        marginTop: 5,
                      }}
                      onClick={handleCreateStock}
                    >
                      Ajouter au Stock
                    </Button>
                  </Paper>
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: "50px",
                      padding: theme.spacing(2),
                      backgroundColor: colors.pinkAccent[500],
                      maxWidth: '400px',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: '50px',
                        margin: '10px 100px 10px 100px',
                      }}
                    />
                    <Typography variant="body1"> Vous avez deja rempli stock pour aujourd'hui!</Typography>
                    <Link to={`/stock/info/${stockExists}`}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#000000',
                          width: 300,
                          marginTop: 5,
                        }}
                        onClick={handleCreateStock}
                      >
                        Voir Stock
                      </Button>
                    </Link>
                    
                  </Paper>
                )}
              </div>
      
              {/* Commande Section */}
              <div style={{ flex: 1 }}>
                {commandeExists===null? (
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: "50px",
                      padding: theme.spacing(2),
                      backgroundColor: colors.primary[400],
                      maxWidth: '400px',
                    }}
                  >
                    <Typography variant="body1">
                      Vous n'avez pas créé une Commande pour aujourd'hui :{"("}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 5,
                        backgroundColor: colors.pinkAccent[400],
                      }}
                      onClick={handleCreateCommande}
                    >
                      Créer une commande
                    </Button>
                  </Paper>
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: "50px",
                      padding: theme.spacing(2),
                      backgroundColor: colors.pinkAccent[500],
                      maxWidth: '400px',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: '50px',
                        margin: '10px 100px 10px 100px',
                      }}
                    />
                    <Typography variant="body1"> Votre commande d'aujourd'hui est enregistrée.</Typography>
                    <Link to={`/commande/${commandeExists}`}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#000000',
                        width: 300,
                        marginTop: 5,
                      }}
                    >
                      Voir Commande
                    </Button>
                    </Link>
                    
                  </Paper>
                )}
              </div>
      
              {/* Pertes Section */}
              
            </Box>
          )}
      
      
    
            
      <Box height="75vh" sx={{
        background:colors.primary[500]
      }}>
        <Box 
          sx={{
            
            
            mt:3,
            display:'flex',
            gap:1,
            justifyContent:'center',
            marginRight:15,
            padding:1,
            borderRadius:1
          }}
        >
          <IconButton sx={{
            background:colors.primary[400],
            color:colors.primary[100],
            '&:hover':{
              background:colors.pinkAccent[400],
              color:colors.primary[100],
            },
            padding:1,
            borderRadius:3
          }}
          onClick={handleMonthDecrement}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Paper 
          variant="elevation"
          sx={{
            background:colors.primary[400],
            color:colors.primary[100],
            borderRadius:2,
            minWidth:80,
          }}
          >
            <Typography sx={{
              margin:2
            }}>
              {date}
            </Typography>
          </Paper>
          <IconButton sx={{
            background:colors.primary[400],
            color:colors.primary[100],
            '&:hover':{
              background:colors.pinkAccent[400],
              color:colors.primary[100],
            },
            borderRadius:3
          }}
          onClick={handleMonthIncrement}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <BarChart
        date={date}
        />
      </Box>
    </Box>

    );
    
    
}

export default Home;
