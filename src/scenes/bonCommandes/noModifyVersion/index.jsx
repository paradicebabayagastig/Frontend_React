import { Box, FormControlLabel, IconButton, InputLabel, MenuItem, NativeSelect, Select, Switch, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/Auth";
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


const BonsCommandesLite = () => {
  
  const [data,setData] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const [isPink, setIsPink] = useState(false);

  
  const switchColor = isPink ? 'pink' : 'primary';

    
  const columns = [
    {
      id:1,
      field: "idBonCommande",
      headerName: "N° Bon Commande",
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
      headerName: "Date commande",
      flex: 0.5,
    },
    {
        id:4,
        field: "dateLivraison",
        headerName: "Date livraison",
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
                {params.row.dateLivraison}
              </Typography>
              <FormControlLabel
              sx={{
                ml: 20  ,
                color: switchColor, // Apply the color based on the state
              }}
              control={
                <Switch
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.livraison}
                   disabled
                />
              }
              label="livré"
              />
              
              
            </Box>
            )
    },

  ];
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/bons-commandes", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const updatedOrders = await Promise.all(response.data.map(async (order) => {
         

          const commandeResponse = await axios.get(`http://localhost:3000/api/v1/commandes/bonCommande/${order.idBonCommande}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

           // Fetch user data by ID
           const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${commandeResponse.data[0].idPointVente}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const dateCommandeChey7a = commandeResponse.data[0].dateCommande;
          const dateCommande = dateCommandeChey7a.split('T')[0];
          const dateLivraisonChey7a = order.dateLivraison;
          const dateLivraison = dateLivraisonChey7a.split('T')[0]
          
          const orderWithUserName = {
            idBonCommande: order.idBonCommande,
            dateCommande: dateCommande,
            dateLivraison: dateLivraison,
            name: userResponse.data.nomUtilisateur,
            livraison:order.livraison,
            livraisonMargin:0
          };
          console.log("commande :",commandeResponse.data[0])
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
    console.log("data ; ",data)
  },[data])

  return (
    <Box ml="20px" mt="20px">
      <Box display="flex">
        <Header title="BonsCommandes "  /> 
        <Box
        display="flex"
        marginLeft="750px"
        height="50px"
       
        >
        <Button  variant="outlined" sx={{
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
        m="40px 10px 0 0"
        height="75vh"
       
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.pinkAccent[300],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid 
        hideFooter 
        getRowId={(row)=>row.idBonCommande}
        rows={data} 
        columns={columns} 
        
        />
      </Box>
    </Box>
  );
};

export default BonsCommandesLite;
