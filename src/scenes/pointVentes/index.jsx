import { AuthContext } from "../../contexts/Auth";
import { useEffect,useContext, useState } from "react";
import { AccordionDetails, AccordionSummary, Box, Checkbox, Typography} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";
import Stock from "../stock";
import { redirect } from "react-router-dom";
import {Accordion, useTheme} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { CheckBox } from "@mui/icons-material";
import MyAccordion from "../../components/accordion";
import produce from "immer";

const Points = () => 
{     
    const authCtx = useContext(AuthContext)
    const token = authCtx.isAuthenticated
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [points,setPoints] = useState([])
    const [refresh, setRefresh] = useState(false);

    const [expandedChildId, setExpandedChildId] = useState(null);

    const handleExpand = (childId) => {
    if (expandedChildId === childId) {
    // If the same child is clicked again, collapse it
    setExpandedChildId(null);
    } else {
    // Expand the clicked child
    setExpandedChildId(childId);
    }
    };  

    // Callback function to handle chefGlacierId updates
    const handleChefChange = (id, newChefId) => {
        // Create a new copy of the points array
        const updatedPoints = points.map((pointVente) => {
          if (pointVente.idPointVente === id) {
            // Update the chefGlacierId for the specific item
            return { ...pointVente, chefGlacierId: newChefId };
          }
          return pointVente; // Return unchanged items as they are
        });
      
        // Update the state with the new array
        setPoints(updatedPoints);
        console.log('test')
        // Note: State updates are asynchronous, so you may not see the updated 'points' immediately here.
        // If you want to log the updated 'points', you can use a useEffect to do so.
      };

    const fetchData = ( async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/pointsVentes', {
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
            })
            setPoints(response.data)
        }
        catch (error) {
            console.log(error)
        }
    })
    
    useEffect(()=> {
        fetchData()
    },[])

    useEffect(()=>{
        console.log('points changed : ',points)
    },[points])

   
    return(
        <>
        <Box m="50px" >
            <Header title="Tous Points Ventes"  />
            <Box
                display="flex"
                flexDirection="column"
                gap={1}
                >
                    {points?.map((pointVente,index) => (
                            <MyAccordion 
                            key={index} 
                            id={pointVente.idPointVente}
                            chefGlacierId={pointVente.chefGlacierId}
                            name={pointVente.nomPointVente}
                            allow={pointVente.allowSuite}
                            onChefChange={handleChefChange}
                            expandedChildId={expandedChildId}
                            onExpand={handleExpand}
                            />
                        ))
                    }
                
            </Box>
           
        </Box>
       </>
    );
    
    
}





export default Points;