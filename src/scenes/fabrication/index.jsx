import { Box, Checkbox, FormControlLabel, IconButton, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import React from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const BonFabrications = () => {
  const authCtx = useContext(AuthContext)
  const role = authCtx.role
  const id = authCtx.id
  const token = authCtx.isAuthenticated
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data,setData] = useState([]); 
  const [selectedRows, setSelectedRows] = useState([]);

// for the soorttt arrow 
const [sortModel, setSortModel] = React.useState([{ field: 'dateCommande', sort: 'desc' }]);
const handleSortModelChange = (newModel) => {
  setSortModel(newModel);
};

 //state bon fab
 const handleViewBonFab = async (idFabrication) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/v1/fabrication/${idFabrication}/state`,
      {
        state: 'seen',
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    setData((prevData) =>
      prevData.map((item) =>
        item.idFabrication === idFabrication
          ? { ...item, state: 'seen' }
          : item
      )
    );

    console.log('Fabrication state updated successfully.');
  } catch (error) {
    console.error(error);
  }
};

//deleete
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/v1/fabrication/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    setData((prevData) => prevData.filter((row) => row.idFabrication !== id));
    console.log('Row deleted successfully.');
  } catch (error) {
    console.error('Error deleting row:', error);
  }
};

//
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log('Selected Rows:', newSelection.map((id) => data.find((row) => row.idBonLivraison === id)));
  };
  const handleSwitchChange = async (fabricationId) => {
    try {
        updateFabrication(fabricationId)
      
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };
  async function updateFabrication(fabricationId) {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/fabrication/valider-fabrication/${fabricationId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Fabrication updated successfully.');
      setData(prevData => {
        return prevData.map(item => {
          if (item.idFabrication === fabricationId) {
            return {
              ...item,
              isValid: true
            };
          }
          return item;
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
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
      field: "date",
      headerName: "date",
      flex: 0.5,
      renderCell: (params) => <Typography>{params.row.date.toLocaleDateString()}</Typography>,
      cellClassName: "name-column--cell",
      
    },
    {
      id:3,
      field: "chef",
      headerName: "Chef Glacier",
      sortable: false,
      flex: 0.5,
    },
    {
      id:4,
      field: "isValid",
      sortable: false,
      headerName: "Validation",
      flex: 1,
      renderCell: (params) => (
        <Box
        sx={{
            display:"flex",
            alignItems:"center",
            gap:20
        }}>
        <FormControlLabel
              sx={{
                
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.isValid}
                  onChange={() => handleSwitchChange(params.row.idFabrication)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200] }}
                    disabled={params.row.isValid}
                />
              }
              />
              
              <Link to={`/fabrication/info/${params.row.idFabrication}`}>

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
              if (role === 'RESPONSABLE_LOGISTIQUE') {
                handleViewBonFab(params.row.idFabrication);
              }
            }}

            >
          
                <MoreVertIcon />
            
            </IconButton>
            
            <IconButton
          variant="outlined"
          sx={{
            marginLeft:2,
            backgroundColor:colors.primary[400],
            color:colors.primary[100],
            "&:hover": {
              backgroundColor: colors.button[100], 
              color: colors.button[200], 
            },
          }}

          onClick={(event) => {
            event.preventDefault(); 
            event.stopPropagation(); 
            handleDelete(params.row.idFabrication);
          }}
          >
                 
              <DeleteIcon />

          </IconButton>


            {role === 'RESPONSABLE_LOGISTIQUE' && (
            <Box
    sx={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: (() => {
        if (params.row.state === 'new') {
          return 'green';
        } else if (params.row.state === 'updated') {
          return 'red'; 
        } else {
          return 'grey'; 
        }
      })(),
      marginLeft: '5px',
      display: 'inline-block',
    }}
  ></Box> )}

           
          </Link>
            </Box>
      )
    },
  

  ];

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/fabrication", 
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`}
        } )
        const filteredResponse = role === 'CHEF_GLACIER'
        ? response.data.filter((fabrication) => fabrication.ChefGlacierId === id)
        : response.data

        const updatedOrders = await Promise.all(filteredResponse.map(async (order) => {
           // Fetch user data by ID
          const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${order.ChefGlacierId}`, {
          withCredentials: true,
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
            }
              });
              const orderWithUserName = {
                idFabrication: order.idFabrication,
                reference: order.reference,
                chef: userResponse.data.nomUtilisateur,
                isValid: order.validationFabrication,
                date: new Date(order.dateFabrication),
                state:order.state

              };

              return orderWithUserName;
        }))
        const sortedOrders = updatedOrders.sort((a, b) => b.date - a.date);

      setData(sortedOrders);
    }
    catch(err) {
      console.log(err)
    }
  }
  
  useEffect(()=>{
    fetchData()
  },[])

  useEffect(() => {
    console.log(data)
  },[data])

  
  
  return (
    <Box m="20px">
      <Box 
      display="flex"
      >
            <Header title="Bons de Fabrication"  />
      </Box>
      
      <Box
       
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400]
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        <DataGrid
      density="comfortable"
      rows={data}
      getRowId={(row) => row.idFabrication}
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

export default BonFabrications;