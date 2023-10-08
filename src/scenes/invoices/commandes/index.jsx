import { Alert, Box, CircularProgress, InputLabel, Select, Snackbar, TextField, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../../contexts/Auth"
import axios from "axios"
import { MenuItem } from "react-pro-sidebar";
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory from react-router

const CommandeInfo = () => {
   
      const params = useParams();
      const commandeId = parseInt(params.id);
        const authCtx = useContext(AuthContext)
        const token = authCtx.isAuthenticated;
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const [data,setData] = useState([]);
        // const [products,setProducts] = useState([])
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();

        const message = ("Information commande n°"+ commandeId )
        async function fetchData() {
          try {
            
                const bonCommandeResponse = await axios.get(
                  `http://localhost:3000/api/v1/bons-commandes/commande/${commandeId}`,
                  {
                    withCredentials: true,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  }
                );
        
                const quantities = await Promise.all(
                  bonCommandeResponse.data.map(async (bonCommande) => {
                    const orderItemsResponse = await axios.get(
                      `http://localhost:3000/api/v1/orderItem/bonCommande/${bonCommande.idBonCommande}`,
                      {
                        withCredentials: true,
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        }
                      }
                    );
        
                    const orderItemData = await Promise.all(
                      orderItemsResponse.data.map(async (orderItem) => {
                        // Fetch the produit details using idProduit
                        const produitResponse = await axios.get(
                          `http://localhost:3000/api/v1/produits/${orderItem.produitId}`,
                          {
                            withCredentials: true,
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            }
                          }
                        );
        
                        return {
                          orderItemId: orderItem.idOrderItem,
                          produit: produitResponse.data.nomProduit, // Add nomProduit
                          class: produitResponse.data.class,
                          type:produitResponse.data.type,
                          quantity: orderItem.quantity,
                          suite: orderItem.suiteCommande,
                          unite: orderItem.unite
                        };
                      })
                    );
        
                    return orderItemData;
                  })
                );
        
             
        
            // Flatten the nested arrays for all Commandes
            const allQuantitiesFlat = quantities.flat();
        
            // Group and aggregate quantities by product and unite
            const aggregatedQuantities = allQuantitiesFlat.reduce((result, current) => {
              const key = `${current.produit}-${current.unite}`;
              if (!result[key]) {
                result[key] = {
                  produit: current.produit,
                  class: current.class,
                  type: current.type,
                  unite: current.unite,
                  quantity: 0,
                  suiteC:0,
                };
              }
              result[key].quantity += current.quantity;
              result[key].suiteC += current.suite;
              return result;
            }, {});
        
            // Convert the aggregated quantities into an array
            const aggregatedQuantitiesArray = Object.values(aggregatedQuantities);

            // Add an index to each aggregated item
            const aggregatedQuantitiesWithIndex = aggregatedQuantitiesArray.map((item, index) => ({
              index: index+1, // Set the index as the key
              produit: item.produit,
              class: item.class,
              type: item.type,
              unite: item.unite,
              quantity: item.quantity,
              suiteC: item.suiteC,
            }));
        
            console.log("aggregated quantities:", aggregatedQuantitiesWithIndex);
        
            setData(aggregatedQuantitiesWithIndex);
          } catch (err) {
            console.log(err);
          }
        }
        
          
        
  useEffect(()=>{
    
    fetchData()
  },[])


  useEffect(() => {
    console.log("data changed! :",data);
    setLoading(false)
  }, [data]);

  

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
      id:1,
      field: "index",
      headerName: "id",
      flex: 0.25,
      
    },
    {
      id:2,
      field: "produit",
      headerName: "Produit",
      flex: 1,
      cellClassName:"quantity-column--cell"
    },
    {
      id:3,
      field: "quantity",
      headerName: "Quantité",
      flex: 0.5,
      cellClassName:"quantity-column--cell"
     
    },
    {
      id:4,
      field: "suiteC",
      headerName: "Suite Commande",
      flex: 0.5,
      cellClassName:"quantity-column--cell"

    },
    {
      id:5,
      field: "class",
      headerName: "class",
      flex: 0.5,

    },
    {
      id:6,
      field:"type",
      headerName:"TYPE",
      flex:1,
    }
    ];
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
        checkboxSelection
        rows={data}
        columns={columns}
        getRowId={(row)=>row.index}
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
);
};

export default CommandeInfo;
