import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Checkbox, useTheme,Switch } from '@mui/material';
import { tokens } from '../theme';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import axios from 'axios';
import { AuthContext } from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';

function MyAccordion({ id ,chefGlacierId, name, allow, expandedChildId, onExpand, onChefChange}) {
  const navigate = useNavigate()
  const [chefId,setChefId] = useState(chefGlacierId) 
  const [checked,setChecked] = useState(allow)
  const handleChef = async (idChef) => {
    try {
        const response = await axios.patch(`http://localhost:3000/api/v1/pointsVentes/${id}`,{
            chefGlacierId:idChef
        }, {
            withCredentials:true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        })
        console.log(idChef)
        onChefChange(idChef);
        setChefId(idChef)
        
    }
    catch (error) {

    }
}
useEffect(() => {
  console.log('new chef modified : ',chefId)
},[chefId])

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const [chefs,setChefs] = useState([])

  const fetchData = ( async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/users', {
            withCredentials:true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        })
        const filterChef = response.data.filter((item => item.role === "CHEF_GLACIER"))
        setChefs(filterChef)
    }
    catch (error) {
        console.log(error)
    }
  })

    useEffect(()=> {
        fetchData()
    },[])

    useEffect(() => {
        console.log(checked)
    },[checked])

    const handleSuite = async ()=>{
      try{
      await axios.patch(`http://localhost:3000/api/v1/pointsVentes/suite/${id}`,{
        allowSuite:!checked,
      })
      setChecked(!checked);
    }catch(err){
      console.log(err);
    }
    }


  return (
    <Accordion
    expanded={id === expandedChildId}
      onChange={() => onExpand(id)}
      sx={{
        backgroundColor:  colors.primary[400],
      }}
    >
      <AccordionSummary
        sx={{
          color: id === expandedChildId ? colors.pinkAccent[400] : colors.primary[100],
        }}
        expandIcon={<ExpandMoreIcon/>}
        >
            <Typography
                variant='h4'
            >
                {name}
            </Typography>
        
      </AccordionSummary>
      <AccordionDetails>
      <Typography
        
      >
                   Choisir Chef Glacier :
                    </Typography>
                    <Box 
                        mt={5}
                        display="flex"
                        alignItems="center"
                    > 
                    allowed:<Switch
                      checked={checked}
                      onChange={handleSuite}
                      inputProps={{ 'label': 'suite' }}
                    />

                        {chefs?.map((chef) => (
                            <Box
                               display="flex"
                               alignItems="center"
                               ml='auto'
                               mr='auto'
                               >
                               <Typography>
                                   {chef.nomUtilisateur} 
                               </Typography>
                               <Checkbox
                                onChange={() => handleChef(chef.idUtilisateur)}
                               checked={chefId === chef.idUtilisateur ? true : false}
                               disabled={chefId === chef.idUtilisateur ? true : false}
                                sx={{
                                  color:colors.pinkAccent[400],
                                  '&.Mui-checked': {
                                    color: colors.pinkAccent[400],
                                  },
                                }}
                               />
                           </Box> 
                        ))
                            
                        }
                        

                            
                    </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default MyAccordion;
