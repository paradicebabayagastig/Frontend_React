import { AuthContext } from "../../contexts/Auth";
import { DataGrid } from '@mui/x-data-grid'
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
import { Select, MenuItem } from '@mui/material';
import { Dropdown } from "reactstrap";


const Home = () => 

{   
    const authCtx = useContext(AuthContext)
    const token = authCtx.isAuthenticated;
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


    const [selectedDateRange, setSelectedDateRange] = useState(null);
    const [pdv,setPdv] = useState([]);
const [gridData, setGridData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedPointDeVente, setSelectedPointDeVente] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  
 
  
  //*** */
  const getPdv = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/pointsVentes', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      
      setPdv(response.data.map(pointDeVente => ({ id: pointDeVente.idPointVente, nomPointVente: pointDeVente.nomPointVente })));
    } catch (err) {
      console.error('Error fetching points de vente:', err);
    }
  };
  
  
  useEffect(() => {
    getPdv();
  }, []);

 ///////////
 
 const fetchData = async () => {
  try {
    
    console.log("Request :", { startDate, endDate, pointDeVente: selectedPointDeVente });
    const response = await axios.get('http://localhost:3000/api/v1/commandes/filter', {
      params: {
        startDate ,
        endDate ,
        pointVenteId: selectedPointDeVente,
      },
    });

    setGridData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  // FILTERS
  const handleApplyFilters = () => {
    fetchData();
    setFiltersApplied(true)
  };
    
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


    {/* Filters Section */}
    {/* {(role === 'admin') && ( */}
    <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            display: 'flex',
            gap: '50px',
            flexDirection: 'row',
            alignItems: 'center',
           
            margin: '80px',
            padding: '20px',
            backgroundColor: colors.pinkAccent[500],
            borderRadius: '10px',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            Filters
          </Typography>

          {/* Start Date */}
          <input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  style={{ marginRight: '10px' }}
/>


          {/* End Date */}
         <input
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
  style={{ marginRight: '10px' }}
/>


 {/* Point de Vente Dropdown */}
<Select
  value={selectedPointDeVente}
  onChange={(e) => setSelectedPointDeVente(e.target.value)}
  displayEmpty
>
  <MenuItem value="" disabled>
    Select Point de Vente
  </MenuItem>
  {pdv.map((pointDeVente) => (
    <MenuItem key={pointDeVente.id} value={pointDeVente.id}>
      {pointDeVente.nomPointVente}
    </MenuItem>
  ))}
</Select>



          {/* Button to apply filters */}
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
    
        {/* Data Grid Section */}
        {filtersApplied && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px',
            padding: '10px',
            backgroundColor: colors.pinkAccent[500],
            borderRadius: '10px',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            Data Grid
          </Typography>
          {/* Material-UI DataGrid */}
          <DataGrid
            rows={gridData}
            columns={[
              { field: 'id', headerName: 'ID', width: 90 },
            
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />

        </Box>
         )} 
         
        
      </Box>
     
  );  
};
export default Home;
