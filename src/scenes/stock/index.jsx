import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../contexts/Auth"
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom'; 

const Stock = () => {

    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const token = authCtx.isAuthenticated;
    const pointVenteId = parseInt(authCtx.id);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [suite, setSuite] = useState([]);
    const [kilo, setKilo] = useState([]);
    const [fourniture, setFourniture] = useState([]);

  

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
                        loss: 0,
                    });
                } else if (typeProduit === "PARFUM" && classProduit !== "NORMAL") {
                    kiloArray.push({
                        index: kiloIndex++,
                        idProduit: idProduit,
                        produit: nomProduit + ' ' + classProduit,
                        class: classProduit,
                        type: typeProduit,
                        quantity: 0,
                        loss: 0,
                    });
                } else if (typeProduit === "FOURNITURE") {
                    fournitureArray.push({
                        index: fournitureIndex++,
                        idProduit: idProduit,
                        produit: nomProduit,
                        class: classProduit,
                        type: typeProduit,
                        quantity: 0,
                        loss: 0,
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
        const stockItemIds = [];

        const axiosPromises = [];

        // Handle suite items
        Object.keys(suite).forEach(async (index) => {
            if ((suite[index].quantity !== 0)||(suite[index].loss !== 0)) {
                console.log('Submitting suite item:', suite[index]);

                const axiosPromise = axios.post('http://localhost:3000/api/v1/stockItem', {
                    produitId: parseInt(suite[index].idProduit),
                    quantity: suite[index].quantity,
                    loss: suite[index].loss,
                    type:'SUITE'
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
            if ((kilo[index].quantity !== 0)||(kilo[index].loss !== 0)) {
                console.log('Submitting kilo item:', kilo[index]);

                const axiosPromise = axios.post('http://localhost:3000/api/v1/stockItem', {
                    produitId: parseFloat(kilo[index].idProduit),
                    quantity: kilo[index].quantity,
                    loss: suite[index].loss,
                    type:'KG'
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
                console.log('Submitting fourniture item:', fourniture[index]);

                const axiosPromise = axios.post('http://localhost:3000/api/v1/stockItem', {
                    produitId: parseFloat(fourniture[index].idProduit),
                    quantity: fourniture[index].quantity,
                    loss: suite[index].loss,
                    type:'FOURNITURE'
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

        console.log('Data being sent to the server:');
        console.log('Suite:', suite);
        console.log('Kilo:', kilo);
        console.log('Fourniture:', fourniture);
        // Wait for all axios requests to complete
        console.log('axiosPromises:', axiosPromises);
        try {
          const results = await Promise.all(axiosPromises);
          console.log('Results from axios requests:', results);
          console.log('orderItems: 1 ', stockItemIds);
          

            // Extract orderItemIds from the results
            results.forEach((createOrder) => {
              stockItemIds.push(createOrder.data.idStockItem);
            });

            console.log('orderItems 2 :', stockItemIds);
            console.log('l   pointVenteId: ???', pointVenteId);
            const createStock = await axios.post('http://localhost:3000/api/v1/stocks', {
              stockItemIds: stockItemIds,
              pointVenteId: pointVenteId,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('createStock response:', createStock);
         
            navigate(`/`);
        } catch (err) {
            console.log('Error in handling stock submission:', err);
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
      headerName: <b>STOCK FINAL</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
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
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
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
      // disabled:{bonCommande.type==="SUITE"},
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
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        { (
         
            <TextField
              type="number"
              value={parseFloat(kilo[params.row.index]?.loss ?? 0)}
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
      // disabled:{bonCommande.type==="SUITE"},
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
    }
  ]
   return (
    <Box m="20px">
      <Header title="Stock"  />
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
          Enregistrer stocks
       </Button>
    </Box>
  );
};

export default Stock;