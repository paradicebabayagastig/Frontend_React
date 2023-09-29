import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const AddBon = () => {
   
      const params = useParams();
      const bonCommandeId = parseInt(params.id);
      console.log('bonCommandeId',bonCommandeId);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [redirect, setRedirect] = useState(false);
        const [allgood,setAllgood] = useState(true)
        const navigate = useNavigate();
        const [currentBonCommande,setCurrentBonCommande]= useState({})
        const [existingOrderItems,setExistingOrderItems] = useState([])

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

            const initialQuantities = availableProducts.map((produit) => ({
              idProduit: produit.idProduit,
              produit:produit.nomProduit,
              class:produit.class,
              quantity: 0,
              unite: "BAC5",
            }));
      
            const updatedProducts = [{}].concat(initialQuantities);

            console.log("products :",initialQuantities)
            
            setData(initialQuantities);
            setProducts(updatedProducts);
          }
       
          catch(err) {
            console.log(err)
          }
        }
        const getBc =async ()=>{
          try{
          const response = await axios.get(`http://localhost:3000/api/v1/bons-commandes/${bonCommandeId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          setCurrentBonCommande(response.data)
          console.log("aa",response.data);

        }catch(err){
          console.log(err);
        }
        }
        async function getBonCommandeByCommandeId(){
          try{
             const response = await axios.get(`http://localhost:3000/api/v1/bons-commandes/commande/${currentBonCommande.commandeId}`,{
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

             
          const bons = response.data.filter((bon) => bon.idBonCommande !== currentBonCommande.idBonCommande);

          // Fetch order items for the first boncommande in the filtered list (if any)
          if (bons.length > 0) {
            const firstBonCommandeId = bons[0].idBonCommande; // You can choose another boncommande if needed
            const orderItemsResponse = await axios.get(
              `http://localhost:3000/api/v1/orderItem/bonCommande/${firstBonCommandeId}`,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
            );

            const orderItems = await Promise.all(orderItemsResponse.data.map(async(orderItem,index) => {
              const produitResponse = await axios.get(`http://localhost:3000/api/v1/produits/${orderItem.produitId}`,
              {
                withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
              })
              return {
                idProduit: index+1,
                idOrderItem: orderItem.idOrderItem,
                class:produitResponse.data.class,
                produit: produitResponse.data.nomProduit,
                unite:orderItem.unite,
                suite:orderItem.suiteCommande
              }
             


              // Add other order item properties as needed
            }))
            console.log("orders : ", orderItems)
            // Set boncommandes and orderItems in your state
            setData(orderItems);
          } else {
            // Handle the case where no boncommande other than the current one was found
            // You can set defaults or handle it as needed
          }
          }
          catch(err){

          }
       }
        
  useEffect(()=>{
    getBc()
  },[])

  useEffect(()=>{
    if (currentBonCommande.type === 'SUITE') {
      getBonCommandeByCommandeId()
    }
    else {
      fetchData()
    }
    
  },[currentBonCommande])

  useEffect(() => {
    console.log('rayen',existingOrderItems)
  },[existingOrderItems])

  useEffect(() => {
    console.log('data :',data)
  },[data])  
  // useEffect(() => {
  //   const initialQuantities = [{}]
  //     data.map((produit) => (
  //       initialQuantities.push({
  //         productId:produit.idProduit,
  //         quantity:0,
  //         unite:"BAC5"
  //       })
  //     ))
  //     setProducts(initialQuantities)
  // },[data])
  

  useEffect(() => {
    if (success) {
      setLoading(false); // Turn off loading once successful
      setTimeout(() => {
        setRedirect(true); // After 2 seconds, set redirect to true
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (redirect) {
      navigate('/commande');
    }
  }, [redirect, navigate]);

  const handleChange = (productId) => (event) =>{
    let newQuantity = event.target.value;
    newQuantity = parseInt(newQuantity)
    if (currentBonCommande.type !== 'SUITE') {
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.idProduit === productId) {
            return { ...item, quantity:newQuantity   };
          }
          return item;
        });
      });
    }
    else {
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.idProduit === productId) {
            return { ...item, suite:newQuantity   };
          }
          return item;
        });
      });

    }
    
  }
  const handleUnitChange = (productId) => (event) => {
    let newUnit = event.target.value;
    
    setProducts((prevProducts) => ({
      ...prevProducts,
      [productId]: {...prevProducts[productId],unite:newUnit}
    }));

  }

  const handleSubmit = async () => {
    if (currentBonCommande.type !== 'SUITE'
    ) {
      Object.keys(data).forEach(index => {
        if ( (data[index].quantity !== 0)) {
          console.log('true :',data[index])
          axios.post('http://localhost:3000/api/v1/orderItem', {
            bonCommandeId: bonCommandeId,
            produitId: parseInt(data[index].idProduit),
            quantity: data[index].quantity,
            unite: data[index].unite
          }, { withCredentials: true })
          .then((response) => {
          })
          .catch((err) => {
            console.log(err);
            setAllgood(false); // Set allGood to false if any error occurs
          });
        }
      });      
    }
    else {
      Object.keys(data).forEach(index => {
        if (data[index].suite !== 0) {
          axios.patch('http://localhost:3000/api/v1/orderItem' , {
          idOrderItem:data[index].idOrderItem,
          suiteCommande:data[index].suite
          }, {
            withCredentials: true
          }
          )
          .then ((response) => {

          })
          .catch((error) => {
            console.log(error)
            setAllgood(false)
          }
          
          )
        }
      })
    }

  
    if (allgood) {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
      }, 3000);
      const ch = "Le bon de commande "+bonCommandeId+" a été modifier par "+authCtx.name;
      await axios.post('http://localhost:3000/api/v1/notifications',{
        text:ch,
        target:  ["RESPONSABLE_LOGISTIQUE"],
      })
      await axios.post('http://localhost:3000/api/v1/notifications',{
        text:ch,
        target:  ["ADMIN"],
      })
    }
  };
  

  const columns = [
    {
      id:1,
      field: "idProduit",
      headerName: "id",
      flex: 1,
      
    },
    {
      id:2,
      field: "produit",
      headerName: "produit",
      flex: 1,
    },
    {
      id:4,
      field: "class",
      headerName: "class",
      flex: 1,

    },
    {
      id:5,
      field:"unite",
      headerName:"Unité",
      valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
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
    },
  
    ];
  if(currentBonCommande.type ==='SUITE'){
  columns.push(
    {
      id:6,
      field: "Suite",
      headerName: "Suite",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{
          height:50
        }}>
          <TextField
          type="number"
          value={data[params.row.idProduit-1]?.suite ?? 0}
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
    }
  )}else{
    columns.push({
      id:3,
      field: "quantity",
      headerName: "quantity",
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{
          height:50
        }}>
          <TextField
          type="number"
          value={data[params.row.idProduit-1]?.quantity ?? 0}
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
    },)
  }
  return (
    <Box m="20px">
      {loading && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          display: loading ? 'flex' : 'none', // Conditional display    
        }}>
          <CircularProgress 
          color="secondary" // Change the color (primary, secondary, error, etc.)
          size={60} // Change the size (in pixels)
          thickness={5} // Change the thickness of the circle (in pixels)
          />
        </Box>
      ) }
      <Header title="AJOUTER COMMANDE"  />
      <Box
        m="40px 0 0 0"
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
        density="comfortable"
        rows={data}
        columns={columns}
        getRowId={(row)=>row.idProduit}
        components={{ Toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      
        />
      </Box>
      <Button type="submit" variant="contained" size="large" onClick={handleSubmit} sx={{
        mt:2.5,
        background:colors.pinkAccent[300],
        '&:hover': {
          background: colors.pinkAccent[400], // Set the background color to be the same as normal
      
        },
        ml:130
      }}> AJOUTER COMMANDE </Button>
      <Snackbar open={success} autoHideDuration={2000}>
        <Alert sx={{
          position: 'fixed',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}  severity="success">Operation Successful! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddBon;
