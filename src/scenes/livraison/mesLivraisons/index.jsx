import { Box, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const MesLivraisons = () => {
  const authCtx = useContext(AuthContext)
  const userId = authCtx.id;
  console.log(userId)
  const token = authCtx.isAuthenticated
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data,setData] = useState([]); 
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log('Selected Rows:', newSelection.map((id) => data.find((row) => row.idBonLivraison === id)));
  };
  const handleSwitchChange = async (bonLivraisonId) => {
    try {
      updateLivraison(bonLivraisonId)
      
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };
  async function updateLivraison(bonLivraisonId) {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/bons-commandes/reception/${bonLivraisonId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Livraison updated successfully.');
      setData(prevData => {
        return prevData.map(item => {
          if (item.idBonLivraison === bonLivraisonId) {
            return {
              ...item,
              validationReception: true
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
      field: "idBonLivraison",
      headerName: "N° Bon Livraison",
      flex: 1,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "point",
      headerName: "Point de vente",
      flex: 1,
      cellClassName:"point-column--cell"
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date Commande",
      flex: 1,
    },
    {
      id:4,
      field: "dateLivraison",
      headerName: "Date Livraison",
      flex: 1,
      renderCell: (params) => (
        <Box
        display="flex"
        gap={5}
        alignItems="center"
        >
          <Typography>
            {params.row.dateLivraison}
          </Typography>
          <FormControlLabel
              sx={{
                
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.validationReception}
                  onChange={() => handleSwitchChange(params.row.idBonLivraison)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200] }}
                    disabled={params.row.validationReception}
                />
              }
              />
          <Link to={`/livraison/info/${params.row.idBonLivraison}`}>
            <Button
            sx={{
              background:colors.primary[400],
              color:colors.primary[100]
            }}
            >
              MORE INFO
            </Button>
          </Link>
        </Box>
      )

    },
  

  ];

  async function fetchData() {
    // try {
    //   const response = await axios.get("http://localhost:3000/api/v1/commandes", 
    //   {
    //     withCredentials: true,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`}
    //     } )
    //     const filteredData = response.data.filter((item) => item.livraison === true);

    //     const updatedOrders = await Promise.all(filteredData.map(async (order) => { 
    //       if ( commandeResponse.data.idPointVente === userId ) {
    //         const dateCommandeChey7a = order.dateCommande;
    //         const dateCommande = dateCommandeChey7a.split('T')[0];
    //         const dateLivraisonChey7a = order.dateLivraison;
    //         const dateLivraison = dateLivraisonChey7a.split('T')[0]
    //          // Fetch user data by ID
    //         const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${commandeResponse.data.idPointVente}`, {
    //         withCredentials: true,
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //           }
    //             });
  
    //             const orderWithUserName = {
    //               idBonLivraison: order.idBonCommande,
    //               dateCommande: dateCommande,
    //               dateLivraison: dateLivraison,
    //               point: userResponse.data.nomUtilisateur,
    //               validationReception: order.validationReception
    //             };
    //             console.log("commande :",commandeResponse.data[0])
    //             return orderWithUserName;
          
    //       } else return null
          
    //      }))
    //     ;
    //     const filteredOrders = updatedOrders.filter((order) => order !== null);
    //     if (filteredOrders.length !== 0) {
    //       setData(filteredOrders)
    //     } 
    // }
    // catch(err) {
    //   console.log(err)
    // }
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
            <Header title="Bons de Livraison"  />
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
        m="40px 0 0 0"
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
        getRowId={(row)=>row.idBonLivraison}
        columns={columns}
        checkboxSelection
        onSelectionModelChange={handleSelectionChange}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default MesLivraisons;
