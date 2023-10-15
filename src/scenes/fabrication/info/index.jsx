import { Alert, Box, Chip, CircularProgress, Icon, IconButton, InputLabel, Select, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print'
import React from "react";

const FabricationInfo = () => {
   
      const params = useParams();
      const bonfabricationId = parseInt(params.id);
      const componentRef = React.useRef();
      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const role = authCtx.role
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        const [fournitureData,setFournitureData] = useState([]);
        const [kgData,setKgData] = useState([])
        // const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [bf,setBf] = useState({})
        const navigate = useNavigate();

        const message = ("Bon Fabrication ")

        async function fetchData() {
          try {
              const fabricationInfo = await axios.get(`http://localhost:3000/api/v1/fabrication/${bonfabricationId}`,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              })
              setBf(fabricationInfo.data)
          }
          catch (error) {
            console.log(error)
          }
        }
        
        async function fetchFabricationOrders() {
          try {
            const fabricationOrders = await axios.get(
              `http://localhost:3000/api/v1/fabItem/fabrication/${bonfabricationId}`,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
            );
        
            console.log('test:', fabricationOrders.data);
        
            const categorizedOrders = {};
        
            for (const fabOrder of fabricationOrders.data) {
              const type = fabOrder.type;
              const produitId = fabOrder.produitId;
        
              // Fetch product details
              const produitResponse = await axios.get(`http://localhost:3000/api/v1/produits/${produitId}`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
        
              const orderDetails = {
                index: fabricationOrders.data.indexOf(fabOrder) + 1,
                produit: produitResponse.data.nomProduit,
                totalBac: fabOrder.totalBac,
                totalSuite: fabOrder.totalSuite,
                pztPlaza: fabOrder.PztPlaza,
                pztAzur: fabOrder.PztAzur,
                pztSuitz: fabOrder.PztSuite,
                type: fabOrder.type,
                class: produitResponse.data.class
              };
        
              // Add the order details to the appropriate category
              if (!categorizedOrders[type]) {
                categorizedOrders[type] = [];
              }
              categorizedOrders[type].push(orderDetails);
            }
        
            // Now 'categorizedOrders' contains separate arrays for each type
            console.log('TEST SUITE', categorizedOrders.SUITE);
            console.log('TEST FOURNITURE', categorizedOrders.FOURNITURE);
            console.log('TEST KILO', categorizedOrders.KG);

        
            // You can set the data in your state based on the categories you need
            setData(categorizedOrders.SUITE); // Example: Set 'SUITE' category data to your state
            setFournitureData(categorizedOrders.FOURNITURE);
            setKgData(categorizedOrders.KG)
          } catch (error) {
            console.log(error);
          }
        }
        
        
        
          
        
  useEffect(()=>{
    
    fetchData()
    fetchFabricationOrders()
  },[])

  useEffect(()=>{
    
    console.log(bf)
  },[bf])



  const kiloColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 0.125,
    },
    {
      id:2,
      field: "class",
      headerName: <b>CLASS</b>,
      flex: 0.125,
      
    },
    {
      id:3,
      field: "totalBac",
      editable: true,
      headerName: <b>QTE</b>,
      flex: 0.125,
      
    },
    

  ]
  const fournitureColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>AUTRE BESOINS</b>,
      flex: 0.125,
    },
    {
      id:2,
      field: "totalBac",
      editable: true,
      headerName: <b>QTE</b>,
      flex: 0.125,
      
    }
  ]
  const columns = [
    {
      id:1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 0.25,
    },
    {
      id:2,
      field: "totalBac",
      editable: true,
      headerName: <b>TOTAL BACS</b>,
      flex: 0.25,
      cellClassName:"quantity-column--cell"
     
    },
    {
      id:3,
      field: "totalSuite",
      editable: true,
      headerName: <b>SUITE COMMANDE</b>,
      flex: 0.25,

    },
    {
      id:4,
      field: "pztPlaza",
      editable: true,
      headerName: <b>POZZETI PLAZA</b>,
      flex: 0.25,

    },
    {
      id:5,
      field:"pztAzur",
      editable: true,
      headerName:<b>POZZETI AZUR</b>,
      flex:0.25,
    },
    {
      id:6,
      field:"pztSuitz",
      editable: true,
      headerName:<b>POZZETI SUITE</b>,
      flex:0.25,
    }
    ];
  return (
    <Box m="20px" ref={componentRef}>
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
      <Box display="flex">
      <Header title={message} />
      <IconButton 
      onClick={handlePrint}
      sx={{
          marginLeft:'auto',
          "&:hover":{
            background:'FFFFFF',
            color: colors.pinkAccent[400]
          },
      }} >
        <PrintIcon />
      </IconButton>

        
      </Box>
      {
        (bf && bf.reference) && (
          <Box>
            <Box
            display="flex" 
            >
            <Typography>reference : </Typography><Typography sx={{color:colors.pinkAccent[400],ml:1}}>{bf.reference}</Typography>
            </Box>
            <Box
              display="flex" 
            >
              
            <Typography>date :</Typography> <Typography sx={{color:colors.pinkAccent[400],ml:1}}>{bf.dateFabrication.split('T')[0]}</Typography>
            </Box>
            
            
          </Box>
        )
      }
    
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          display:"flex",
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
            display:'block',
            '@media print' : {display : "none"}
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiCheckbox-root": {
            color: `${colors.pinkAccent[200]} !important`,
          },
          '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {display: 'none' }
        }}
      >
        {data && data.length>0? (
          <DataGrid
          editMode="row"
          rows={data}
          columns={columns}
          getRowId={(row)=>row.index}
          // components={{ Toolbar: GridToolbar }}
          hideScrollbarX // Hide horizontal scroll bar
          hideScrollbarY // Hide vertical scroll bar
          sx={{
            flex: 2.75
          }}
          />

        ) : (
          <DataGrid 
                rows={[]}
                columns={fournitureColumns}
                sx={{
                  flex: 1.75
                }}
                /> 
        )}
        {kgData && kgData.length>0? (
          <DataGrid
          editMode="row"
         rows={kgData}
         columns={kiloColumns}
         getRowId={(row)=>row.index}
         hideScrollbarX // Hide horizontal scroll bar
         hideScrollbarY // Hide vertical scroll bar
         sx={{
           flex: 2
         }}
         />
        ): (
          <DataGrid 
                rows={[]}
                columns={kiloColumns}
                sx={{
                  flex: 1.75
                }}
                />
        )}
         
        {
          (role === 'RESPONSABLE_LOGISTIQUE') && (
            (fournitureData && fournitureData.length>0?  <DataGrid
              editMode="row"
          rows={fournitureData}
          columns={fournitureColumns}
          getRowId={(row)=>row.index}
          hideScrollbarX = {true} // Hide horizontal scroll bar
          hideScrollbarY // Hide vertical scroll bar
          sx={{
            flex: 1.75
          }}
          /> :  <DataGrid 
                rows={[]}
                columns={fournitureColumns}
                sx={{
                  flex: 1.75
                }}
                /> )
           
          )
        }
          
      </Box>
      
    </Box>
);
};

export default FabricationInfo;
