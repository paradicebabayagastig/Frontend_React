import { Box, Checkbox, FormControlLabel, Icon, IconButton, Typography, useTheme } from "@mui/material";
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
      field: "reference",
      headerName: "reference",
      flex: 0.5,
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
      flex: 0.25,
    },
    {
      id:4,
      field: "dateLivraison",
      headerName: "Date Livraison",
      flex: 0.25,
    },
    {
      id:5,
      headerName: "Validation Reception",
      flex: 0.25,
      cellClassName: "point-column--cell",
      renderCell: (params) => (
        <Box
        display="flex"
        gap={0.25}
        alignItems="center"
        >
          {params.row.validationReception? (<Icon><ThumbUpAltIcon/></Icon>):(<Icon><CloseIcon/></Icon>)}
          
        </Box>
      )

    },
    {
      id:4,
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
          >

              <RemoveRedEyeIcon />

          </IconButton>


          </Link>
          <Link>

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
          >

            <DeleteIcon />

          </IconButton>


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
  
        const dateCommande = commande.dateCommande.split('T')[0];
        const dateLivraison = firstBonCommande? firstBonCommande.dateLivraison.split('T')[0]:'undefined';
  
        // Create the object with the required properties
        const orderWithDetails = {
          idCommande: commande.idCommande,
          reference: commande.refBL,
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
      console.log('error : ',err);
      
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
