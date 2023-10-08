import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme, Modal, FormControl } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

const AddBon = () => {
   
      const params = useParams();
      const bonCommandeId = parseInt(params.id);
      console.log('bonCommandeId',bonCommandeId);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [redirect, setRedirect] = useState(false);
        const [allgood,setAllgood] = useState(true)
        const navigate = useNavigate();
        const [currentBonCommande,setCurrentBonCommande]= useState({})
        const [existingOrderItems,setExistingOrderItems] = useState([])
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        const style = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: colors.primary[400],
          border: '2px solid #000',
          boxShadow: 24,
          borderRadius:'30px',
          p: 4,
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

            const initialQuantities = availableProducts.map((produit,index) => ({
              index:index,
              idProduit: produit.idProduit,
              produit:produit.nomProduit,
              class:produit.class,
              type:produit.type,
              quantity: 0,
            }));
            setData(initialQuantities);
           
          }
       
          catch(err) {
            console.log(err)
          }
        }

        async function fetchSuite() {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/produits", {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            const availableProducts = response.data.filter((produit) => {
              const c1 = produit.availability === true 
              const c2 = produit.type === "PARFUM"
              const c3 = produit.class === "NORMAL"
              return c1&&c2&&c3
            });     


            const initialQuantities = availableProducts.map((produit,index) => ({
              index:index,
              idProduit: produit.idProduit,
              produit:produit.nomProduit,
              class:produit.class,
              type:produit.type,
              suite: 0,
            }));
            setData(initialQuantities);
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
            }))
            console.log("orders : ", orderItems)
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
      fetchSuite()
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
      navigate(`/modifierCommande/${currentBonCommande.commandeId}`);
    }
  }, [redirect, navigate]);

  const handleChange = (index) => (event) =>{
    let newQuantity = event.target.value;
    newQuantity = parseInt(newQuantity)
    if (currentBonCommande.type !== 'SUITE') {
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.index === index) {
            return { ...item, quantity:newQuantity   };
          }
          return item;
        });
      });
    }
    else {
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.index === index) {
            return { ...item, suite:newQuantity   };
          }
          return item;
        });
      });

    }
    
  }
  const handleUnitChange = (index) => (event) => {
    let newUnit = event.target.value;
    
    setData((prevData) => ({
      ...prevData,
      [index]: {...prevData[index],unite:newUnit}
    }));

  }

  const handleSubmit = async () => {
    if (currentBonCommande.type !== 'SUITE'
    ) {
      Object.keys(data).forEach(async (index) => {
        if ( (data[index].quantity !== 0)) {
          try {
            const createOrder = await axios.post('http://localhost:3000/api/v1/orderItem', {
            bonCommandeId: bonCommandeId,
            produitId: parseInt(data[index].idProduit),
            quantity: data[index].quantity,
            unite: data[index].unite
          }, {
             withCredentials: true,
             headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
            })
          const newOrderId = createOrder.data.idOrderItem
          console.log(newOrderId)
          const createFabrication = await axios.put(`http://localhost:3000/api/v1/fabItem/${newOrderId}`,{
            withCredentials:true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          console.log(createFabrication)
          }
          catch (err) {console.log(err)}
        }
      }); 
      const updateBonCommande = await axios.patch(`http://localhost:3000/api/v1/bons-commandes/${bonCommandeId}`,{
        withCredentials:true,
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }) 
      console.log('response :',updateBonCommande)    
    }
    else {
      for (const index of Object.keys(data)) {
        if (data[index].suite !== 0) {
          try {
            // First, create the order
            const orderCreate = await axios.post(
              'http://localhost:3000/api/v1/orderItem',
              {
                bonCommandeId: bonCommandeId,
                produitId: parseInt(data[index].idProduit),
                suiteCommande: data[index].suite,
                
              },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              }
            );
            const idOrderItem = orderCreate.data.idOrderItem
            console.log(orderCreate);
      
            // Then, update the fabrication order
            const fabricationOrderUpdate = await axios.put(
              `http://localhost:3000/api/v1/fabItem/${idOrderItem}`,
              {},
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              }
            );
            console.log(fabricationOrderUpdate);
          } catch (error) {
            console.log(error);
          }
        }
      }
      const updateBonCommande = await axios.patch(`http://localhost:3000/api/v1/bons-commandes/${bonCommandeId}`,{
        withCredentials:true,
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }) 
      console.log('response :',updateBonCommande)    
      

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
      headerName: <b>ID</b>,
      flex: 1,
      
    },
    {
      id:2,
      field: "produit",
      headerName: <b>PRODUIT</b>,
      flex: 1,
    },
    {
      id:4,
      field: "class",
      headerName: <b>CLASS</b>,
      flex: 1,

    },
    {
      id:5,
      field: "type",
      headerName: <b>TYPE</b>,
      flex: 1,

    }
    
  
    ];
  if(currentBonCommande.type ==='SUITE'){
  columns.push(
    {
      id:6,
      field: "Suite",
      headerName: "Suite",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        {params.isSelected ? (
          <Box>
            <Button>-</Button>
            <TextField
              type="number"
              value={data[params.row.index]?.quantity ?? 0}
              onChange={handleChange(params.row.index)}
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
            <Button>+</Button>
          </Box>
        ) : (
          // <Box>{data[params.row.index]?.quantity ?? 0}</Box>
     
          <TextField
            type="number"
            value={data[params.row.index]?.suite ?? 0}
            onChange={handleChange(params.row.index)}
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

        )}
      </Box>
        )
    }
  )}else{
    columns.push({
      id:3,
      field: "quantity",
      headerName: <b>QTE</b>,
      flex: 1,
      // disabled:{bonCommande.type==="SUITE"},
      renderCell: (params) => (
        <Box sx={{ height: 50 }}>
        {params.row.isSelected ? (
         
            <TextField
              type="number"
              value={data[params.row.index]?.quantity ?? 0}
              onChange={handleChange(params.row.index)}
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
     
        ) : (
          // <Box>{data[params.row.index]?.quantity ?? 0}</Box>
         
            <TextField
              type="number"
              value={data[params.row.index]?.quantity ?? 0}
              onChange={handleChange(params.row.index)}
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
        
        )}
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Header title="AJOUTER COMMANDE"  />
        {
          (currentBonCommande.type === 'SUITE')&&(
            <Button
            onClick={handleOpen}
            sx={{
              background:colors.primary[400],
              color:colors.primary[100],
              '&:hover':{
                background:colors.pinkAccent[400],
              }
            }}
            >
              Ajouter Nouveau Produit
            </Button>
          )
        }
        <Modal
        open={open}
        onClose={handleClose}
        >
          <Box
          sx={style}>

        <FormControl fullWidth>
          <InputLabel 
          id="demo-simple-select-label"
          sx={{
           color:colors.primary[100],
           '& .MuiOutlinedInput-input:focused': {
            color: colors.pinkAccent[400],
          }
          }}
          >Produit</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            // onChange={handleChange}
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[200],
                color:colors.primary[200]
              },
            }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <Button
        sx={{
          mt:5,
          ml:30,
          background:colors.button[100],
          color:colors.button[200],
          "&:hover":{
            background:colors.button[200],
            color:colors.button[100],
          }
        }}
        >
          Ajouter
        </Button>
          
            
          </Box>
          
        </Modal>
      </Box>
      
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
