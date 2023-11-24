import { Alert, Box, CircularProgress, Icon, InputLabel, Select, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const LivraisonEdit = () => {
   
      const params = useParams();
      const commandeId = parseInt(params.id);
      const navigate = useNavigate();
        const authCtx = useContext(AuthContext)
        const role = authCtx.role
        console.log('role:',role)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [aggregatedData, setAggregatedData] = useState({
          FOURNITURE: [],
          KG: [],
          SUITE: [],
        });
        const [modifiedRows, setModifiedRows] = useState({});
        const [loading, setLoading] = useState(true);

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
        
           
  //indication change if bon livraison updated
  const handleUpdateBon = async (commandId) => {
    console.log('reeeeddddd' ,commandId )
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/commandes/${commandId}/stateBon`,
        {
          stateBonLivraison: 'updated',
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Update successful.');
    } catch (error) {
      console.error(error);
    }
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
                        `http://localhost:3000/api/v1/orderItem/${order.idOrderItem}`,
                        {
                          ecart:order.ecart,
                          QteLivre:order.QteLivre,
                          feedback:order.feedback
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
            navigate(`/livraison/info/${commandeId}`)
            // Navigate to another page here
            // For example, if using React Router:
            // history.push('/next-page'); // Make sure to have the 'history' object available
        } catch (error) {
            console.error("Error updating orders:", error);
        }
    };
    
        const message = ("Information commande")
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
                const index = { FOURNITURE: 0, KG: 0, SUITE: 0 }; // Initialize indices for each category   
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
        
                  const key = `${index[type]}`;
        
                  if (!categorizedOrders[type][key]) {
                    categorizedOrders[type][key] = {
                      index: index[type],
                      idOrderItem: order.idOrderItem,
                      produit: produitResponse.data.nomProduit,
                      class: produitResponse.data.class,
                      type: produitResponse.data.type,
                      unite: order.unite,
                      ecart:order.ecart,
                      QteLivre:order.QteLivre,
                      feedback:order.feedback,
                      quantity: order.quantity,
                      suiteC: order.suiteCommande,
                      
                    };
                    index[type]++
                  }
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
      id:3,
      field: "suiteC",
      headerName: <b>SUITE C</b>,
      flex: 0.5,
      cellClassName:"quantity-column--cell"

    },
    {
      id:4,
      field: "QteLivre",
      headerName: <b>QTE LIVRAISON</b>,
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        display='flex'
        alignItems='center'
        sx={{ height: 50 }}>
        { (role === 'POINT_DE_VENTE')?
            (
          <Typography>
            {aggregatedData.SUITE[params.row.index]?.QteLivre ?? 0}
          </Typography>
            ):
            (
            <TextField
              type="number"
              value={parseFloat(aggregatedData.SUITE[params.row.index]?.QteLivre ?? 0)}
              onChange={(e) => handleFieldChange('SUITE',params.row.index,'QteLivre', e.target.value)}
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
            />)}
      </Box>
        )

    },
    {
      id:5,
      field: "ecart",
      headerName: <b>ECART</b>,
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        display='flex'
        alignItems='center'
        sx={{ height: 50 }}>
        { (role === 'POINT_DE_VENTE')?
        (
        <Typography>
          {aggregatedData.SUITE[params.row.index]?.ecart ?? 0}
        </Typography>
        ):(
            <TextField
              type="number"
              value={parseFloat(aggregatedData.SUITE[params.row.index]?.ecart ?? 0)}
              onChange={(e) => handleFieldChange('SUITE',params.row.index,'ecart', e.target.value)}
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
      field: "feedback",
      headerName: <b>FEEDBACK</b>,
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        display='flex'
        alignItems='center'
        sx={{ height: 50 }}>
        { (role === 'POINT_DE_VENTE')?
        (
          <TextField
            type="number"
            value={parseFloat(aggregatedData.SUITE[params.row.index]?.feedback ?? 0)}
            onChange={(e) => handleFieldChange('SUITE',params.row.index,'feedback', e.target.value)}
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
   
      ):(
        <Typography>
          {aggregatedData.SUITE[params.row.index]?.feedback ?? 0}
        </Typography>
        ) }
      </Box>
        )

    },

    ];
    const Kolumns = [
      {
        id:1,
        field: "produit",
        headerName: <b>PRODUIT</b>,
        flex: 1,
        cellClassName:"quantity-column--cell"
      },
      {
        id:2,
        field: "quantity",
        headerName: <b>QTE</b>,
        flex: 0.5,
        cellClassName:"quantity-column--cell"
       
      },
      {
        id:3,
        field: "QteLivre",
        headerName: <b>QTE LIVRAISON</b>,
        flex: 0.5,
        renderCell: (params) => (
          <Box sx={{ height: 50 }}>
          { (
           
              <TextField
                type="number"
                value={parseFloat(aggregatedData.KG[params.row.index]?.QteLivre ?? 0)}
                onChange={(e) => handleFieldChange('KG',params.row.index,'QteLivre', e.target.value)}
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
        id:4,
        field: "ecart",
        headerName: <b>ECART</b>,
        flex: 0.5,
        renderCell: (params) => (
          <Box sx={{ height: 50 }}>
          { (
           
              <TextField
                type="number"
                value={parseFloat(aggregatedData.KG[params.row.index]?.ecart ?? 0)}
                onChange={(e) => handleFieldChange('KG',params.row.index,'ecart', e.target.value)}
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
        id:5,
        field: "feedback",
        headerName: <b>FEEDBACK</b>,
        flex: 0.5,
        cellClassName:"quantity-column--cell"
  
      },
      ];
      const Folumns = [
        {
          id:1,
          field: "produit",
          headerName: <b>PRODUIT</b>,
          flex: 1,
          cellClassName:"quantity-column--cell"
        },
        {
          id:2,
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
        {
          id:4,
          field: "QteLivre",
          headerName: <b>QTE LIVRAISON</b>,
          flex: 0.5,
          renderCell: (params) => (
            <Box sx={{ height: 50 }}>
            { (
             
                <TextField
                  type="number"
                  value={parseFloat(aggregatedData.FOURNITURE[params.row.index]?.QteLivre ?? 0)}
                  onChange={(e) => handleFieldChange('FOURNITURE',params.row.index,'QteLivre', e.target.value)}
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
          id:5,
          field: "feedback",
          headerName: <b>FEEDBACK</b>,
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
      <Box
      display="flex"
      justifyContent="space-between"
      >
        <Header title={message}  />
        <Button
      onClick={() => {
        handleSubmit();
        if (role === 'RESPONSABLE_LOGISTIQUE') {
          handleUpdateBon(commandeId);
        }
      }}
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
        editMode="row"
        rows={aggregatedData.SUITE}
        columns={columns}
        getRowId={(row)=>row.idOrderItem}
        components={{ Toolbar: GridToolbar }}
        />
         <DataGrid
        editMode="row"
        rows={aggregatedData.KG}
        columns={Kolumns}
        getRowId={(row)=>row.idOrderItem}
        components={{ Toolbar: GridToolbar }}
        />
         <DataGrid
        rows={aggregatedData.FOURNITURE}
        columns={Folumns}
        getRowId={(row)=>row.idOrderItem}
        components={{ Toolbar: GridToolbar }}
        editMode="row"
        />
      </Box>
    </Box>
);
};

export default LivraisonEdit;