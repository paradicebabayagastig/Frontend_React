import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const LivraisonInfo = () => {
   
      const params = useParams();
      const commandeId = parseInt(params.id);
      console.log(commandeId);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        // const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [redirect, setRedirect] = useState(false);
        const [allgood,setAllgood] = useState(true)
        const navigate = useNavigate();

        const message = ("Information bon livraison n°"+ commandeId )
        async function fetchData() {
          try {
            const bcResponse = await axios.get(`http://localhost:3000/api/v1/bons-commandes/commande/${commandeId}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            })
            const orders = await Promise.all(bcResponse.data.map(async (bonCommande) => {
              const response = await axios.get(`http://localhost:3000/api/v1/orderItem/bonCommande/${bonCommande.idBonCommande}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            const initialQuantities = await Promise.all(response.data.map( async (orderItem) => {
              const produitResponse = await axios.get(`http://localhost:3000/api/v1/produits/${orderItem.produitId}`,{
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                } )
              const order = {
              orderItemId: orderItem.idOrderItem,
              produit: produitResponse.data.nomProduit,
              class:produitResponse.data.class,
              type:produitResponse.data.type,
              quantity: orderItem.quantity,
              suiteCommande:orderItem.suiteCommande,
              ecart:orderItem.ecart,
              QteLivre:orderItem.QteLivre,
              feedback:orderItem.feedback,
              unite: orderItem.unite
              };
              return order
            }))
            return initialQuantities  
            }));  
            const flattenedOrders = orders.flatMap((orderArray) => orderArray);  
            console.log("response : ",flattenedOrders)
            console.log("initial quantities:", flattenedOrders);
            setData(flattenedOrders);
          }
       
          catch(err) {
            console.log(err)
          }
        }

        
  useEffect(()=>{
    
    fetchData()
  },[])
  useEffect(() => {
    console.log("data changed! :",data);
  
  }, [data]);

  useEffect(() => {
    if (success) {
      setLoading(false); // Turn off loading once successful
      setTimeout(() => {
        setRedirect(true); // After 2 seconds, set redirect to true
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (redirect) {
      navigate('/commande');
    }
  }, [redirect, navigate]);
  const columns = [
   
    {
      id:2,
      field: "produit",
      headerName: "produit",
      flex: 1,
    },
    {
      id:3,
      field: "quantity",
      headerName: "quantity",
      flex: 1,
      cellClassName:"quantity-column--cell"
     
    },
    {
      id:4,
      field: "suiteCommande",
      headerName: "suiteC",
      flex: 1,

    },
    {
      id:8,
      field: "ecart",
      headerName: "ecart",
      flex: 1,

    },
    {
      id:5,
      field:"QteLivre",
      headerName:"QteLivre",
      flex:1,
    }, 
    {
      id:6,
      field: "feedback",
      headerName: "feedback",
      flex: 1,

    },  
    {
      id:7,
      field: "class",
      headerName: "class",
      flex: 1,
      renderCell: (params) => {
        <Box 
        sx={{
          display:"flex",
          gap:2
        }}
        >
          <Typography>zeb</Typography>
          <Typography>zeb2</Typography>
        </Box>
      } 

    },
   
    ];
  
  return (
    <Box m="20px">
      {loading && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          display: loading ? 'flex' : 'none', // Conditional display
        }}>
          <CircularProgress 
          color="secondary" // Change the color (primary, secondary, error, etc.)
          size={60} // Change the size (in pixels)
          thickness={5} // Change the thickness of the circle (in pixels)
          />
        </Box>
      ) }
      <Header title={message}  />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400],
          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.primary[300],
          },
          "& .quantity-column--cell": {
            color: colors.pinkAccent[300],
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiCheckbox-root": {
            color: `${colors.pinkAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row)=>row.orderItemId}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Snackbar open={success} autoHideDuration={2000}>
        <Alert sx={{
          position: 'fixed',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}  severity="success">Operation Successful! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
};

export default LivraisonInfo;
