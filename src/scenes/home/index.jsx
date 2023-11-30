import { AuthContext } from "../../contexts/Auth";
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
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
    const id = authCtx.id
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
const [gridData, setGridData] = useState({});

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedPointDeVente, setSelectedPointDeVente] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [suiteData, setSuiteData] = useState([]);
  const [kiloData, setKiloData] = useState([]);
  const [fournitureData, setFournitureData] = useState([]);
  
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
 
  // Function to fetch filtered data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/commandes/filter', {
        params: {
          startDate,
          endDate,
          pointVenteId: selectedPointDeVente,
        },
      });
  console.log( response.data.data )
  const suiteData = response.data.data.filter(item => item.produit.type === 'SUITE' || item.type === 'SUITE');
  const kiloData = response.data.data.filter(item => item.produit.type === 'KG' || item.type === 'KG');
  const fournitureData = response.data.data.filter(item => item.produit.type === 'FOURNITURE' || item.type === 'FOURNITURE');
  
      const sumSuiteData = suiteData.reduce((result, orderItem) => {
        const existingItem = result.find(item => item.produitId === orderItem.produit.idProduit);
        if (existingItem) {
          existingItem.quantity += orderItem.quantity;
          existingItem.suiteCommande += orderItem.suiteCommande;
        } else {
          result.push({ ...orderItem, produitId: orderItem.produit.idProduit });
        }
        return result;
      }, []);
  
      const sumKiloData = kiloData.reduce((result, orderItem) => {
        const existingItem = result.find(item => item.produitId === orderItem.produit.idProduit);
        if (existingItem) {
          existingItem.quantity += orderItem.quantity;
         
        } else {
          result.push({ ...orderItem, produitId: orderItem.produit.idProduit });
        }
        return result;
      }, []);
  
      const sumFournitureData = fournitureData.reduce((result, orderItem) => {
        const existingItem = result.find(item => item.produitId === orderItem.produit.idProduit);
        if (existingItem) {
          existingItem.quantity += orderItem.quantity;
          
        } else {
          result.push({ ...orderItem, produitId: orderItem.produit.idProduit });
        }
        return result;
      }, []);
      console.log('Suite Data:', suiteData);
      console.log('Kilo Data:', kiloData);
      console.log('Fourniture Data:', fournitureData);
      
      setGridData({
        suiteData: sumSuiteData,
        kiloData: sumKiloData,
        fournitureData: sumFournitureData,
      });
      setSuiteData(sumSuiteData);
      setKiloData(sumKiloData);
      setFournitureData(sumFournitureData);
   
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  

  useEffect(() => {
    if (startDate && endDate && selectedPointDeVente) {
      fetchData();
    }
  }, [startDate, endDate, selectedPointDeVente]);

useEffect(() => {
  if (suiteData.length > 0) {
    const modifiedSuiteData = suiteData.map((row, index) => ({ ...row, gridId: index }));
    setSuiteData(modifiedSuiteData);
  }
  if (kiloData.length > 0) {
    const modifiedKiloData = kiloData.map((row, index) => ({ ...row, gridId: index }));
    setKiloData(modifiedKiloData);
  }
  if (fournitureData.length > 0) {
    const modifiedFournitureData = fournitureData.map((row, index) => ({ ...row, gridId: index }));
    setFournitureData(modifiedFournitureData);
  }
  }, [gridData.suiteData, gridData.kiloData, gridData.fournitureData]);

  





  // FILTERS
  const handleApplyFilters = () => {
    console.log('filteeeers' , gridData.data)
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
   
    const [commandeValide, setCommandeValide] = useState();

    

    
    
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
  

//
const checkCommande = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/commandes/check/${authCtx.id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', 
      }
    });

    console.log("Server Response:", response.data);

    const { hasCommande, isValidated } = response.data;

    console.log("Commande Exists:", hasCommande);
    console.log("All Validated:", isValidated);

    setCommandeExists(hasCommande);
    setCommandeValide(isValidated);

    if (hasCommande) {
      console.log("Commande is valid");
    }
    
  } catch (error) {
    console.error('Error fetching commandes:', error);
  }
};





const handleClick =async () => {
  if (stockExists) {
  try {
    
    const CommandeResponse = await axios.post('http://localhost:3000/api/v1/commandes',{
      idPointVente:parseInt(id),
    },{
      withCredentials: true,
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      }
    })
    const newCommandId = CommandeResponse.data.idCommande; // Assuming the ID property is named idCommande
    console.log(newCommandId);
    const FabricationResponse = await axios.put('http://localhost:3000/api/v1/fabrication',{
      idPointVente: id,
      nouvelleCommandeId: newCommandId
    },{
      withCredentials: true,
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      }
    })
    console.log(FabricationResponse.data)
    const ch = "Une Nouvelle Commande a été ajouter par "+authCtx.name;
    const not = await axios.post('http://localhost:3000/api/v1/notifications',{
      text:ch,
      target:  ["RESPONSABLE_LOGISTIQUE"] ,
    })
    navigate(`/ajouterCommande/${newCommandId}`);
  }
  catch(err) {
    console.log(err)
  }
 
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

      const kiloColumns = [
        {
          id: 1,
          field: 'produit.nomProduit',
          headerName: 'SPECIAL',
          flex: 0.5,
          cellClassName: 'name-column--cell',
          valueGetter: (params) => params.row.produit.nomProduit,
        },
        {
          id: 2,
          field: 'quantity',
          headerName: 'Kilo Quantity',
          flex: 0.5,
          cellClassName: 'name-column--cell',
        },
      ];
      
      const fournitureColumns = [
        {
          id: 1,
          field: 'produit.nomProduit',
          headerName: 'FOURNITURE',
          flex: 0.5,
          cellClassName: 'name-column--cell',
          valueGetter: (params) => params.row.produit.nomProduit,
        },
        {
          id: 2,
          field: 'quantity',
          headerName: 'Fourniture Quantity',
          flex: 0.5,
          cellClassName: 'name-column--cell',
        },
      ];
      
      const Columns = [
        {
          id: 1,
          field: 'produit.nomProduit',
          headerName: 'SUITE',
          flex: 0.5,
          cellClassName: 'name-column--cell',
          valueGetter: (params) => params.row.produit.nomProduit,
        },
        {
          id: 2,
          field: 'quantity',
          headerName: 'Quantity',
          flex: 0.5,
          cellClassName: 'name-column--cell',
        },
        
       
      ];
      

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
              {stockExists === null || commandeValide === true ?  (
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
                {(commandeExists === null || commandeValide) ?(
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
                      onClick={() => {
                        // handleCreateCommande();
                        handleClick();
                      }}
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

        {filtersApplied && gridData.data && (
  <Box
    m="40px"
    height="75vh"
    width="150vh"
    sx={{
      flexDirection: 'column',
      display: 'flex',
      gap: '50px',
      flexDirection: 'row',
      alignItems: 'center',
      margin: '80px',
      padding: '20px',
      "& .MuiDataGrid-root": {
        borderColor: colors.primary[400],
      },
      "& .MuiDataGrid-root": {
        borderColor: colors.primary[400],
      },
      "& .MuiDataGrid-cell": {
        borderColor: colors.primary[300],
      },
      "& .name-column--cell": {
        color: colors.greenAccent[300],
      },
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: colors.primary[400],
        borderBottom: "none",
      },
      "& .MuiDataGrid-virtualScroller": {
        backgroundColor: colors.primary[500],
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        backgroundColor: colors.primary[400],
      },
      "& .MuiCheckbox-root": {
        color: `${colors.greenAccent[200]} !important`,
      },
      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
        color: `${colors.grey[100]} !important`,
      },
    }}
  >
    {/* Suite Data Grid */}
    {suiteData.length > 0 && (
      <Box m="40px">
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Suite Data
        </Typography>
        <DataGrid
          density="comfortable"
          getRowId={(row) => row.idOrderItem}
          rows={suiteData}
          columns={Columns}
          pageSize={10}
          rowsPerPageOptions={[10, 15, 20]}
        />
      </Box>
    )}

    {/* Kilo Data Grid */}
    {kiloData.length > 0 && (
      <Box m="40px">
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Kilo Data
        </Typography>
        <DataGrid
          density="comfortable"
          getRowId={(row) => row.idOrderItem}
          rows={kiloData}
          columns={kiloColumns}
          pageSize={10}
          rowsPerPageOptions={[10, 15, 20]}
        />
      </Box>
    )}

    {/* Fourniture Data Grid */}
    {fournitureData.length > 0 && (
      <Box m="40px">
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Fourniture Data
        </Typography>
        <DataGrid
          density="comfortable"
          getRowId={(row) => row.idOrderItem}
          rows={fournitureData}
          columns={fournitureColumns}
          pageSize={10}
          rowsPerPageOptions={[10, 15, 20]}
        />
        </Box>
    )}

  </Box>
)}





  

        
      </Box>
     
  );  
};
export default Home;
