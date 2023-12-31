import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Checkbox, useTheme,Switch } from '@mui/material';
import { tokens } from '../theme';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import axios from 'axios';
import { AuthContext } from '../contexts/Auth';
import { useNavigate } from 'react-router-dom';


function MyAccordion({ id, chefGlacierId, name, allow, expandedChildId, onExpand, onChefChange }) {
  const navigate = useNavigate();
  const [chefId, setChefId] = useState(chefGlacierId);
  const [checked, setChecked] = useState(allow);
  const [realConsumption, setRealConsumption] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = startDate;
  
//real consump
const fetchRealConsumption = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/stats/real-consumption', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        startDate, 
        endDate,
        pointVenteId:id
      },
    });
    console.log('startDate:', startDate, 'endDate:', endDate);
    console.log('API Response:', response.data);
    
   
    setRealConsumption(response.data);


  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  console.log('C Real Consumption:', realConsumption);
}, [realConsumption]);

useEffect(() => {
  fetchData(); 
  fetchRealConsumption();
}, [refresh]);


  const handleChef = async (idChef) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/pointsVentes/${id}`,
        {
          chefGlacierId: idChef,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log(idChef);
      onChefChange(idChef);
      setChefId(idChef);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('new chef modified : ', chefId);
  }, [chefId]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authCtx = useContext(AuthContext);
  const token = authCtx.isAuthenticated;
  const [chefs, setChefs] = useState([]);
  const userRole = authCtx.role; 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/users', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const filterChef = response.data.filter((item) => item.role === 'CHEF_GLACIER');
      setChefs(filterChef);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  const handleSuite = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/v1/pointsVentes/suite/${id}`, {
        allowSuite: !checked,
      });
      setChecked(!checked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Accordion
      expanded={id === expandedChildId}
      onChange={() => onExpand(id)}
      sx={{
        backgroundColor: colors.primary[400],
      }}
    >
      <AccordionSummary
        sx={{
          color: id === expandedChildId ? colors.pinkAccent[400] : colors.primary[100],
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h4">{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {userRole === 'ADMIN' ? (
          <>
            <Typography>Choisir Chef Glacier:</Typography>
            <Box mt={5} display="flex" alignItems="center">
              allowed:
              <Switch checked={checked} onChange={handleSuite} inputProps={{ label: 'suite' }} />

              {chefs?.map((chef) => (
                <Box display="flex" alignItems="center" ml="auto" mr="auto" key={chef.idUtilisateur}>
                  <Typography>{chef.nomUtilisateur}</Typography>
                  <Checkbox
                    onChange={() => handleChef(chef.idUtilisateur)}
                    checked={chefId === chef.idUtilisateur ? true : false}
                    disabled={chefId === chef.idUtilisateur ? true : false}
                    sx={{
                      color: colors.pinkAccent[400],
                      '&.Mui-checked': {
                        color: colors.pinkAccent[400],
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Typography>
            Real Consumption: {realConsumption}
          </Typography>
        
        
        
        


        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default MyAccordion;
