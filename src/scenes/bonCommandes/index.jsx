import { Box, Checkbox, FormControlLabel, IconButton, InputLabel, MenuItem, NativeSelect, Select, Switch, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/Auth";
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Check, CheckBox } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';


const BonsCommandes = () => {

 
  const navigate = useNavigate()
  
  const [data,setData] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated

  const [fabriq, setfabrique] = useState(false);
  const handleOpen1 = () => setfabrique(true);
  const handleClose1 = () => setfabrique(false);

  const [isChecked, setIsChecked] = useState(false);
  const [isPink, setIsPink] = useState(false);

  const [idChef,setIdChef] = useState(0)
  const [lesChefs,setLestChefs] = useState([])
  const [selectedRows,setSelectedRows] = useState([]);
  const handleSelectionChange = (newSelection)=>{
    setSelectedRows(newSelection);
    console.log(selectedRows)
  }

  const handleChange1 = (event) => {
    const newId = event.target.value;
    setIdChef(newId)
  }

  async function updateLivraison(idBonCommande) {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/bons-commandes/${idBonCommande}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Livraison updated successfully.');
      setData(prevData => {
        return prevData.map(item => {
          if (item.idBonCommande === idBonCommande) {
            return {
              ...item,
              livraison: true
            };
          }
          return item;
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleSwitchChange = async (bonCommandeId) => {
    try {
      updateLivraison(bonCommandeId)
      
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };

  const switchColor = isPink ? 'pink' : 'primary';

  const [showIconButton, setShowIconButton] = useState(true);
  const [iconButtonPosition, setIconButtonPosition] = useState(0); // Initial position

// Function to handle the icon button click
const handleIconButtonClick = (id) => {
  for (let i = 2; i < 20; i++) {
    setTimeout(() => {
      // Move the icon button to the right with the current value of `i`
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.idBonCommande === id) {
            // Update the attribute inside the matching object
            return {
              ...item,
              livraisonMargin: i, // Replace 'attributeName' and 'newValue' with your actual attribute name and new value
            };
          }
          return item; // Return unchanged objects
        });
      });
      
      
      // After setting the position, you can check if it's the last iteration (i === 19)
      // and hide the icon button if needed
      if (i === 19) {
        setTimeout(() => {
          handleSwitchChange(id);
        }, 200); // Wait 0.5 seconds before hiding
      }
    }, i * 50); // Wait 0.05 seconds before each position change
  }
};


 const handleLivraison = ((id) => {
  handleIconButtonClick(id);
  // handleSwitchChange(id);
  
 })

 async function handleAjout(){
  if (idChef) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/fabrication',{
        ChefGlacierId:idChef,
        bonCommandeIds:selectedRows
      },{
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      })

      navigate(`/fabrication`);
    }
    catch(err) {
      console.log(err)
    }    
}
}
    

  const columns = [
    {
      id:1,
      field: "idBonCommande",
      headerName: "id",
      flex: 0.15,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "name",
      headerName: "Point De Vente",
      flex: 0.35,
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date commande",
      flex: 0.25,
    },
    {
      id:4,
      field: "dateFabrication",
      headerName: "Date fabrication",
      flex: 0.25,
    },
    {
        id:5,
        field: "dateLivraison",
        headerName: "Date livraison",
        flex: 1,
        renderCell: (params) => (
            <Box 
            sx={{
              display:"flex",
              gap:5,
              alignItems:"center"
              
            }}
            >
              <Typography >
                {params.row.dateLivraison}
              </Typography>
              {/* <FormControlLabel
              sx={{
                
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.fabricationId !== null ? true : false}
                  onChange={() => handleSwitchChange(params.id)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200] }}
                    disabled

                />
              }
              label="fabriqué"
              /> */}
              <FormControlLabel
              sx={{
                
                color: colors.pinkAccent[400], // Apply the color based on the state
              }}
              control={
                <Checkbox
                  name="loading"
                 // Apply the color based on the state
                  checked={params.row.livraison}
                  onChange={() => handleSwitchChange(params.id)}
                   // Disable the switch once it's pressed
                   color="default"
                   sx={{
                    color:colors.pinkAccent[200] }}
                    disabled

                />
              }
              label="livré"
              />

              <Link to={`/bonCommande/info/${params.row.idBonCommande}`}>
                <Button sx={{
                  
                  color:colors.primary[100],
                  borderRadius:100
                }}> <InfoIcon /></Button>
              </Link>
              
              {
                !params.row.livraison && (
                  <IconButton
                  onClick={() => {
                    handleLivraison(params.id)
                  }}
                  sx={{
                    ml:params.row.livraisonMargin,
                    color:colors.pinkAccent[400],
                    '&:hover': {
                      color: colors.pinkAccent[400], // Change the background color on hover
                    },
                  }}
                  >
                    <LocalShippingIcon />
                  </IconButton>
                )
              }
              
              
              
              

            </Box>
            )
    },

  ];
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/bons-commandes", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const updatedOrders = await Promise.all(response.data.map(async (order) => {
         

          const commandeResponse = await axios.get(`http://localhost:3000/api/v1/commandes/bonCommande/${order.idBonCommande}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

           // Fetch user data by ID
           const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${commandeResponse.data[0].idPointVente}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const dateFabricationChey7a = commandeResponse.data[0].dateFabrication
          const dateFabrication = dateFabricationChey7a.split('T')[0];

          const dateCommandeChey7a = commandeResponse.data[0].dateCommande;
          const dateCommande = dateCommandeChey7a.split('T')[0];
          const dateLivraisonChey7a = order.dateLivraison;
          const dateLivraison = dateLivraisonChey7a.split('T')[0]
          
          const orderWithUserName = {
            idBonCommande: order.idBonCommande,
            dateCommande: dateCommande,
            dateLivraison: dateLivraison,
            dateFabrication:dateFabrication,
            name: userResponse.data.nomUtilisateur,
            livraison:order.livraison,
            fabricationId:order.fabricationId,
            livraisonMargin:0
          };
          console.log("commande :",commandeResponse.data[0])
          return orderWithUserName;
        }));
  
        setData(updatedOrders);
        console.log("global data in ! ")
      } catch (err) {
        console.log(err);
      }
    }

    async function getChefs() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const updatedChefs = await Promise.all(response.data.map(async (user) => {
          if (user.role === "CHEF_GLACIER") {
            const chef = {
              id: user.idUtilisateur,
              nom: user.nomUtilisateur,
            };
            return chef;
          }
          else {
            return null;
          }
         
        }));
        const filteredChefs = updatedChefs.filter(chef => chef !== null);
        setLestChefs(filteredChefs);
      } catch (err) {
        console.log(err);
      }
    }
    
    getData();
    getChefs();
    

  }, []);

  useEffect(() => {
    console.log("data ; ",data)
  },[data])

  return (
    <Box ml="20px" mt="20px">
      <Box display="flex">
        <Header title="Bon Commandes "  /> 
        <Box
        display="flex"
        marginLeft="600px"
        height="50px"
       
        >
        <Button  variant="outlined" sx={{
              "&:hover":{color:colors.greenAccent[600],borderColor:colors.greenAccent[600]},
              marginRight:"20px",
              borderColor:colors.primary[100],
              backgroundColor:"transparent",
              color:colors.primary[100]
            }}
            >
              <AddIcon />
              ADD
          </Button>
          
          <Button  variant="outlined"  sx={{
              "&:hover":{color:colors.redAccent[600],borderColor:colors.redAccent[600]},
              backgroundColor:"transparent",
              color:colors.primary[100]
            }}
            >
              <DeleteIcon />DELETE
          </Button>
          <Button  onClick={handleOpen1} variant="outlined" sx={{
              "&:hover":{color:colors.blueAccent[600],borderColor:colors.blueAccent[600]},
              marginLeft:"20px",
              borderColor:colors.primary[100],
              backgroundColor:"transparent",
              color:colors.primary[100]
            }}
            >
              <AddIcon />
              Fabrication
          </Button>
          <Modal
            open={fabriq}
            onClose={handleClose1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                <Typography>
                  Choisir Chef Glacier
                </Typography>
                <Box sx={{
                  display:'flex',
                  mt:2,
                  gap:5,
                }}>
                    {lesChefs.length>0 &&  (<Box>
                  <InputLabel htmlFor="uncontrolled-native">Select Chef</InputLabel>
                  <Select
                    defaultValue={idChef} 
                    onChange={handleChange1}
                    inputProps={{
                      name: 'idChef',
                      id: 'uncontrolled-native',
                    }}
                  >               
                        {lesChefs.map((chef,index) => (
                            <MenuItem key={chef.id} value={chef.id}>
                              {chef.nom}
                            </MenuItem>
                          ))}
                  </Select>
                  </Box>)}
                  <Button onClick={handleAjout} variant="contained" style={{ backgroundColor: colors.pinkAccent[400],maxHeight: 50,marginTop:18, color: 'white' }}>
                    Ajouter Fabrication
                  </Button>
                </Box>
                
              </Box>
          </Modal>
        </Box> 
        

      </Box>
     

      <Box
        m="40px 10px 0 0"
        height="75vh"
       
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400]

          },
          "& .MuiDataGrid-cell": {
            borderColor: colors.primary[300]
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
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid 
        checkboxSelection
        onSelectionModelChange={handleSelectionChange}
        density="comfortable"
        getRowId={(row)=>row.idBonCommande}
        rows={data} 
        columns={columns} 
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default BonsCommandes;
