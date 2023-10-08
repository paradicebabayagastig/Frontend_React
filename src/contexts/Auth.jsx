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
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("accessToken") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [id, setId] = useState(localStorage.getItem("id") || 0);

  const loginHandler = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("email", data.email);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    localStorage.setItem("id", data.id);

    setIsAuthenticated(data.accessToken);
    setEmail(data.email);
    setName(data.name);
    setRole(data.role);
    setId(data.id);
  };

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("id");

    setIsAuthenticated("");
    setEmail("");
    setName("");
    setRole("");
    setId(0);
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
