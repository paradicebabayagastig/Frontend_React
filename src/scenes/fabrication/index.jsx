import { Box, Checkbox, FormControlLabel, IconButton, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
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
      flex: 1,
      cellClassName: "name-column--cell",
      
    },
    {
      id:2,
      field: "date",
      headerName: "date",
      flex: 1,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:3,
      field: "chef",
      headerName: "Chef Glacier",
      flex: 1,
    },
    {
      id:4,
      field: "isValid",
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
            >
          
                <MoreVertIcon />
            
            </IconButton>
            
           
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
                date: order.dateFabrication.split('T')[0]

              };

              return orderWithUserName;
        }))
        setData(updatedOrders);
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
        getRowId={(row)=>row.idFabrication}
        columns={columns}
        onSelectionModelChange={handleSelectionChange}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default BonFabrications;
