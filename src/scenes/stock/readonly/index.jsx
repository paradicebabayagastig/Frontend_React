import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../../contexts/Auth"
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom'; 

const StockView = () => {

    const navigate = useNavigate();
    const params = useParams();
    const stockId = parseInt(params.id);
    const authCtx = useContext(AuthContext);
    const token = authCtx.isAuthenticated;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [suite, setSuite] = useState([]);
    const [kilo, setKilo] = useState([]);
    const [fourniture, setFourniture] = useState([]);
    const handleModify = () => {
      navigate(`/stock/edit/${stockId}`);
    };
    
    async function fetchData() {
      let suiteIndex = 0;
      let kiloIndex = 0;
      let fournitureIndex = 0;
  
      try {
          const response = await axios.get(`http://localhost:3000/api/v1/stockItem/stock/${stockId}`, {
              withCredentials: true,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          });
  
          console.log("Stock response:", response);
  
          const promises = response.data.map(async (item) => {
              const produitResponse = await axios.get(`http://localhost:3000/api/v1/produits/${item.produitId}`, {
                  withCredentials: true,
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  }
              });
  
              console.log("produit response :", produitResponse);
  
              const nomProduit = produitResponse.data.nomProduit;
              const classProduit = produitResponse.data.class;
  
              let newItem;
  
              if (item.type === "SUITE") {
                  newItem = {
                      index: suiteIndex++,
                      idProduit: item.produitId,
                      produit: nomProduit,
                      quantity: item.quantity,
                      loss: item.loss,
                      type: item.type
                  };
              } else if (item.type === "KG") {
                  newItem = {
                      index: kiloIndex++,
                      idProduit: item.produitId,
                      produit: nomProduit + ' ' + classProduit,
                      quantity: item.quantity,
                      loss: item.loss,
                      type: item.type
                  };
              } else if (item.type === "FOURNITURE") {
                  newItem = {
                      index: fournitureIndex++,
                      idProduit: item.produitId,
                      produit: nomProduit,
                      quantity: item.quantity,
                      loss: item.loss,
                      type: item.type
                  };
              }
  
              console.log("New Item:", newItem);
              return newItem;
          });
  
          const results = await Promise.all(promises);
          console.log("Results:", results);
  
          const suiteArray = results.filter(item => item.type === "SUITE");
          const kiloArray = results.filter(item => item.type === "KG");
          const fournitureArray = results.filter(item => item.type === "FOURNITURE");
  
          console.log("Suite Array:", suiteArray);
          console.log("Kilo Array :", kiloArray);
          console.log("Fourniture Array :", fournitureArray);
  
          setSuite(suiteArray);
          setKilo(kiloArray);
          setFourniture(fournitureArray);
  
      } catch (err) {
          console.log(err);
      }
  }
  

  

 
  useEffect(()=>{
    fetchData()
  },[]);
  useEffect(()=>{
    console.log(suite)
  },[suite]);
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
      headerName: <b>STOCK FINAL</b>,
      flex: 1,
    },
    {
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
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
      headerName: <b>STOCK EN LITRES</b>,
      flex: 1,
    },
    {
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
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
      headerName: <b>STOCK FINAL</b>,
      flex: 1,
    }
  ]
   return (
    <Box m="20px">
      <Header title="Stock"  />
      <Button
        variant="contained"
        color="primary"
        onClick={handleModify}
      >
        Modifier stock
      </Button>
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
  getRowId={(row) => `suite-${row.idProduit}`}
/>

<DataGrid
  density="comfortable"
  rows={kilo}
  columns={kiloColumns}
  getRowId={(row) => `kilo-${row.idProduit}`}
/>

<DataGrid
  density="comfortable"
  rows={fourniture}
  columns={fournitureColumns}
  getRowId={(row) => `fourniture-${row.idProduit}`}
/>

      </Box>
    </Box>
  );
};

export default StockView;