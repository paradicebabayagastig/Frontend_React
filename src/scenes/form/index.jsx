import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState} from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" ,width:"500px" }}
              />
              <TextField
                
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.user}
                name="user"
                error={!!touched.user && !!errors.user}
                helperText={touched.user && errors.user}
                sx={{ gridColumn: "span 4",width:"500px" }}
              />
              <FilledInput
                
                variant="filled"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pass}
                name="pass"
                error={!!touched.pass && !!errors.pass}
                helperText={touched.pass && errors.pass}
                sx={{ gridColumn: "span 4",width:"500px" }}
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
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cpass}
                name="cpass"
                error={ !!errors.cpass}
                helperText={ errors.cpass}
                sx={{ gridColumn: "span 4" ,width:"500px"}}
              />
            </Box>
            <Box display="flex" justifyContent="begin" mt="30px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  user: yup
    .string()
    .required("required"),
  pass: yup.string().required("required"),
  cpass: yup.string().required("required"),
});
const initialValues = {
  email: "",
  user: "",
  pass: "",
  cpass: "",
};

export default Form;
