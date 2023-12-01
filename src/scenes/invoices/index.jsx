import { Box, Checkbox, Fab, FormControlLabel, Icon, IconButton, InputLabel, MenuItem, NativeSelect, Select, TextField, Typography, useTheme } from "@mui/material";
import { Button } from '@mui/material';
import React from 'react'
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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
const Invoices = () => {
  
  const navigate = useNavigate()
  const [data,setData] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const role = authCtx.role
  const id = authCtx.id
  const [pdv,setPdv] = useState({});
  const getPdv = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/api/v1/pointsVentes/${authCtx.id}`,{
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      })
      setPdv(response.data)
    }catch(err){

    }
  }

   // for the soorttt arrow 
 const [sortModel, setSortModel] = React.useState([{ field: 'dateCommande', sort: 'desc' }]);
 const handleSortModelChange = (newModel) => {
   setSortModel(newModel);
 };


//selected rows for delete all
const [selectedRows, setSelectedRows] = useState([]);
const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);


const handleSelectionChange = (newSelection) => {
  console.log('New selection aaa:', newSelection);
  setSelectedRows(newSelection);

  setIsAnyRowSelected(newSelection.length > 0);

  console.log('Current 11:', newSelection);
  console.log('Current 22:', newSelection.length > 0);
};
//notif
const sendNotification = async (idCommande) => {
  try {
    console.log('Sending notification...');
    const response = await axios.patch(
      `http://localhost:3000/api/v1/commandes/notif/${idCommande}`,
      { text: 'bon livraison créé', userId: pdv[0]?.userId },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    console.log('Notification sent successfully!', response.data);
    // getData(); 
  } catch (error) {
    console.error('Error sending notification:', error);

    
  }
};

const handleCreateLivraison = async (idCommande) => {
  try {
    // Assuming that you have a property named 'livraison' in your DataGrid rows
    const updatedOrders = data.map((order) =>
      order.idCommande === idCommande ? { ...order, livraison: true } : order
    );

    
    setData(updatedOrders);

    // Make the axios patch request as before
    await axios.patch(
      `http://localhost:3000/api/v1/commandes/${idCommande}`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Send notification
    await sendNotification(idCommande);

    
    setData((prevData) =>
      prevData.map((order) =>
        order.idCommande === idCommande ? { ...order, livraison: true } : order
      )
    );
  } catch (error) {
    console.log(error);
  }
};





//delete commande
const handleDelete = async (idCommande) => {
  try {
    
    await axios.delete(`http://localhost:3000/api/v1/commandes/${idCommande}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    setData((prevData) => prevData.filter((row) => row.idCommande !== idCommande));
    console.log('Row deleted successfully.');
  } catch (error) {
    console.error('Error deleting row:', error);
    
  }
};

//delete all 
const handleDeleteAll = async () => {

console.log('selectedRows:', selectedRows);

if (!isAnyRowSelected) {
  console.log('No rows selected to delete.');
  return;
}

try {
  console.log('IDs:', selectedRows);

  await axios({
    method: 'delete',
    url: 'http://localhost:3000/api/v1/commandes/delete-multiple',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: { ids: selectedRows }, 
  });
  
  setData((prevData) => prevData.filter((row) => !selectedRows.includes(row.idCommande)));

  console.log('Rows deleted successfully.');
  setSelectedRows([]);
  setIsAnyRowSelected(false);
} catch (error) {
  console.error('Error deleting rows:',data, error);
}
};

//state commande for l indication
const handleViewCommand = async (commandId) => {
  try {
    
    await axios.patch(`http://localhost:3000/api/v1/commandes/state/${commandId}`, {
      state: 'seen',
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    // ne9sek setState hne bech ysir lupdate fil page

    
  } catch (error) {
    console.error(error);
   
  }
};


  const columns = [
    
   
    
    {
      id:1,
      field: "reference",
      headerName: "Reference",
      flex: 0.25,
      sortable: false,
      cellClassName: "name-column--cell",
      
    },
   
    {
      id:2,
      field: "name",
      headerName: "Point De Vente",
      flex: 0.5,
      sortable: false,
      cellClassName: "point-column--cell"
    },
    {
      id:3,
      field: "dateCommande",
      headerName: "Date",
      flex: 0.5,
      renderCell: (params) => (
        <Box 
        sx={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
          
        }}
        
        >  <Typography>{params.row.dateCommande.toLocaleDateString()}</Typography> </Box>)
    },
    {
      id:4,
      field:'fabrication',
      headerName: "Fabrication",
      flex: 0.25,
      cellClassName: "point-column--cell",
      renderCell: (params) => (
        <Box 
          display='flex'
          flexDirection='row'
          gap={5}
          >
              {params.row.checkFabrication? ( <Icon><ThumbUpAltIcon /></Icon>):(<Icon><CloseIcon /></Icon>)}
              {/* {params.row.livraison? ( <Icon><ThumbUpAltIcon /></Icon>):(<Icon><CloseIcon /></Icon>)} */}
        </Box>
      )
    },


    {
      id: 5,
      field: 'livraison',
      headerName: "Livraison",
      flex: 0.25,
      cellClassName: "point-column--cell",
      renderCell: (params) => (
        <Box
          display='flex'
          flexDirection='row'
          gap={5}
        >
          {params.row.livraison ? (
            role === 'RESPONSABLE_LOGISTIQUE' ? (
              <Link to={`/livraison/info/${params.row.idCommande}`}>
                <Button
                  sx={{
                    color: 'black',
                    background: '#70D8BD',
                    border: 1,
                    borderColor: colors.primary[400],
                    "&:hover": {
                      borderColor: 'green',
                      color: 'green',
                      background: colors.primary[500]
                    }
                  }}
                >
                  Afficher
                </Button>
              </Link>
            ) : (
              <Icon>
                <ThumbUpAltIcon />
              </Icon>
            )
          ) : (
            role === 'RESPONSABLE_LOGISTIQUE' ? (
              <Button
                sx={{
                  color: colors.primary[100],
                  background: colors.primary[400],
                  border: 1,
                  borderColor: colors.primary[400],
                  "&:hover": {
                    borderColor: colors.pinkAccent[400],
                    color: colors.pinkAccent[400],
                    background: colors.primary[500]
                  }
                }}
                onClick={() => handleCreateLivraison(params.row.idCommande)}
              >
                Créer
              </Button>
            ) : (
              <Icon>
                <CloseIcon />
              </Icon>
            )
          )}
        </Box>
      )
    },
    

    // {
    //   id:5,
    //   field:'livraison',
    //   headerName: "Livraison",
    //   flex: 0.25,
    //   cellClassName: "point-column--cell",
    //   renderCell: (params) => (
    //     <Box 
    //       display='flex'
    //       flexDirection='row'
    //       gap={5}
    //       >
    //           {params.row.livraison? ( 
    //               <Link to={`/livraison/info/${params.row.idCommande}`}>
    //               <Button sx={{
    //                 color: 'black',
    //                   background: '#70D8BD',
    //                   border:1,
    //                   borderColor:colors.primary[400],
    //                   "&:hover":{
    //                     borderColor:'green',
    //                     color:'green',
    //                     background: colors.primary[500]                }
    //             }}
    //             >
    //               Afficher
    //              </Button>
    //              </Link>
    //           ):(
    //             <Button sx={{
    //               color: colors.primary[100],
    //                 background: colors.primary[400],
    //                 border:1,
    //                 borderColor:colors.primary[400],
    //                 "&:hover":{
    //                   borderColor:colors.pinkAccent[400],
    //                   color:colors.pinkAccent[400],
    //                   background: colors.primary[500]                }
    //           }}
    //           onClick={() => handleCreateLivraison(params.row.idCommande)}
    //           >
    //             Créer
    //            </Button>
    //           )}
    //     </Box>
    //   )
    // },
    



    {
      id: 6 ,
      headerName: "Action",
      flex: 0.25,
      renderCell: (params) =>  <Box sx={{
        float:"right"
      }}>
  <Link to={`/commande/${params.row.idCommande}`}>

    <IconButton
    variant="outlined"
    sx={{
      backgroundColor:colors.primary[400],
      color:colors.primary[100],
      "&:hover": {
        backgroundColor: colors.button[100], // Change background color on hover
        color: colors.button[200], // Change text color on hover
      },
    }}
    onClick={() => {
      if (role === 'RESPONSABLE_LOGISTIQUE') {
        handleViewCommand(params.row.idCommande);
      }}}
    >
  
        <RemoveRedEyeIcon />
    
    </IconButton>
    
   
  </Link>

  <Link>
  {role === 'POINT_DE_VENTE' && (
  <IconButton
  variant="outlined"
  sx={{
    marginLeft:2,
    backgroundColor:colors.primary[400],
    color:colors.primary[100],
    "&:hover": {
      backgroundColor: colors.button[100], // Change background color on hover
      color: colors.button[200], // Change text color on hover
    },
  }}
  onClick={(event) => {
    event.preventDefault(); 
    event.stopPropagation(); 
    handleDelete(params.row.idCommande);
  }}
  >

      <DeleteIcon />

  </IconButton>
  )}
  {role === 'RESPONSABLE_LOGISTIQUE' && (
  <Box
    sx={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: (() => {
        if (params.row.state === 'new') {
          return 'green';
        } else if (params.row.state === 'updated') {
          return 'red'; 
        } else {
          return 'grey'; 
        }
      })(),
      marginLeft: '5px',
      display: 'inline-block',
    }}
  ></Box>
)}

  </Link>
  </Box>,
    },
    

  

  ];
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/commandes", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const filteredCommandes = role === 'POINT_DE_VENTE'
        ? response.data.filter((commande) => commande.idPointVente === id )
        : response.data
        const updatedOrders = await Promise.all(filteredCommandes.map(async (order) => {
          // Fetch user data by ID
          const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${order.idPointVente}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const date = order.dateCommande
          const dateOnly = date.split('T')[0]
          console.log(order)
          let fabricationCheck
          let check = false
          if (order.fabricationId !== null) {
            fabricationCheck = await axios.get(`http://localhost:3000/api/v1/fabrication/${order.fabricationId}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }) 
          check = fabricationCheck.data.validationFabrication
          }
          const orderWithUserName = {
            idCommande: order.idCommande,
            reference : order.refBC,
            dateCommande: new Date(order.dateCommande),
            fabricationId: order.fabricationId,
            checkFabrication: check,
            livraison:order.livraison,
            name: userResponse.data.nomUtilisateur ,
            state:order.state
          };
  
          return orderWithUserName;
        }));
  
        setData(updatedOrders.sort((a, b) => b.dateCommande - a.dateCommande));
        console.log("global data in ! ")
      } catch (err) {
        console.log(err);
      }
    }
    
  
    getData();
 
    

  }, []);

  useEffect(() => {
    console.log('data changed :',data)
  },[data])
  
  
  
  


  return (
    <Box ml="20px" mt="20px">
      <Box display='flex' justifyContent='space-between'>
      <Header title=" Commandes "  /> 
        {/* {(role === 'POINT_DE_VENTE') && (
          <Button sx={{
              color: colors.primary[100],
                background: colors.primary[400],
                marginRight:5,
                border:1,
                borderColor:colors.primary[400],
                "&:hover":{
                  borderColor:colors.pinkAccent[400],
                  color:colors.pinkAccent[400],
                  background: colors.primary[500]                }
          }}
          >
            <AddIcon/>
            Nouvelle Commande
           </Button>
          // <Fab 
          // sx={{
          //     color: colors.pinkAccent[400],
          //     background: colors.primary[400],
          //     marginLeft:15
          // }} 
          // aria-label="add"  
          // onClick={handleClick}
          // >
          //   <svg
          //     xmlns="http://www.w3.org/2000/svg"
          //     width="36"
          //     height="36"
          //     viewBox="0 0 24 24"
          //     fill="none"
          //     stroke="currentColor"
          //     strokeWidth="2"
          //     strokeLinecap="round"
          //     strokeLinejoin="round"
          //   >
          //     <line x1="12" y1="5" x2="12" y2="19"></line>
          //     <line x1="5" y1="12" x2="19" y2="12"></line>
          //   </svg>
          // </Fab>
        )
          
        } */}


 {/* Delete All */}
 {(role === 'POINT_DE_VENTE') && (
         <Button
         sx={{
           color: colors.pinkAccent[400],
           background: colors.primary[400],
           marginRight: 5,
           border: 1,
           borderColor: colors.primary[400],
           "&:hover": {
             borderColor: colors.pinkAccent[400],
             color: colors.pinkAccent[400],
             background: colors.primary[500],
           },
         }}
         onClick={() => {
           
           handleDeleteAll();
         }}
       >
         <DeleteIcon />
         Supprimer Tout
       </Button>
       
        )}


      </Box>
        
     

      <Box
        m="40px 10px 0 0"
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
  getRowId={(row) => row.idCommande}
  columns={columns}
  checkboxSelection
  onSelectionModelChange={handleSelectionChange}
  components={{ Toolbar: GridToolbar }}
  slotProps={{
    toolbar: {
      showQuickFilter: true,
    },
  }}
  sortingOrder={['asc', 'desc']}
  sortModel={sortModel}
  onSortModelChange={handleSortModelChange}
/>
      
      </Box>
    </Box>
  );
};

export default Invoices;