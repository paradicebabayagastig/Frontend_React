import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const Pertes = () => {

        const navigate = useNavigate()
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const pointVenteId = parseInt(authCtx.id)
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [suite,setSuite] = useState([])
        const [kilo,setKilo] = useState([])
        const [fourniture,setFourniture] = useState([])

        const handleSuiteChange = (index) => (event) => {
          let newQuantity = event.target.value;
          newQuantity = parseInt(newQuantity)
          setSuite((prevSuite) => {
            return prevSuite.map((item) => {
              if (item.index === index) {
                return { ...item, quantity:newQuantity   };
              }
              return item;
            });
          });
        }
        const handleKiloChange = (index) => (event) => {
          let newQuantity = event.target.value;
          newQuantity = parseInt(newQuantity)
          setKilo((prevKilo) => {
            return prevKilo.map((item) => {
              if (item.index === index) {
                return { ...item, quantity:newQuantity   };
              }
              return item;
            });
          });
        }
        const handleFournitureChange = (index) => (event) => {
          let newQuantity = event.target.value;
          newQuantity = parseInt(newQuantity)
          setFourniture((prevFourniture) => {
            return prevFourniture.map((item) => {
              if (item.index === index) {
                return { ...item, quantity:newQuantity   };
              }
              return item;
            });
          });
        }

        async function fetchData() {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/produits", {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
        
            const availableProducts = response.data.filter((produit) => produit.availability === true);
        
            const suiteArray = [];
            const kiloArray = [];
            const fournitureArray = [];
        
            let suiteIndex = 0;
            let kiloIndex = 0;
            let fournitureIndex = 0;
        
            availableProducts.forEach((produit) => {
              const idProduit = produit.idProduit;
              const nomProduit = produit.nomProduit;
              const classProduit = produit.class;
              const typeProduit = produit.type;
        
              if (typeProduit === "PARFUM" && classProduit === "NORMAL") {
                suiteArray.push({
                  index: suiteIndex++,
                  idProduit: idProduit,
                  produit: nomProduit,
                  class: classProduit,
                  type: typeProduit,
                  quantity: 0,
                });
              } else if (typeProduit === "PARFUM" && classProduit !== "NORMAL") {
                kiloArray.push({
                  index: kiloIndex++,
                  idProduit: idProduit,
                  produit: nomProduit + ' ' + classProduit,
                  class: classProduit,
                  type: typeProduit,
                  quantity: 0,
                });
              } else if (typeProduit === "FOURNITURE") {
                fournitureArray.push({
                  index: fournitureIndex++,
                  idProduit: idProduit,
                  produit: nomProduit,
                  class: classProduit,
                  type: typeProduit,
                  quantity: 0,
                });
              }
            });
            setSuite(suiteArray);
            setKilo(kiloArray);
            setFourniture(fournitureArray);
          } catch (err) {
            console.log(err);
          }
        }

        const handleSubmit = async () => {
          const orderItemIds = [];
        
          // Create an array of Promises for the axios requests
          const axiosPromises = [];
        
          // Handle suite items
          Object.keys(suite).forEach(async (index) => {
            if (suite[index].quantity !== 0) {
              const axiosPromise = axios.post('http://localhost:3000/api/v1/orderItem', {
                produitId: parseInt(suite[index].idProduit),
                quantity: suite[index].quantity,
              }, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
        
              axiosPromises.push(axiosPromise);
            }
          });
        
          // Handle kilo items
          Object.keys(kilo).forEach(async (index) => {
            if (kilo[index].quantity !== 0) {
              const axiosPromise = axios.post('http://localhost:3000/api/v1/orderItem', {
                produitId: parseInt(kilo[index].idProduit),
                quantity: kilo[index].quantity,
              }, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
        
              axiosPromises.push(axiosPromise);
            }
          });
        
          // Handle fourniture items
          Object.keys(fourniture).forEach(async (index) => {
            if (fourniture[index].quantity !== 0) {
              const axiosPromise = axios.post('http://localhost:3000/api/v1/orderItem', {
                produitId: parseInt(fourniture[index].idProduit),
                quantity: fourniture[index].quantity,
              }, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
        
              axiosPromises.push(axiosPromise);
            }
          });
        
          // Wait for all axios requests to complete
          try {
            const results = await Promise.all(axiosPromises);
        
            // Extract orderItemIds from the results
            results.forEach((createOrder) => {
              orderItemIds.push(createOrder.data.idOrderItem);
            });
        
            console.log('orderItems:', orderItemIds);
        
            const createPerte = await axios.post('http://localhost:3000/api/v1/pertes', {
              orderItemIds: orderItemIds,
              pointDeVenteId: pointVenteId,
            }, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
        
            console.log(createPerte);
            navigate(`/`);
          } catch (err) {
            console.log(err);
          }
        };
        
  useEffect(()=>{
    fetchData()
  },[]);
  const suiteColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id:3,
      field: "quantity",
      headerName: <b>QTE</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={suite[params.row.index]?.quantity ?? 0}
              onChange={handleSuiteChange(params.row.index)}
              variant="outlined"
              sx={{
                width: 65,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 50,
              }}
            />
     
        ) }
      </Box>
        )
    }
  ]
  const kiloColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id:3,
      field: "quantity",
      headerName: <b>QTE</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={kilo[params.row.index]?.quantity ?? 0}
              onChange={handleKiloChange(params.row.index)}
              variant="outlined"
              sx={{
                width: 65,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 50,
              }}
            />
     
        ) }
      </Box>
        )
    }
  ]
  const fournitureColumns = [
    {
      id:1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id:3,
      field: "quantity",
      headerName: <b>QTE</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={fourniture[params.row.index]?.quantity ?? 0}
              onChange={handleFournitureChange(params.row.index)}
              variant="outlined"
              sx={{
                width: 65,
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              inputProps={{
                min: 0,
                step: 50,
              }}
            />
     
        ) }
      </Box>
        )
    }
  ]
   return (
    <Box m="20px">
      <Header title="Pertes"  />
      <Box
        m="40px 0 0 0"
        height="75vh"
        display="flex"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400],
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
            color: `${colors.pinkAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
        density="comfortable"
        rows={suite}
        columns={suiteColumns}
        getRowId={(row)=>row.index}
       />
          <DataGrid
        density="comfortable"
        rows={kilo}
        columns={kiloColumns}
        getRowId={(row)=>row.index}
       />
          <DataGrid
        density="comfortable"
        rows={fourniture}
        columns={fournitureColumns}
        getRowId={(row)=>row.index}
       />
      
      </Box>
      <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: colors.pinkAccent[400],maxHeight: 50,marginTop:18, color: 'white' }}>
          Enregistrer Pertes
       </Button>
    </Box>
  );
};

export default Pertes;
