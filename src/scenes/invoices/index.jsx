import { Box, Checkbox, Fab, FormControlLabel, Icon, IconButton, InputLabel, MenuItem, NativeSelect, Select, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/Auth";
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteIcon from '@mui/icons-material/EditNote';
const Invoices = () => {
  
  const navigate = useNavigate()
  const [data,setData] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: colors.primary[400],
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius:'30px',
    p: 4,
  };
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const role = authCtx.role
  const id = authCtx.id



  const [selectedRows,setSelectedRows] = useState([]);
  const handleSelectionChange = async (newSelection)=>{
    setSelectedRows(newSelection);
  }


  const columns = [
    {
      id:1,
      field: "idCommande",
      headerName: "N° Commande",
      flex: 0.5,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "name",
      headerName: "Point De Vente",
      flex: 0.5,
      cellClassName: "point-column--cell"
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Box 
        sx={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
          
        }}
        >
          <Typography >
            {params.row.dateCommande}
          </Typography>
          <FormControlLabel
              sx={{
                marginLeft:10,
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.fabricationId !== null ? true : false}
                  // onChange={() => handleSwitchChange(params.id)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200],
                    '&.Mui-disabled': {
                      color: colors.pinkAccent[400],
                    },
                   }}
                    disabled
                    

                />
              }
              label="fabriqué"
              />

              <FormControlLabel
              sx={{
                
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.livraison}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200] }}
                    disabled

                />
              }
              label="livré"
              />
          <Link to={`/commande/${params.row.idCommande}`}>

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
          <Link to={`/modifierCommande/${params.row.idCommande}`}>

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

              <EditNoteIcon />

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
        )
    },
  

  ];
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/commandes", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const filteredCommandes = role === 'POINT_DE_VENTE'
        ? response.data.filter((commande) => commande.idPointVente === id )
        : response.data
        const updatedOrders = await Promise.all(filteredCommandes.map(async (order) => {
          // Fetch user data by ID
          const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${order.idPointVente}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const date = order.dateCommande
          const dateOnly = date.split('T')[0]
  
          const orderWithUserName = {
            idCommande: order.idCommande,
            dateCommande: dateOnly,
            fabricationId: order.fabricationId,
            livraison:order.livraison,
            name: userResponse.data.nomUtilisateur  // Assuming the user's username is stored in `username` property
          };
  
          return orderWithUserName;
        }));
  
        setData(updatedOrders);
        console.log("global data in ! ")
      } catch (err) {
        console.log(err);
      }
    }
    
  
    getData();
 
    

  }, []);

  useEffect(() => {
    console.log('data changed :',data)
  },[data])
  
  const handleClick =async () => {
    try {
      const CommandeResponse = await axios.post('http://localhost:3000/api/v1/commandes',{
        idPointVente:parseInt(id),
      },{
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      })
      const newCommandId = CommandeResponse.data.idCommande; // Assuming the ID property is named idCommande
      console.log(newCommandId);
      const FabricationResponse = await axios.put('http://localhost:3000/api/v1/fabrication',{
        idPointVente: id,
        nouvelleCommandeId: newCommandId
      },{
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      })
      console.log(FabricationResponse.data)
      const ch = "Une Nouvelle Commande a été ajouter par "+authCtx.name;
      const not = await axios.post('http://localhost:3000/api/v1/notifications',{
        text:ch,
        target:  ["RESPONSABLE_LOGISTIQUE"] ,
      })
      navigate(`/ajouterCommande/${newCommandId}`);
    }
    catch(err) {
      console.log(err)
    }
   
  
  
}

  return (
    <Box ml="20px" mt="20px">
      <Box display='flex'>
      <Header title=" Commandes "  /> 
        {(role === 'POINT_DE_VENTE') && (
          <Fab 
          sx={{
              color: colors.pinkAccent[400],
              background: colors.primary[400],
              marginLeft:15
          }} 
          aria-label="add"  
          onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Fab>
        )
          
        }
      </Box>
        
     

      <Box
        m="40px 10px 0 0"
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
          "& .point-column--cell": {
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid 
        checkboxSelection
        density="comfortable"
        getRowId={(row)=>row.idCommande}
        rows={data} 
        columns={columns} 
        onSelectionModelChange={handleSelectionChange}
        components={{ Toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        />
      
      </Box>
    </Box>
  );
};

export default Invoices;
