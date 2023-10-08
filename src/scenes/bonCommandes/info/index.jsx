import { Alert, Box, Chip, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const Bcinfo = () => {
   
      const params = useParams();
      const bonCommandeId = parseInt(params.id);
      console.log(bonCommandeId);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        const [currentBonCommande, setCurrentBonCommande] = useState({})
        // const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [redirect, setRedirect] = useState(false);
        const [allgood,setAllgood] = useState(true)
        const navigate = useNavigate();

        const classColors = {
          NORMAL: '#64CCC5', // Replace 'blue' with your desired color
          GRANITE: 'green', // Replace 'green' with your desired color
          ICE_POPS: 'orange', // Replace 'orange' with your desired color
          HAPPY_POPS: 'pink', // Replace 'pink' with your desired color
          DOMES: 'purple', // Replace 'purple' with your desired color
          AUTRES: 'red', // Replace 'red' with your desired color
          BUCHE_MAXI: 'teal', // Replace 'teal' with your desired color
          BUCHE_MINI: 'indigo', // Replace 'indigo' with your desired color
          CHOCOLAT: 'brown', // Replace 'brown' with your desired color
        };
        
        const typeColors = {
          PARFUM: '#FFD8E4', // Replace 'blue' with your desired color
          FOURNITURE: 'gold', // Replace 'green' with your desired color
        };

        const message = ("Information bon commande n° "+ bonCommandeId )

        async function fetchBonCommande() {
          try {
            const bonCommandeResponse = await axios.get(`http://localhost:3000/api/v1/bons-commandes/${bonCommandeId}`,{
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }) 
            console.log('ahawa : ', bonCommandeResponse.data)
            setCurrentBonCommande(bonCommandeResponse.data)
          }
          catch (error) {
            console.log(error)
          }
        }

        async function fetchData() {
          try {
            const response = await axios.get(`http://localhost:3000/api/v1/orderItem/bonCommande/${bonCommandeId}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
          
      
            const initialQuantities = await Promise.all(response.data.map( async (orderItem,index) => {
                const produitResponse = await axios.get(`http://localhost:3000/api/v1/produits/${orderItem.produitId}`,{
                    withCredentials: true,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  } )
                const order = {
                orderItemId: index+1,
                produit: produitResponse.data.nomProduit,
                class:produitResponse.data.class,
                type:produitResponse.data.type,
                quantity: orderItem.quantity,
                suite: orderItem.suiteCommande,
                unite: orderItem.unite
                };
                return order
              
            }));   
            setData(initialQuantities);
  
            console.log("response : ",response.data)
            console.log("initial quantities:", initialQuantities);
    
            /* The line `const updatedProducts = [{}].concat(initialQuantities);` is creating a new
            array called `updatedProducts` by concatenating an empty object `{}` with the
            `initialQuantities` array. This is done to add an empty object as the first element of
            the array, which can be useful in certain scenarios. */
            // const updatedProducts = [{}].concat(initialQuantities);
      
            
    
            
            // console.log("products after state update:", products);
          }
       
          catch(err) {
            console.log(err)
          }
        }

        
  useEffect(()=>{
    
    fetchData()
  },[])

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
  useEffect( () => {
    console.log("data changed! :",data);
    fetchBonCommande()
    // const bonCommandeResponse = await axios.get(`http://localhost:3000/api/v1/bons-commandes${bonCommandeId}`,{
    //   withCredentials: true,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // }) 
    // setCurrentBonCommande( bonCommandeResponse.data)
  
  }, [data]);

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

//   const handleChange = (productId) => (event) =>{
//     let newQuantity = event.target.value;
//     newQuantity = parseInt(newQuantity)
//     console.log("Updating quantity for product", productId, "to", newQuantity);
//     setProducts((prevProducts) => ({
//       ...prevProducts,
//       [productId]: {...prevProducts[productId],quantity:newQuantity}
//     }));
// //   }
//   const handleUnitChange = (productId) => (event) => {
//     let newUnit = event.target.value;
//     console.log(newUnit)
//     setProducts((prevProducts) => ({
//       ...prevProducts,
//       [productId]: {...prevProducts[productId],unite:newUnit}
//     }));

//   }

//   const handleSubmit = () => {
//     console.log(products)
//     Object.keys(products).forEach( index => {
//       if (index !== 0) {
//         console.log(`Product ID: ${products[index].productId}, Quantity: ${products[index].quantity}`);
        
//         axios.post('http://localhost:3000/api/v1/orderItem', {
//           bonCommandeId: bonCommandeId,
//           produitId: parseInt(products[index].productId),
//           quantity: products[index].quantity,
//           unite: products[index].unite
//         }, { withCredentials: true })
//         .then((response) => {
//           console.log(response);
//         })
//         .catch((err) => {
//           console.log(err);
//           setAllgood(false); // Set allGood to false if any error occurs
//         });
//       }
//     });
  
//     if (allgood) {
//       setLoading(true);
//       setTimeout(() => {
//         setSuccess(true);
//       }, 3000);
//     }
//   };
  

  const columns = [
    {
      id:2,
      field: "produit",
      headerName: "produit",
      flex: 0.75,
    }
    ];
    if (currentBonCommande.type === 'SUITE') {
      columns.push(
        {
        id:3,
        field: "suite",
        headerName: "SUITE",
        flex: 0.5,
        cellClassName:"quantity-column--cell"
        }
      )
    }
    else {
      columns.push(
        {
        id:3,
        field: "quantity",
        headerName: "quantity",
        flex: 0.5,
        cellClassName:"quantity-column--cell"
        })
    }
    columns.push(
      {
        id:4,
        field: "class",
        headerName: "class",
        flex: 0.5,
        renderCell: (params) => (
          <Box>
            <Chip variant="contained" label={params.row.class} sx={{
              background:classColors[params.row.class],
              color:'black'
            }}></Chip>
          </Box>
        )
  
      },
      {
        id:5,
        field:"type",
        headerName:"TYPE",
        flex:1,
        renderCell: (params) => (
          <Box>
            <Chip variant="contained" label={params.row.type} sx={{
              background:typeColors[params.row.type],
              color:'black'
            }}></Chip>
          </Box>
        )
        
      }
    )
  
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
      <Header title={message}  />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
        rows={data}
        columns={columns}
        getRowId={(row)=>row.orderItemId}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
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

export default Bcinfo;
