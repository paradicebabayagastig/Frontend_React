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

const Stock = () => {
   
        const params = useParams();
        const stockId = parseInt(params.id);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        const [products,setProducts] = useState([])

        async function fetchData() {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/produits", {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            const initialQuantities = response.data.map((produit) => ({
                productId: produit.idProduit,
                quantity: 0,
                unite:"BAC5"

            }));
            const updatedProducts = [{}].concat(initialQuantities);

            setData(response.data);
            setProducts(updatedProducts);
          }
       
          catch(err) {
            console.log(err)
          }
        }

        const handleChange = (productId) => (event) =>{
            let newQuantity = event.target.value;
            newQuantity = parseInt(newQuantity)
            setProducts((prevProducts) => ({
              ...prevProducts,
              [productId]: {...prevProducts[productId],quantity:newQuantity}
            }));
        }
        const handleUnitChange = (productId) => (event) => {
          let newUnit = event.target.value;
          
          setProducts((prevProducts) => ({
            ...prevProducts,
            [productId]: {...prevProducts[productId],unite:newUnit}
          }));
      
        }
      
        useEffect(()=>{
          console.log(products)
        },[products])

        const handleSubmit = () => {
      
          Object.keys(products).forEach( index => {
              if ((index !== 0) && (products[index].quantity !== 0)) {
                axios.post('http://localhost:3000/api/v1/orderItem', {
                  StockId: stockId,
                  produitId: parseInt(products[index].productId),
                  quantity: products[index].quantity,
                  unite: products[index].unite
                }, { withCredentials: true })
                .then((response) => {
                })
                .catch((err) => {
                  console.log(err);
                });
              }
            });
        }
  useEffect(()=>{
    fetchData()
  },[]);
  const columns = [
    {
      id:1,
      field: "idProduit",
      headerName: "id",
      flex: 1,
      
    },
    {
      id:2,
      field: "nomProduit",
      headerName: "produit",
      flex: 1,
    },{
        id:3,
        field: "quantite",
        headerName: "Qte",
        flex: 1,
        renderCell: (params) => (
          <Box sx={{
            height:50
          }}>
            <TextField
            type="number"
            value={products[params.row.idProduit]?.quantity ?? 0}
            onChange={handleChange(params.row.idProduit)}
            variant="outlined"
            sx={{
             width:65,
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
          </Box>
          )
      },{
        id:5,
        field:"unite",
        headerName:"Unité",
        flex:2,
        renderCell: (params) => (
          
            
            <Box>
            <InputLabel htmlFor="filled-adornment-unit">{products[params.row.idProduit]?.unite !== undefined ? "" : "unite"}</InputLabel>
            <Select 
            inputProps={{
                      name: 'unite',
                      id: 'filled-adornment-unit',
                    }} 
            value={products[params.row.idProduit]?.unite ?? "BAC5"} 
            onChange={handleUnitChange(params.row.idProduit)} 
             >
              <MenuItem key="1" value="BAC5">BAC 5L</MenuItem>
              <MenuItem key="2" value="BAC6">BAC 6,5L</MenuItem>
              <MenuItem key="3" value="POZZETTI_PLAZA">POZZETTI_PLAZA</MenuItem>
              <MenuItem key="4" value="POZZETTI_AZUR">POZZETTI_AZUR</MenuItem>
              <MenuItem key="5" value="LOT_DE_50">LOT_DE_50</MenuItem>
            </Select>
            </Box>
          
          
          )
      }
    ];
   return (
    <Box m="20px">
      <Header title="Stock"  />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
        rows={data}
        columns={columns}
        getRowId={(row)=>row.idProduit}
       />
       <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: colors.pinkAccent[400],maxHeight: 50,marginTop:18, color: 'white' }}>
          Ajouter Stock
       </Button>
      </Box>
    </Box>
  );
};

export default Stock;
