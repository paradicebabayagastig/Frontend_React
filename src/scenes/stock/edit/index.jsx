import React, { useState, useEffect, useContext } from 'react';
import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { AuthContext } from "../../../contexts/Auth";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const StockEdit = () => {
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
  const [loading, setLoading] = useState(true);

  
  const handleArrayChange = (setState, prevArray, index, field) => (event) => {
    let newQuantity = parseFloat(event.target.value);
  
    setState((prevState) => {
      return prevState.map((item) => {
        if (item.index === index) {
          return { ...item, [field]: newQuantity };
        }
        return item;
      });
    });
  };  
  
  const handleFieldChange = (arrayType, index, field, newValue) => {
    const updatedArray = [...arrayType];
    const modifiedItem = { ...updatedArray[index] };
    modifiedItem[field] = newValue;

    updatedArray[index] = modifiedItem;

    if (arrayType === 'suite') {
      setSuite(updatedArray);
    } else if (arrayType === 'kilo') {
      setKilo(updatedArray);
    } else if (arrayType === 'fourniture') {
      setFourniture(updatedArray);
    }
  };

  const handleEditCellChange = (params) => (event) => {
    const { id, field } = params;
    const value = parseFloat(event.target.value);
  
    const updatedArray = [...suite, ...kilo, ...fourniture];
    const updatedItemIndex = updatedArray.findIndex((item) => item.idProduit === id);
  
    if (updatedItemIndex !== -1) {
      const updatedItems = [...updatedArray];
      const updatedItem = { ...updatedItems[updatedItemIndex], [field]: value };
  
      updatedItems[updatedItemIndex] = updatedItem;
  
      
      setSuite(updatedItems.filter((item) => item.type === 'SUITE'));
      setKilo(updatedItems.filter((item) => item.type === 'KG'));
      setFourniture(updatedItems.filter((item) => item.type === 'FOURNITURE'));
    }
  };
  

  const handleEditCellSubmit = async () => {
    const updatedItems = [...suite, ...kilo, ...fourniture];

    try {
      const updatePromises = updatedItems.map(async (item) => {
        console.log("Current Item:", item);
        console.log(`Updating stock item with id ${item.idProduit}`);

        const response = await axios.patch(
          `http://localhost:3000/api/v1/stockItem/${item.idProduit}`,
          {
            quantity: item.quantity,
            loss: item.loss,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

       
        if (response.status === 200) {
          
        } else {
          
          console.error(`Failed to update stock item with id ${item.idProduit}`);
        }
      });

      await Promise.all(updatePromises);
      navigate(`/stock/info/${stockId}`);
    } catch (error) {
      console.error("Error updating stock items:", error);
    }
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
        setLoading(false); 

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
      setLoading(false);

      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const suiteColumns = [
    {
      id: 1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id: 3,
      field: "quantity",
      headerName: <b>STOCK FINAL</b>,
      flex: 1,
      
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(suite[params.row.index]?.quantity ?? 0)}
              onChange={handleArrayChange(setSuite,suite,params.row.index,'quantity')}
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
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
        )
    },
       
    
    {
      id: 4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
     
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(suite[params.row.index]?.loss ?? 0)}
              onChange={handleArrayChange(setSuite,suite,params.row.index,'loss')}
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
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
        )
    }
  ]
  const kiloColumns = [
    {
      id: 1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id: 3,
      field: "quantity",
      headerName: <b>STOCK EN LITRES</b>,
      flex: 1,
     
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(kilo[params.row.index]?.quantity ?? 0)}
              onChange={handleArrayChange(setKilo,kilo,params.row.index,'quantity')}
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
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
        )
    },
    {
      id: 4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
    
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(kilo[params.row.index]?.quantity ?? 0)}
              onChange={handleArrayChange(setKilo,kilo,params.row.index,'loss')}
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
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
        )
    },
  ]
  const fournitureColumns = [
    {
      id: 1,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id: 3,
      field: "quantity",
      headerName: <b>STOCK FINAL</b>,
      flex: 1,
    
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(fourniture[params.row.index]?.quantity ?? 0)}
              onChange={handleArrayChange(setFourniture,fourniture,params.row.index,'quantity')}
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
                step: 0.1,
              }}
            />
     
        ) }
      </Box>
        )
    
    }]

  return (
    <Box m="20px">
      {loading && (
        <CircularProgress color="secondary" size={60} thickness={5} />
      )}
      <Header title="Stock" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        display="flex"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400],
          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.primary[300],
          },
          "& .quantity-column--cell": {
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
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
          isCellEditable={(params) => true}
          onEditCellChangeCommitted={handleEditCellChange}
        />
        <DataGrid
          density="comfortable"
          rows={kilo}
          columns={kiloColumns}
          getRowId={(row) => `kilo-${row.idProduit}`}
          isCellEditable={(params) => true}
          onEditCellChangeCommitted={handleEditCellChange}
        />
        <DataGrid
          density="comfortable"
          rows={fourniture}
          columns={fournitureColumns}
          getRowId={(row) => `fourniture-${row.idProduit}`}
          isCellEditable={(params) => true}
          onEditCellChangeCommitted={handleEditCellChange}
        />
      </Box>
      <Button
        onClick={handleEditCellSubmit}
        variant="contained"
        style={{
          backgroundColor: theme.palette.primary.main,
          maxHeight: 50,
          marginTop: 18,
          color: "white",
        }}
      >
        Enregistrer les modifications
      </Button>
    </Box>
  );
};

export default StockEdit;
