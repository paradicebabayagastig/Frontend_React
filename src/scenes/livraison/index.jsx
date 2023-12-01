import { Box, Checkbox, FormControlLabel, Icon, IconButton, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import React from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
const Invoices = () => {
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const role = authCtx.role
  const id = authCtx.id
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data,setData] = useState([]); 

 
  




 // for the soorttt arrow 
 const [sortModel, setSortModel] = React.useState([{ field: 'dateCommande', sort: 'desc' }]);
 const handleSortModelChange = (newModel) => {
   setSortModel(newModel);
 };

  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);

 //selected rows for delete all
 const [selectedRows, setSelectedRows] = useState([]);
const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);


const handleSelectionChange = (newSelection) => {
  console.log('New selection aaa:', newSelection);
  setSelectedRows(newSelection);

  setIsAnyRowSelected(newSelection.length > 0);

  console.log('Current 11:', newSelection);
  console.log('Current 22:', newSelection.length > 0);
};


// delete bon livraison by makinng livraison false and removing the row 
const handleDelete = async (idCommande) => {
  console.log(' idCommande:', idCommande);

  try {
    await axios.patch(`http://localhost:3000/api/v1/commandes/delete/${idCommande}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
// remove it 
    setData((prevData) => prevData.filter((row) => {
      if (row.idCommande === idCommande) {
        return false; 
      }
      return true;
    }));

    console.log('deleted successfully.');
  } catch (error) {
    console.error('Error deletingg:', error);
    console.log('Server response:', error.response);
  }
};

// delete all 
const handleDeleteAll = async () => {
  console.log('isAnyRowSelected:', isAnyRowSelected);
  console.log('selectedRows:', selectedRows);

  if (!isAnyRowSelected) {
    console.log('No rows selected.');
    return;
  }

  try {
    
    console.log('IDs:', selectedRows);
    await axios.patch(
      'http://localhost:3000/api/v1/commandes/deleteAll',
      { ids: selectedRows }, 
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    setData((prevData) => prevData.filter((row) => !selectedRows.includes(row.idCommande)));

    console.log('Rows deleted successfully.');

    setSelectedRows([]);
    setIsAnyRowSelected(false);
    setIsDeleteButtonVisible(false); 
  } catch (error) {
    console.error('Error delete all:', error);
  }
};


  //indication change if viewed
  const handleViewBon = async (commandId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/commandes/stateBon/${commandId}`,
        {
          stateBonLivraison: 'seen',
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
  
  

  const handleChange = async (idCommande) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/commandes/validation/${idCommande}`,{
        withCredentials:true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        
      })
      console.log('response :',response.data)
      setData(prevData => {
        return prevData.map(item => {
          if (item.idCommande === idCommande) {
            return {
              ...item,
              validationReception: true
            };
          }
          return item;
        });
      });
    }
    catch (error) {
      console.log(error)
    }
 
  }
  console.log()
  const columns = [
    {
      id:1,
      field: "reference",
      headerName: "reference",
      flex: 0.5,
      sortable: false,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "point",
      headerName: "Point de vente",
      flex: 0.5,
      sortable: false,
      cellClassName:"point-column--cell"
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date Commande",
      flex: 0.25,
      renderCell: (params) => <Typography>{params.row.dateCommande.toLocaleDateString()}</Typography>,
    },
    {
      id:4,
      field: "dateLivraison",
      headerName: "Date Livraison",
      flex: 0.25,
    },
   
   
    {
      id: 5,
      headerName: "Validation Reception",
      flex: 0.25,
      cellClassName: "point-column--cell",
      renderCell: (params) => (
        <Box display="flex" gap={0.25} alignItems="center">
          {role === 'POINT_DE_VENTE' ? (
            
            <FormControlLabel
              sx={{
                color: colors.pinkAccent[400],
              }}
              control={
                <Checkbox
                  name="loading"
                  checked={params.row.validationReception}
                  onChange={() => handleChange(params.row.idCommande)}
                  color="default"
                  sx={{
                    color: colors.pinkAccent[200],
                  }}
                  disabled={params.row.validationReception}
                />
              }
            />
          ) : (
            
            params.row.validationReception ? (
              <Icon>
                <ThumbUpAltIcon />
              </Icon>
            ) : (
              <Icon>
                <CloseIcon />
              </Icon>
            )
          )}
        </Box>
      ),
    },


    {
      id:6,
      field: "Action",
      headerName: "Action",
      flex: 0.25,
      renderCell: (params) => 
        <Box
       
        
        >
          <Link to={`/livraison/info/${params.row.idCommande}`}>

          <IconButton
          variant="outlined"
          sx={{
            backgroundColor:colors.primary[400],
            color:colors.primary[100],
            "&:hover": {
              backgroundColor: colors.button[100], // Change background color on hover
              color: colors.button[200], // Change text color on hover
            },
          }}
          onClick={() => {
            if (role === 'POINT_DE_VENTE') {
              handleViewBon(params.row.idCommande);
            }
          }}
          >

              <RemoveRedEyeIcon />

          </IconButton>


          </Link>
          <Link>
          {role === 'RESPONSABLE_LOGISTIQUE' && (
          <IconButton
          variant="outlined"
          sx={{
            marginLeft:2,
          backgroundColor:colors.primary[400],
          color:colors.primary[100],
          "&:hover": {
            backgroundColor: colors.button[100], // Change background color on hover
            color: colors.button[200], // Change text color on hover
          },
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
           
            handleDelete(params.row.idCommande);
          }}
          >

            <DeleteIcon />

          </IconButton>
          )}
          {role === 'POINT_DE_VENTE' && (
          <Box
  sx={{
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: (() => {
      if (params.row.stateBonLivraison === 'new') {
        return 'green';
      } else if (params.row.stateBonLivraison === 'updated') {
        return 'red'; 
      } else {
        return 'grey'; 
      }
    })(),
    marginLeft: '5px',
    display: 'inline-block',
  }}
> </Box> )}


          </Link>
        </Box>
      
    },
  

  ];

  async function fetchData() {
    try {
      // Fetch all commandes
      const commandesResponse = await axios.get("http://localhost:3000/api/v1/commandes", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      const commandes = commandesResponse.data;
      console.log("commandes : ",commandes)
      const filteredCommandes = role === 'POINT_DE_VENTE'
      ? commandes.filter(item => item.livraison === true && item.idPointVente === id)
      : commandes.filter(item => item.livraison === true);
      const ordersWithDetails = await Promise.all(filteredCommandes.map(async (commande) => {
        // Fetch the first bon commande for each commande
        const bonCommandeResponse = await axios.get(`http://localhost:3000/api/v1/bons-commandes/commande/${commande.idCommande}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const firstBonCommande = bonCommandeResponse.data[0];
  
        // Fetch user data by ID
        const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${commande.idPointVente}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const dateCommande = new Date(commande.dateCommande);
        const dateLivraison = firstBonCommande? firstBonCommande.dateLivraison.split('T')[0]:'undefined';
  
        // Create the object with the required properties
        const orderWithDetails = {
          idCommande: commande.idCommande,
          reference: commande.refBL,
          dateCommande,
          dateLivraison,
          point: userResponse.data.nomUtilisateur,
          validationReception: commande.validationReception,
          stateBonLivraison: commande.stateBonLivraison
        };
  
        return orderWithDetails;
      }));
  
      console.log('Orders with details:', ordersWithDetails);
      const ordersWithDetailss = ordersWithDetails.sort((a, b) => b.dateCommande - a.dateCommande);
      setData(ordersWithDetailss)
      // You can return the data or do something else with it
      return ordersWithDetails;
    } catch (err) {
      console.log('error : ',err);
      
      
    }
  }
  
  useEffect(()=>{
    fetchData()
  },[])

  useEffect(() => {
    console.log('data',data)
  },[data])

  
  
  return (
    <Box m="20px">
      <Box 
      display="flex"  justifyContent='space-between'
      >
            <Header title="Bons de Livraison"  />
            
 {/* Delete All */}
 {(role === 'RESPONSABLE_LOGISTIQUE') && (
         <Button
         sx={{
           color: colors.pinkAccent[400],
           background: colors.primary[400],
           marginRight: 5,
           border: 1,
           borderColor: colors.primary[400],
           "&:hover": {
             borderColor: colors.pinkAccent[400],
             color: colors.pinkAccent[400],
             background: colors.primary[500],
           },
         }}
         onClick={() => {
           
           handleDeleteAll();
         }}
       >
         <DeleteIcon />
         Supprimer Tout
       </Button>
       
        )}


      </Box>
      
      <Box
        
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            // border: "none",
            borderColor: colors.primary[400]
          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.primary[300],
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .point-column--cell": {
            color: colors.pinkAccent[400],
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
         <DataGrid
      density="comfortable"
      rows={data}
      getRowId={(row) => row.idCommande}
      columns={columns}
      checkboxSelection
      onSelectionModelChange={handleSelectionChange}
      components={{ Toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      sortingOrder={['asc', 'desc']}
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
    />


      </Box>
    </Box>
  );
};

export default Invoices;