import { Box, Checkbox, FormControlLabel, IconButton, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
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
const Invoices = () => {
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const role = authCtx.role
  const id = authCtx.id
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data,setData] = useState([]); 
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log('Selected Rows:', newSelection.map((id) => data.find((row) => row.idBonLivraison === id)));
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
      field: "idCommande",
      headerName: "N° Bon Livraison",
      flex: 0.25,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "point",
      headerName: "Point de vente",
      flex: 0.5,
      cellClassName:"point-column--cell"
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date Commande",
      flex: 0.5,
    },
    {
      id:4,
      field: "dateLivraison",
      headerName: "Date Livraison",
      flex: 1,
      renderCell: (params) => (
        <Box
        display="flex"
        gap={2}
        alignItems="center"
        >
          <Typography>
            {params.row.dateLivraison}
          </Typography>
          <FormControlLabel
              sx={{
                
                color: colors.primary[100], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.validationReception}
                  onChange={() => handleChange(params.row.idCommande)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200],
                    marginLeft:5,
                   }}
                    disabled={role === 'POINT_DE_VENTE'? false : true}
                />
              }
              label='Reception'
              />
          {/* <Link to={`/livraison/info/${params.row.idBonLivraison}`}>
            <Button
            sx={{
              background:colors.primary[400],
              color:colors.primary[100]
            }}
            >
              MORE INFO
            </Button>
          </Link> */}
          <Link to={`/livraison/info/${params.row.idCommande}`}>

            <IconButton
            variant="outlined"
            sx={{
              marginLeft:10,
              backgroundColor:colors.primary[400],
              color:colors.primary[100],
              "&:hover": {
                backgroundColor: colors.button[100], // Change background color on hover
                color: colors.button[200], // Change text color on hover
              },
            }}
            >
          
                <RemoveRedEyeIcon />
            
            </IconButton>
            
           
          </Link>
          <Link to={`/livraison/edit/${params.row.idCommande}`}>

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

              <EditNoteIcon />

          </IconButton>


          </Link>
          <Link>

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

              <DeleteIcon />

          </IconButton>


          </Link>
        </Box>
      )

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
  
        const dateCommande = commande.dateCommande.split('T')[0];
        const dateLivraison = firstBonCommande.dateLivraison.split('T')[0];
  
        // Create the object with the required properties
        const orderWithDetails = {
          idCommande: commande.idCommande,
          dateCommande,
          dateLivraison,
          point: userResponse.data.nomUtilisateur,
          validationReception: commande.validationReception
        };
  
        return orderWithDetails;
      }));
  
      console.log('Orders with details:', ordersWithDetails);
      setData(ordersWithDetails)
      // You can return the data or do something else with it
      return ordersWithDetails;
    } catch (err) {
      console.log(err);
      // Handle errors here
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
      display="flex"
      >
            <Header title="Bons de Livraison"  />
            
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
        getRowId={(row)=>row.idCommande}
        columns={columns}
        checkboxSelection
        onSelectionModelChange={handleSelectionChange}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
