import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BlenderIcon from '@mui/icons-material/Blender';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[400],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const RespSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Get the current location
  const location = useLocation();

  // Determine the selected item based on the current route
  const currentPath = location.pathname;
  let currentSelected = "Dashboard";

  if (currentPath === "/") {
    currentSelected = "Dashboard";
  } else if (currentPath === "/contacts") {
    currentSelected = "Contacts Information";
  } else if (currentPath === "/commande") {
    currentSelected = "Bons De Commande";
  } else if (currentPath === "/produits") {
    currentSelected = "Produits";
  } else if (currentPath === "/form") {
    currentSelected = "create account";
  } else if (currentPath === "/pointsVentes") {
    currentSelected = "points de ventes";
    // Add more conditions for other routes as needed
  }

  const [selected, setSelected] = useState(currentSelected);


  return (
    <Box

      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          marginTop:0.5,
          marginLeft:0.5
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.pinkAccent[100]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.pinkAccent[400]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ height: "300%" }} >
        <Menu iconShape="square" >
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                
                alignItems="center"
                ml="25px"
              >
               
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>


          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Commandes"
              to="/commande"
              icon={<LocalPostOfficeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Bons De livraison"
              to="/livraison"
              icon={<LocalShippingIcon />}
              selected={selected}
              setSelected={setSelected}
            /> <Item
            title="Bons De Fabrication"
            to="/fabrication"
            icon={<BlenderIcon />}
            selected={selected}
            setSelected={setSelected}
          />

           
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default RespSidebar;
