import { Box, Button, Grid,Typography,useTheme } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { tokens } from "../../theme";
import axios from "axios"
import {AuthContext} from '../../contexts/Auth';
import  { useContext } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
//import { useNavigate } from "react-router-dom";
//import { border } from "@mui/system";




const Form = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [showErr,setShowErr]=useState(false)
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const authCtx = useContext(AuthContext);
    //const navigate = useNavigate();
  
    const handleFormSubmit = (values) => {
      
      
      axios.post('http://localhost:3000/api/v1/auth/login',{
        email:values.email,
        motDePasse:values.motDePasse
      },{withCredentials:true})
      .then((response)=> {
        setShowErr(false)
        
        console.log(response.data)
        const data = {
          accessToken : response.data.accessToken,
          email : response.data.user.email,
          name : response.data.user.nomUtilisateur,
          role : response.data.user.role, 
          id : response.data.user.idUtilisateur
        }
        console.log("test111:"+data.role)
        authCtx.login(data);
        
      })
      .catch((err)=> {
        console.log(err)
        setShowErr(true)
      })
    };
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
   
    return (
        <Grid
         container
         justifyContent="center"
         mt={isNonMobile ?  "100px" : "undefined"}
         
         
         > 
        <Box
            
           
            p="70px 25px"
           
            
            sx={{
              backgroundColor: colors.primary[400],
              
              "&":{
                border: isNonMobile ?  "1px solid" : undefined, 
                borderRadius: isNonMobile ?  "30px" : undefined
              },
                width:400,
                
            }}
        >
            <Box ml="128px">
                <Header title="Login" />
            </Box>
           { showErr ? <Box mb="10px" display="flex" justifyContent="center" sx={{border:1,bgcolor:colors.pinkAccent[300],borderRadius:2}}>
                         
                              <ErrorIcon sx={{marginRight:'10px'}} />
                           
                        <Typography >Error incorrect information</Typography>
            </Box> :null}
          
    
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            //validationSchema={checkoutSchema}
          >
            {({
              values,
              //touched,
              //errors,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{
                    
                  }}
                
                
                >
                <FormControl sx={{ m: 1, }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-email">email</InputLabel>
                  <FilledInput
                    id="filled-adornment-email"
                    type='text'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                  />
                </FormControl>
           
                    
                 <FormControl sx={{ m: 1, }} variant="filled">
                      <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.motDePasse}
                        name="motDePasse"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                </FormControl>           
                </Box>
               
                <Box display="flex" justifyContent="center" mt="30px">
                  <Button type="submit" sx={{
                    background:colors.pinkAccent[400]
                  }}variant="contained" size="large">
                    Login
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        </Grid>
      );
    };
    
    
    const initialValues = {
      email: "",
      motDePasse: "",
     
    };
    
    export default Form;