import { AuthContext } from "../../contexts/Auth";
import { useEffect, useContext, useState } from "react";
import { Box, Grid, CircularProgress, Fab, Modal, TextField, Button, Select, InputLabel, MenuItem, FormControl, Typography } from "@mui/material";
import IceCreamCard from "../../components/flavorCard";
import axios from "axios";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authCtx = useContext(AuthContext);
    const token = authCtx.isAuthenticated;
    const [products, setProducts] = useState([]);
    const [hiddenProducts, setHiddenProducts] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [corbeil,setCorbeil] = useState(false);
    const openCorbeil  = () => setCorbeil(!corbeil);
    const closeCorbeil  = () => setCorbeil(false);


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [produit,setProduit] = useState({
        nomProduit:"",
        type:"",
        class:""
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // Use the spread operator to create a new state object with the updated property
        setProduit((prevState) => ({
          ...prevState,
          [name]: value, // Update the property dynamically based on the input name
        }));
      };

      const handleRemove = (idProduit) => {
        const updatedProducts = products.filter((produit) => produit.idProduit !== idProduit );
        setProducts(updatedProducts)
      }

    const handleClick = () => {
        if (produit && produit.nomProduit && produit.class && produit.type) {
            axios.post('http://localhost:3000/api/v1/produits',{
                nomProduit:produit.nomProduit,
                type:produit.type,
                class:produit.class,
            },{withCredentials:true})
            .then((response)=> {
                console.log(response.data) 
                setProducts((prevProducts) => [...prevProducts, response.data]);
                // Close the modal
                handleClose();
            })
            .catch((err)=> {
                console.log(err)
                
            })
        }
    }
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
      const response = await axios.get("http://localhost:3000/api/v1/produits/nothidden", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setLoading(false); // Data fetched, set loading to false
    } catch (err) {
      console.log(err);
    }
  }

  async function getCorbeil() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/produits/hidden", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setHiddenProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const restore = async (id) =>{
    let i = parseInt(id);
    try {
        const response = await axios.patch(`http://localhost:3000/api/v1/produits/${i}`,{
      hidden:false
    })
    closeCorbeil()
  }catch(err){
    console.log(err);
  }
  }

  useEffect(() => {
    fetchData();
    getCorbeil();
  }, []);

  const productsByTypeAndClass = products.reduce((acc, product) => {
    if (!acc[product.type]) {
        acc[product.type] = {};
    }
    if (!acc[product.type][product.class]) {
        acc[product.type][product.class] = [];
    }
    acc[product.type][product.class].push(product);
    return acc;
}, {});

// Render products by type and class
const renderProductsByTypeAndClass = () => {
    return Object.entries(productsByTypeAndClass).map(([type, classes]) => (
        <div key={type}>
            <Typography variant="h1" sx={{marginTop: theme.spacing(5),color:colors.redAccent[400]}}>{type}</Typography>
            {Object.entries(classes).map(([className, productsOfClass]) => (
                <div key={className}>
                    <Typography variant="h2"
                      sx={{
                        marginTop: theme.spacing(5),
                        color:colors.greenAccent[400],
                        mr:10
                      }}
                    >{className}</Typography>
                    <Grid container spacing={3}>
                        {productsOfClass.map((product) => (
                            <Grid item key={product.idProduit} xs={12} sm={6} md={4} lg={3}>
                                <IceCreamCard
                                    flavorName={product.nomProduit}
                                    flavorClass={product.class}
                                    flavorType={product.type}
                                    isAvailable={product.availability}
                                    flavorId={product.idProduit}
                                    removeProduit={handleRemove}
                                />
                            </Grid>
                        ))}
                        <Fab
                            onClick={handleOpen} sx={{
                              color: colors.pinkAccent[400],
                              background: colors.primary[400],
                              marginTop: theme.spacing(10), // Add margin-top to the button
                              marginLeft: theme.spacing(15)
                            }} 
                            aria-label="add"
                        >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="36"
                              height="36"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </Fab>
                    </Grid>
                </div>
            ))}
        </div>
    ));
};


  return (
    <Box margin={3} >
        <>
        <AutoDeleteIcon
          sx={{
            color: colors.pinkAccent[400],
            fontSize: '32px', // Increase the font size to make it bigger
            float: 'right', // Align the icon to the right
            marginTop: theme.spacing(1), // Add margin-top to the button
            marginRight: theme.spacing(1), // Add margin-right to the button
          }}
          onClick={openCorbeil}
        />
        {renderProductsByTypeAndClass()}


    <Modal
      open={corbeil}
      onClose={closeCorbeil}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, // Adjust the width as needed
        backgroundColor: colors.blueAccent[600], // Replace with your desired background color
        border: '2px solid #000',
        // boxShadow: 24,
        borderRadius: '30px',
      }}
    >
      <Box>
        <h2 style={{textAlign:'center'}}>Corbeille</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Product Class</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hiddenProducts.map((product) => (
                <TableRow key={product.idProduit}>
                  <TableCell>{product.nomProduit}</TableCell>
                  <TableCell>{product.class}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        restore(product.idProduit);
                      }}
                    >
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>


          <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >     
          <Box sx={style}>
            <TextField 
            name="nomProduit"
            onChange={handleChange}
            sx={{
                marginBottom:2,
                marginTop:3,
                color: colors.pinkAccent[400], // Use the custom color from the palette
                '&.Mui-focused': {
                    borderColor: colors.pinkAccent[400], // Use the custom color for focused state
                },
            }} 
            label="Nom Produit" 
            variant="standard" 
            fullWidth 
            >
            </TextField>
            <FormControl fullWidth variant="standard" sx={{ minWidth: 120,marginBottom:2 }}>
                <InputLabel id="type-id-label">Type</InputLabel>
                <Select
                name="type"
                onChange={handleChange}
                labelId="type-id-label"
                id="type-id"
                label="type"
                >
                    <MenuItem value={"PARFUM"}>parfum</MenuItem>
                    <MenuItem value={"FOURNITURE"}>fourniture</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" sx={{ minWidth: 120,marginBottom:2 }}>
                <InputLabel id="class-id-label">Class</InputLabel>
                <Select
                name="class"
                onChange={handleChange}
                labelId="class-id-label"
                id="class-id"
                label="class"
                >
                    <MenuItem value={"NORMAL"}>Normal</MenuItem>
                    <MenuItem value={"GRANITE"}>Granite</MenuItem>
                    <MenuItem value={"ICE_POPS"}>Ice pops</MenuItem>
                    <MenuItem value={"HAPPY_POPS"}>Happy pops</MenuItem>
                    <MenuItem value={"DOMES"}>Domes</MenuItem>
                </Select>
            </FormControl>
            <Button
            onClick={handleClick}
            sx={{
                background:colors.pinkAccent[300],
                color:colors.primary[100],
                mt:8,
                
            }}>Ajouter Produit</Button>

            
          </Box>
          </Modal>
        </>
    </Box>
  );
};


export default Products;
