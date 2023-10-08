import {  Box, Fab, TextField, Typography, useTheme, Button } from "@mui/material";
import Modal from '@mui/material/Modal';
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../contexts/Auth"
import axios from "axios"
import Header from "../../components/Header";
import OrderItemForm from "./bonCommandeCard";
import { Link, useParams } from "react-router-dom";


const AddCommande = () => {
   
         const params = useParams();
         const idCommande = params.id;
         const authCtx = useContext(AuthContext)
         const token = authCtx.isAuthenticated;
         const role = authCtx.role;
         const theme = useTheme();
         const colors = tokens(theme.palette.mode);
         const [data,setData] = useState()
         const [updated,setUpdated] = useState()
         const [name, setName] = useState('');
         const [bonsCommandes,setBonCommandes] = useState([])
         const [dateLiv,setDateLiv] = useState('')
         const [open, setOpen] = useState(false);
         const [pdv,setPdv] = useState([]);
         const handleOpen = () => setOpen(true);
         const handleClose = () => setOpen(false);
         const handleCreateLivraison = (async () => {
          try {
            const response = await axios.patch(`http://localhost:3000/api/v1/commandes/${idCommande}`,{
              withCredentials:true,
              headers:{
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
              }
            })
            setData({...data,livraison:true})
          }
          catch (error) {
            console.log(error)
          }
         })
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

          const getPdv = async () => {
            try{
              const response = await axios.get(`http://localhost:3000/api/v1/pointsVentes/${authCtx.id}`)
              setPdv(response.data)
            }catch(err){

            }
          }

          const handleChange = (event) => {
            const date = event.target.value;
            const originalDate = new Date(date);
            const formattedDate = originalDate.toISOString();
            setDateLiv(formattedDate)
          }
          const handleClick = async () => {
            try {
              let type="NORMAL"
              if (bonsCommandes.length === 1) {
                type="SUITE" 
              }
               const response = await axios.post('http://localhost:3000/api/v1/bons-commandes',{
                 commandeId:parseInt(idCommande),
                 dateLivraison:dateLiv,
                 type:type
                 },{
                 withCredentials: true,
                 headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
                 }
               })
               const newBonCommande = {
                  idBonCommande: response.data.idBonCommande,
                  dateLivraison: dateLiv
                };
                setBonCommandes(prevBons => [...prevBons, newBonCommande])
               handleClose()
             }
             catch(err) {
               console.log(err)
             }
          }
         
         async function getNom(id) {
            try {
               const response = await axios.get(`http://localhost:3000/api/v1/users/${id}`, {
               withCredentials: true,
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
               }
             });
             console.log("getNomFunction")
             return response.data.nomUtilisateur;
            }
            catch(err) {
               console.log(err)
            }
            
           }

         //   async function updateData() {
         //    const dateCommande = new Date(data.dateCommande);
         //    const dateFabrication = new Date(data.dateFabrication);
         //    try {
         //       const name = await getNom(data.idPointVente)
         //       const newData = {
         //          ...data,
         //          dateCommande: dateCommande.toISOString().split('T')[0],
         //          dateFabrication: dateFabrication.toISOString().split('T')[0],
         //          name:name
         //       }
         //       console.log("zeby",newData)
         //      setData(newData)
               
         //    }
         //    catch (err) {

         //    }

            
           
          
         //   }


         useEffect(() => {
            async function fetchData() {
              try {
                const response = await axios.get(`http://localhost:3000/api/v1/commandes/${idCommande}`, {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });
                setData(response.data);
              } catch (err) {
                console.log(err);
              }
            }

            async function getBonCommandeByCommandeId(){
               try{
                  const response = await axios.get(`http://localhost:3000/api/v1/bons-commandes/commande/${idCommande}`,{
                     withCredentials: true,
                     headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                     }
                   });
                   const bons = response.data.map((bon) => ({
                     idBonCommande:bon.idBonCommande,
                     dateLivraison:bon.dateLivraison,
                     type:bon.type
                   }));
                   setBonCommandes(bons)
               }
               catch(err){

               }
            }
          
            fetchData();
            getBonCommandeByCommandeId();
          }, [idCommande, token]);
          useEffect(()=>{
            getPdv();
          },[])
          useEffect(() => {
            console.log("testMAhboul:",bonsCommandes)
          },[bonsCommandes])

          useEffect(() => {
            async function fetchUserName() {
              if (data && data.idPointVente) {
                try {
                  const updatedName = await getNom(data.idPointVente);
                  setName(updatedName);
                } catch (err) {
                  console.log(err);
                }
              }
            }
          
            fetchUserName();
          }, [data]);
         
          useEffect(() => {
            if (data && data.dateCommande && data.dateFabrication) {
              const dateCommande = new Date(data.dateCommande);
              const dateFabrication = new Date(data.dateFabrication);
          
              const updatedData = {
                ...data,
                dateCommande: dateCommande.toISOString().split('T')[0],
                dateFabrication: dateFabrication.toISOString().split('T')[0],
                name: name
              };
          
              setUpdated(updatedData);
            }
          }, [data, name]);
          
          
        
  
 return (
  <Box m={5} sx={{
   display:'flex'
  }}>
      <Box>
         <Header title={"Modification"} subtitle={"commande n°"+params.id} />
         
         {updated && updated.dateCommande && updated.dateFabrication && updated.name &&(
            <Box
            sx={{
               display:"flex",
               flexDirection:"column",
               gap: '16px', // Adjust the spacing as needed
               width: '450px',
               
               
            }}
            >
         <TextField
            InputLabelProps={{ shrink: true }}
            label="Date Commande"
            type="date"
            variant="filled"
            color="success"
            value={updated.dateCommande}
            disabled
         />
         <TextField 
         label="Point De Vente" 
         variant="filled" 
         color="success" 
         value={updated.name}
         disabled
         />
         <TextField 
         InputLabelProps={{ shrink: true }} 
         label="Date Fabrication" 
         type="date" 
         variant="filled" 
         color="success" 
         value={updated.dateFabrication}
         disabled
         />
         <Box
          display="flex"
          alignItems="center"
         >
          <Button
          variant="contained"
          sx={{
            marginTop:10,
            background:colors.button[100],
            color:colors.button[200],
            maxWidth:100,
            '&:hover': {
              background: colors.button[200], // Set the background color to be the same as normal
              color: colors.button[100], // Set the text color to be the same as normal
            },
          }}
          >
            Sauvegarder
          </Button>
          {(data.livraison) && (
            <Link to={`/livraison/info/${idCommande}`}>
              <Button
            variant="contained"
            sx={{
              marginTop:10,
              marginLeft:3,
              background:colors.button[100],
              color:colors.button[200],
              maxWidth:150,
              '&:hover': {
                background: colors.button[200], // Set the background color to be the same as normal
                color: colors.button[100], // Set the text color to be the same as normal
              },
            }}
            >
              Voir Bon Livraison
            </Button>
            </Link>
          
          )}
          {(role !== 'POINT_DE_VENTE') && (data.livraison === false) && (
            <Box
              display="flex"
              alignItems="center"
            >
              <Button
              onClick={handleCreateLivraison}
              variant="contained"
              sx={{
                marginTop:10,
                marginLeft:5,
                background:colors.button[100],
                color:colors.button[200],
                maxWidth:150,
                '&:hover': {
                  background: colors.button[200], // Set the background color to be the same as normal
                  color: colors.button[100], // Set the text color to be the same as normal
                },
              }}
              >
                Créer Bon Livraison
              </Button>
              
            </Box>
          )
            
          }
         </Box>
        
         </Box>
         
         )}
               
               
         </Box>
      
      <Box 
      sx={{
         marginLeft:25,
         
      }}
      display="flex"
      flexDirection="column"
      gap={5}
      >
         {
         bonsCommandes &&
         bonsCommandes[0] &&
         bonsCommandes.map((bon,index) => (
            <OrderItemForm 
            key={bon.idBonCommande}
               id={bon.idBonCommande}
             index={index} 
             date={bon.dateLivraison}
             type={bon.type} />
         ))
         }
         
         
         <Box textAlign="center" marginTop="16px">
      <Fab 
        sx={{
            color: colors.pinkAccent[400],
            background: colors.primary[400],
        }} 
        aria-label="add" 
        onClick={handleOpen} 
        disabled={bonsCommandes.length === 2 && pdv.allowSuite==true}
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
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>
                Choisir Date Livraison
              </Typography>
              <Box sx={{
                display:'flex',
                mt:2,
                gap:5,
              }}>
                <TextField type="date" onChange={handleChange}>
                  
                </TextField>
                <Button variant="contained" style={{ backgroundColor: colors.pinkAccent[400], color: 'white' , maxHeight:50}} onClick={handleClick}>
                  Ajouter Bon Commande
                </Button>
              </Box>
              
            </Box>
          </Modal>
         </Box>
      </Box>
   </Box>
 ) }
 export default AddCommande;