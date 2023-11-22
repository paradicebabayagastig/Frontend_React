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
import CheckIcon from '@mui/icons-material/Check';

const FabricationEdit = () => {
   
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
        const [aggregatedData, setAggregatedData] = useState({
          FOURNITURE: [],
          KG: [],
          SUITE: [],
        });
        const [modifiedRows, setModifiedRows] = useState({});
        const handleFieldChange = (arrayType, index, field, newValue) => {
          // Parse the value to ensure it's a float
          const parsedValue = parseFloat(newValue);
        
          const updatedArray = [...aggregatedData[arrayType]];
          const modifiedRow = { ...updatedArray[index] };
          modifiedRow[field] = parsedValue;
        
          // Omit the "index" property from modifiedRow
          const modifiedRowWithoutIndex = Object.entries(modifiedRow)
            .filter(([key]) => key !== 'index')
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        
          setModifiedRows({
            ...modifiedRows,
            [arrayType]: {
              ...modifiedRows[arrayType],
              [index]: modifiedRowWithoutIndex,
            },
          });
        
          updatedArray[index] = modifiedRow;
          setAggregatedData({
            ...aggregatedData,
            [arrayType]: updatedArray,
          });
        };
        const handleSubmit = async () => {
          try {
            console.log(modifiedRows)
              const orderTypes = Object.keys(modifiedRows);
              const patchRequests = []; // Store the patch request promises
      
              for (const type of orderTypes) {
                  const orderObjects = modifiedRows[type];
                  const orderIndices = Object.keys(orderObjects);
      
                  for (const index of orderIndices) {
                      const order = orderObjects[index];
                      const patchPromise = axios.patch(
                          `http://localhost:3000/api/v1/fabItem/${order.idFabItem}`,
                          {
                            PztFabricated:order.pztFabricated,
                            fabricated:order.fabricated
                          },
                          {
                              withCredentials: true,
                              headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                              }
                          }
                      );
                      patchRequests.push(patchPromise);
                  }
              }
      
              // Await all patch requests and navigate after completion
              await Promise.all(patchRequests);
              navigate(`/fabrication/info/${bonfabricationId}`)
              // Navigate to another page here
              // For example, if using React Router:
              // history.push('/next-page'); // Make sure to have the 'history' object available
          } catch (error) {
              console.error("Error updating orders:", error);
          }
      };
          

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

        async function fetchData2() {
          try {
            // Initialize categorized orders
            const categorizedOrders = {
              FOURNITURE: {},
              KG: {},
              SUITE: {},
            };
        
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
                const index = { FOURNITURE: 0, KG: 0, SUITE: 0 }; // Initialize indices for each category   
                for (const order of fabricationOrders.data) {
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
        
                  const key = `${index[type]}`;
        
                  if (!categorizedOrders[type][key]) {
                    categorizedOrders[type][key] = {
                      // index: index[type],
                      // idOrderItem: order.idOrderItem,
                      // produit: produitResponse.data.nomProduit,
                      // class: produitResponse.data.class,
                      // type: produitResponse.data.type,
                      // unite: order.unite,
                      // ecart:order.ecart,
                      // QteLivre:order.QteLivre,
                      // feedback:order.feedback,
                      // quantity: order.quantity,
                      // suiteC: order.suiteCommande,
                      idFabItem: order.idFabItem,
                      index: index[type],
                      produit: produitResponse.data.nomProduit,
                      totalBac: order.totalBac,
                      totalSuite: order.totalSuite,
                      pztPlaza: order.PztPlaza,
                      pztAzur: order.PztAzur,
                      pztSuitz: order.PztSuite,
                      fabricated: order.fabricated,
                      pztFabricated: order.PztFabricated,
                      qteSpecial: order.QteSpecial,
                      type: order.type,
                      class: produitResponse.data.class
                      
                    };
                    index[type]++
                  }
                }
              
            
        
            // Convert categorized orders into arrays
            const aggregatedQuantities = {
              FOURNITURE: Object.values(categorizedOrders.FOURNITURE),
              KG: Object.values(categorizedOrders.KG),
              SUITE: Object.values(categorizedOrders.SUITE),
            };
            setAggregatedData(aggregatedQuantities)
          } catch (err) {
            console.log(err);
          }
        }
        
        
         
  useEffect(()=>{
    
    fetchData()
    fetchData2()
  },[])

 useEffect(()=>{
    
  console.log(aggregatedData)
  },[aggregatedData])


  const kiloColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>SPECIAL</b>,
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
       
      headerName: <b>QTE</b>,
      flex: 0.125,
      
    },
    {
      id:4,
      field: "qteSpecial",
       
      headerName: <b>QTE en KG</b>,
      flex: 0.125,
      
    },
    {
      id:3, 
      field: "fabricated",
       
      headerName: <b>QTE FABRIQUE</b>,
      flex: 0.125,
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(aggregatedData.KG[params.row.index]?.fabricated ?? 0)}
              onChange={(e) => handleFieldChange('KG',params.row.index,'fabricated', e.target.value)}
              variant="outlined"
              sx={{
                width: 85,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
      )
      
    },

    

  ]
  const fournitureColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>FOURNITURES</b>,
      flex: 0.125,
    },
    {
      id:2,
      field: "totalBac",
       
      headerName: <b>QTE</b>,
      flex: 0.125,
      
    }
  ]
  const columns = [
    {
      id:1,
      field: "produit",
      headerName: <b>GLACE  </b>,
      flex: 0.25,
    },
    {
      id:2,
      field: "totalBac",
       
      headerName: <b>TOTAL BACS</b>,
      flex: 0.25,
      cellClassName:"quantity-column--cell"
     
    },
    {
      id:3,
      field: "totalSuite",
       
      headerName: <b>SUITE COMMANDE</b>,
      flex: 0.25,

    },
    {
      id:4,
      field: "pztPlaza",
       
      headerName: <b>POZZETI PLAZA</b>,
      flex: 0.25,

    },
    {
      id:5,
      field:"pztAzur",
       
      headerName:<b>POZZETI AZUR</b>,
      flex:0.25,
    },
    {
      id:6,
      field:"pztSuitz",
       
      headerName:<b>POZZETI SUITE</b>,
      flex:0.25,
    },
    {
      id:6,
      field:"fabricated",
       
      headerName:<b>QTE FABRIQUE</b>,
      flex:0.25,
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(aggregatedData.SUITE[params.row.index]?.fabricated ?? 0)}
              onChange={(e) => handleFieldChange('SUITE',params.row.index,'fabricated', e.target.value)}
              variant="outlined"
              sx={{
                width: 85,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
      )
    },
    {
      id:6,
      field:"pztFabricated",
      
      headerName:<b>POZZETI FABRIQUE</b>,
      flex:0.25,
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(aggregatedData.SUITE[params.row.index]?.pztFabricated ?? 0)}
              onChange={(e) => handleFieldChange('SUITE',params.row.index,'pztFabricated', e.target.value)}
              variant="outlined"
              sx={{
                width: 85,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
      )
    },
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
      <Box display="flex" justifyContent='space-between'>
      <Header title={message} />
      <Button
        onClick={handleSubmit} 
        sx={{
          color:colors.primary[100],
          marginRight:5,
          backgroundColor:colors.primary[400],
          display:"flex",
          justifyContent:"center",
          marginRight:5,
          marginBottom:5,
          gap:1.5,
          "&:hover":{
            backgroundColor:colors.pinkAccent[400]
          }
        }}>
         
          <Typography>
          <b>Enregistrer</b>
          </Typography>
          <Icon sx={{
            marginBottom:1.5
          }}>
            <CheckIcon />
          </Icon>
          </Button>

        
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
        height="150vh"
        display='flex'
        flexDirection='column'
        gap={5}
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
        
          <DataGrid
          rows={aggregatedData.SUITE}
          columns={columns}
          getRowId={(row)=>row.index}
          // components={{ Toolbar: GridToolbar }}
          hideScrollbarX // Hide horizontal scroll bar
          hideScrollbarY // Hide vertical scroll bar
          />
          

        
      
        
       
          <DataGrid
         rows={aggregatedData.KG}
         columns={kiloColumns}
         getRowId={(row)=>row.index}
         hideScrollbarX // Hide horizontal scroll bar
         hideScrollbarY // Hide vertical scroll bar
         />
      
        
         
        {
          (role === 'RESPONSABLE_LOGISTIQUE') && (
           <DataGrid
          rows={aggregatedData.FOURNITURE}
          columns={fournitureColumns}
          getRowId={(row)=>row.index}
          hideScrollbarX = {true} // Hide horizontal scroll bar
          hideScrollbarY // Hide vertical scroll bar
          />
           
          )
        }
          
      </Box>
      
    </Box>
);
};

export default FabricationEdit;
