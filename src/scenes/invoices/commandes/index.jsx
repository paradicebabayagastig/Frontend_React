import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const CommandeInfo = () => {
   
      const params = useParams();
      const commandeId = parseInt(params.id);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [aggregatedData, setAggregatedData] = useState({
          FOURNITURE: [],
          KG: [],
          SUITE: [],
        });
        // const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();

        const message = ("Information commande n°"+ commandeId )
        async function fetchData() {
          try {
            const bonCommandeResponse = await axios.get(
              `http://localhost:3000/api/v1/bons-commandes/commande/${commandeId}`,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
            );
        
            // Initialize categorized orders
            const categorizedOrders = {
              FOURNITURE: {},
              KG: {},
              SUITE: {},
            };
        
            await Promise.all(
              bonCommandeResponse.data.map(async (bonCommande) => {
                const orderItemsResponse = await axios.get(
                  `http://localhost:3000/api/v1/orderItem/bonCommande/${bonCommande.idBonCommande}`,
                  {
                    withCredentials: true,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  }
                );
        
                for (const order of orderItemsResponse.data) {
                  const type = order.type;
                  const produitResponse = await axios.get(
                    `http://localhost:3000/api/v1/produits/${order.produitId}`,
                    {
                      withCredentials: true,
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      }
                    }
                  );
        
                  const key = `${produitResponse.data.nomProduit}-${order.unite}`;
        
                  if (!categorizedOrders[type][key]) {
                    categorizedOrders[type][key] = {
                      id: order.idOrderItem,
                      produit: produitResponse.data.nomProduit,
                      class: produitResponse.data.class,
                      type: produitResponse.data.type,
                      unite: order.unite,
                      quantity: 0,
                      suiteC: 0,
                    };
                  }
        
                  categorizedOrders[type][key].quantity += order.quantity;
                  categorizedOrders[type][key].suiteC += order.suiteCommande;
                }
              })
            );
        
            // Convert categorized orders into arrays
            const aggregatedQuantities = {
              FOURNITURE: Object.values(categorizedOrders.FOURNITURE),
              KG: Object.values(categorizedOrders.KG),
              SUITE: Object.values(categorizedOrders.SUITE),
            };
        
            console.log("Aggregated quantities for FOURNITURE:", aggregatedQuantities.FOURNITURE);
            
            console.log("Aggregated quantities for KG:", aggregatedQuantities.KG);
            console.log("Aggregated quantities for SUITE:", aggregatedQuantities.SUITE);
            setAggregatedData(aggregatedQuantities)
          } catch (err) {
            console.log(err);
          }
        }
        
          
        
  useEffect(()=>{
    
    fetchData()
  },[])


  useEffect(() => {
    console.log("data changed! :",aggregatedData);
    setLoading(false)
  }, [aggregatedData]);
  const columns = [
    {
      id:2,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
      cellClassName:"quantity-column--cell"
    },
    {
      id:3,
      field: "quantity",
      headerName: <b>QTE</b>,
      flex: 0.5,
      cellClassName:"quantity-column--cell"
     
    },
    {
      id:4,
      field: "suiteC",
      headerName: <b>SUITE C</b>,
      flex: 0.5,
      cellClassName:"quantity-column--cell"

    }
    ];
    const Folumns = [
      {
        id:2,
        field: "produit",
        headerName: <b>PRODUIT</b>,
        flex: 1,
        cellClassName:"quantity-column--cell"
      },
      {
        id:3,
        field: "quantity",
        headerName: <b>QTE</b>,
        flex: 0.5,
        cellClassName:"quantity-column--cell"
       
      },
      ];
      const Kolumns = [
        {
          id:2,
          field: "produit",
          headerName: <b>PRODUIT</b>,
          flex: 1,
          cellClassName:"quantity-column--cell"
        },
        {
          id:3,
          field: "quantity",
          headerName: <b>QTE</b>,
          flex: 0.5,
          cellClassName:"quantity-column--cell"
         
        },
        {
          id:3,
          field: "unite",
          headerName: <b>UNITE</b>,
          flex: 0.5,
          cellClassName:"quantity-column--cell"
         
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
          display:"flex"
        }}
      >
        <DataGrid
        
        rows={aggregatedData.SUITE}
        columns={columns}
        getRowId={(row)=>row.id}
        components={{ Toolbar: GridToolbar }}
        />
         <DataGrid
        
        rows={aggregatedData.KG}
        columns={Folumns}
        getRowId={(row)=>row.id}
        components={{ Toolbar: GridToolbar }}
        />
         <DataGrid
       edit
        rows={aggregatedData.FOURNITURE}
        columns={Kolumns}
        getRowId={(row)=>row.id}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
);
};

export default CommandeInfo;
