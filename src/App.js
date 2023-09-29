import SignIn from "./scenes/sign-in";
import Dashboard from "./scenes/dashboard"

import { useContext } from "react";
import { AuthContext } from "./contexts/Auth";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

//import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const authCtx = useContext(AuthContext);

    

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app2">
          {authCtx.isAuthenticated ?<Dashboard />:<SignIn />}
          </div>        
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
