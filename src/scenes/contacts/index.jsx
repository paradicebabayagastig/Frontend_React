import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useState , useEffect, useContext} from "react";
import axios  from "axios";
import { AuthContext } from "../../contexts/Auth";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authCtx = useContext(AuthContext)
  const token = authCtx.isAuthenticated
  const [data,setData] = useState([]); 

  // const changeDateFormat = ((item, index, arr) => {
  //   arr[index].dateCreation = item.slice(0,9);
  //   console.log(item)
  // } ) 

  // const changeDataDate = ((data => {
  //   data.forEach(changeDateFormat)
  // }))

  const columns = [
    { field: "idUtilisateur", headerName: "ID", flex: 0.5 },
    {
      field: "nomUtilisateur",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1
    },
    {
      field: "dateCreation",
      headerName: "Date Creation",
      flex: 1
    }

    
  ];
    
  useEffect(() => { 
    axios.get("http://localhost:3000/api/v1/users ", 
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
      } )
    .then((Response)=>{
      const formattedData = Response.data.map(item => ({
        ...item,
        dateCreation: new Date(item.dateCreation).toISOString().split('T')[0],
      }));
      setData(formattedData)
      })
    .catch((err)=>{
      console.log(err)
    })
    
  },[token,setData])
 

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List de L'equipe"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderColor: colors.primary[400],
            paddingTop: 0.25
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.pinkAccent[100],
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
         editMode="row"
          density="comfortable"
          checkboxSelection
          getRowId={(row)=>row.idUtilisateur}
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}

        />
      </Box>
    </Box>
  );
};

export default Contacts;
