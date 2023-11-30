import { Box, Button, CircularProgress, Snackbar, TextField, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../../contexts/Auth"
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
    const value = event.target.value;
  
    const updatedArray = [...suite, ...kilo, ...fourniture];
    const updatedItemIndex = updatedArray.findIndex((item) => item.idProduit === id);
  
    if (updatedItemIndex !== -1) {
      const updatedValue = field === 'quantity' || field === 'loss' ? parseFloat(value) : value;
  
      updatedArray[updatedItemIndex] = {
        ...updatedArray[updatedItemIndex],
        [field]: updatedValue,
      };
  
      const updatedSuite = updatedArray.filter((item) => item.type === "SUITE");
      const updatedKilo = updatedArray.filter((item) => item.type === "KG");
      const updatedFourniture = updatedArray.filter((item) => item.type === "FOURNITURE");
  
      setSuite(updatedSuite);
      setKilo(updatedKilo);
      setFourniture(updatedFourniture);
    }
  };
  

  const handleEditCellSubmit = async () => {
    const updatedItems = [...suite, ...kilo, ...fourniture];
  
    const updatePromises = updatedItems.map(async (item) => {
        console.log("Current Item:", item);
      console.log(`Updating stock item with id ${item.idProduit}`);
      
      await axios.patch(
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
    });
    console.log("Current updateeeeeee!!!!:", updatePromises);
    await Promise.all(updatePromises);
  
    fetchData();
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
            setLoading(true);

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
      editable : true
    },
    {
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
      editable : true
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
      editable : true
    },
    {
      id:4,
      field: "loss",
      headerName: <b>JETES</b>,
      flex: 1,
      editable : true
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
      editable : true
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
        // Other styles...
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




