import { createContext, useState } from 'react';


export const AuthContext = createContext({
  isAuthenticated: "",
  //accessToken:false,
  login: () => {},
  logout: () => {},
  id:0,
  email:"",
  name:"",
  role:"",
  
});

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState("");
  //const [accessToken,setAccessToken] = useState(false)
  const [email,setEmail] = useState("")
  const [name,setName] = useState("")
  const [role,setRole] = useState("")
  const [id,setId] = useState(0)

  const loginHandler = (data) => {
    setIsAuthenticated(data.accessToken)
    setEmail(data.email)
    setName(data.name)
    setRole(data.role)
    setId(data.id)
    //setAccessToken(true)
  };

  const logoutHandler = () => {
    setIsAuthenticated("");
    setEmail("")
    setName("")
    setRole("")
    setId(0)
    //setAccessToken(false)
  };
 

  return (
    <AuthContext.Provider
      value={{ isAuthenticated:isAuthenticated,id:id, email :email, name:name, role:role, login:loginHandler, logout:logoutHandler }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
