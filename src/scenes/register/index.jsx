import { Box, Button, Grid,TextField,Typography,useTheme } from "@mui/material";
import { Formik,useFormikContext } from "formik";
import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../contexts/Auth";
import ErrorIcon from '@mui/icons-material/Error';
import {  MenuItem } from '@mui/material'
//import { useNavigate } from "react-router-dom";
//import { border } from "@mui/system";




const Form = () => {
    const authCtx = useContext(AuthContext)
    const token = authCtx.isAuthenticateds
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [showErr,setShowErr]=useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    //const isNonMobile = useMediaQuery("(min-width:600px)");
   const formikContext=useFormikContext();
    //const handleChangeRole = (event:React.ChangeEvent<HTMLInputElement>) =>{

    //}
    //const navigate = useNavigate();
  
    const handleFormSubmit = (values,action) => {
      
      
      axios.post('http://localhost:3000/api/v1/auth/register',{
        email:values.email,
        motDePasse:values.pass,
        nomUtilisateur:values.user,
        role:values.role,
        permission:"ALL"
      },{withCredentials:true})
      .then((response)=> {
        setShowErr(false)
        console.log(response)
        setIsFormSubmitted(true); // Form is submitted
        setTimeout(() => {
          setIsFormSubmitted(false); // Reset the form after a while
          action.resetForm();
        }, 3000);
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
         justifyContent="left"
         
         
         
         > 
        <Box p="70px 25px" sx={{
              //backgroundColor: colors.primary[700],
              "&":{
                //border: isNonMobile ?  "1px solid" : undefined, 
                //borderRadius: isNonMobile ?  "30px" : undefined
              },
                width:400,
                
            }}>
            <Box
                
            >
                <Header title="CREATE USER" subtitle="Create a New User Profile" />
            </Box>
           { showErr ? <Box mb="10px" display="flex" justifyContent="center" sx={{border:1,bgcolor:colors.primary[400],borderRadius:2}}>
                         
                              <ErrorIcon sx={{marginRight:'10px'}} />
                           
                        <Typography >User already exists</Typography>
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
                <FormControl sx={{ mt: 2, }} variant="filled">
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
                <FormControl sx={{ mt: 2, }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-username">username</InputLabel>
                  <FilledInput
                    id="filled-adornment-username"
                    type='text'
                    value={values.user}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="user"
                  />
                </FormControl>
           
                    
                 <FormControl sx={{ mt: 2, }} variant="filled">
                      <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.motDePasse}
                        name="pass"
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
                <FormControl sx={{ mt: 2, }} variant="filled">
                      <InputLabel htmlFor="filled-adornment-cpassword">Confirm Password</InputLabel>
                      <FilledInput
                        id="filled-adornment-cpassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.motDePasse}
                        name="cpass"
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
                <FormControl sx={{ mt: 2, }} variant="filled">
                <InputLabel htmlFor="filled-adornment-role">{values.role ? " ": "role"}</InputLabel>

                    <TextField select id="filled-adornment-role" name="role" value={values.role} onChange={handleChange}  onBlur={handleBlur}>
                      <MenuItem id="1" value="ADMIN">Admin</MenuItem>
                      <MenuItem id="2" value="POINT_DE_VENTE">Point de vente</MenuItem>
                      <MenuItem id="3" value="CHEF_GLACIER">Chef glacier</MenuItem>
                      <MenuItem id="4" value="RESPONSABLE_LOGISTIQUE">Responsable logistique</MenuItem>
                      <MenuItem id="5" value="CONSULTANT">consultant</MenuItem>
                    </TextField>
      
                </FormControl > 
                               
                </Box>
               
                <Box display="flex" justifyContent="left" mt="30px">
                <Button
                  type="submit"
                  sx={{
                    background: colors.pinkAccent[300],
                  }}
                  variant="contained"
                  size="large"
                  disabled={isFormSubmitted} // Step 3: Disable the form if submitted
                >
                  Create Account
                </Button>

                </Box>
              </form>
            )}
          </Formik>
        </Box>
        </Grid>
      );
    };
    
    
    const initialValues = 
      {
        email: "",
        user:"",
        pass: "",
        cpass: "",  
        role: "",  
        chef: ""
      }
     ;
    
    export default Form;