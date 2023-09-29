import { Box, Fab, MenuItem, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/Auth";
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';


const MesCommandes = () => {
  
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
    bgcolor: colors.blueAccent[600],
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius:'30px',
    p: 4,
  };
  const authCtx = useContext(AuthContext)
  const id = parseInt(authCtx.id)
  const token = authCtx.isAuthenticated

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
        navigate(`/ajouterCommande/${newCommandId}`);
      }
      catch(err) {
        console.log(err)
      }
     
    
    
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
          <Link to={`/commandes/${params.row.idCommande}`}>

            <Button
            variant="outlined"
            sx={{
              marginLeft:"150px",
              backgroundColor:colors.primary[400],
              color:colors.primary[100]
            }}
            >
              Voir Plus
            </Button>
           
          </Link>
        </Box>
        )
    },
  

  ];
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/commandes/pointVente/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const updatedOrders = await Promise.all(response.data.map(async (order) => {
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
            name: userResponse.data.nomUtilisateur  // Assuming the user's username is stored in `username` property
          };
  
          return orderWithUserName;
        }));
  
        setData(updatedOrders);
      } catch (err) {
        console.log(err);
      }
    }
   
  
    getData();

    

  }, []);


  

  return (
    <Box ml="20px" mt="20px">
      <Box display="flex">
        <Header title="Mes Commandes "  /> 
        <Box
        display="flex"
        marginLeft="750px"
        height="50px"
       
        >
        <Button  onClick={handleClick} variant="outlined" sx={{
              "&:hover":{color:colors.greenAccent[600],borderColor:colors.greenAccent[600]},
              marginRight:"20px",
              borderColor:colors.primary[100],
              backgroundColor:"transparent",
              color:colors.primary[100]
            }}
            >
              <AddIcon />
              ADD
          </Button>
         
          <Button  variant="outlined"  sx={{
              "&:hover":{color:colors.redAccent[600],borderColor:colors.redAccent[600]},
              borderColor:colors.primary[100],
              backgroundColor:"transparent",
              color:colors.primary[100]
            }}
            >
              <DeleteIcon />DELETE
          </Button>
        </Box> 
        

      </Box>
     

      <Box
        m="40px 0 0 0"
        height="75vh"
        width="150vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400],
          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.primary[300],
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
        checkboxSelection
        getRowId={(row)=>row.idCommande}
        rows={data} 
        columns={columns} 
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default MesCommandes;
