import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
const NumberInputWithButtons = (id,onValueChange,product,setProducts) => {
  const [value, setValue] = useState(0);

  const handleIncrement = () => {
    setValue(value + 1);
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[id] = {
        ...updatedProducts[id],
        quantity: value,
      };
      return updatedProducts;
    })
    
  };

  const handleDecrement = () => {
    if (value >0)
    {
      setValue(value - 1);
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[id] = {
          ...updatedProducts[id],
          quantity: value,
        };
        return updatedProducts;
      })
    }
    
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[id] = {
        ...updatedProducts[id],
        quantity: newValue,
      };
      return updatedProducts;
    })
  };


  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Button variant="outlined" onClick={handleDecrement} color="warning" size='small'  sx={{
           width:40
    
        }}>
          -
        </Button>
      </Grid>
      <Grid item>
        <TextField
          type="number"
          value={product}
          onChange={handleInputChange}
          variant="outlined"
          disabled
          sx={{
           width:65
    
        }}
          
        />
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={handleIncrement}  size='small' color="success">
          +
        </Button>
      </Grid>
    </Grid>
  );
};

export default NumberInputWithButtons;
