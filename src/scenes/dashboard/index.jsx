import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { Routes, Route } from "react-router-dom";
import Team from "../team";
import Invoices from "../invoices";
import Contacts from "../contacts";
//import SignIn from "../sign-in";
//import FAQ from "../faq";
import Home from "../home";
import Commande from "../invoices/commandes";
import Livraison from "../livraison" 
import Register from "../register" 
// import User from "../User/UserPage"
import { useState, useContext} from "react";
import { AuthContext } from "../../contexts/Auth";
import  AddCommande  from "../commande"
import AddBon from "../orderItems"
import MesCommandes from "../invoices/mesCommandes";
import AdminSidebar from "../global/SideBars/adminSideBar";
import ChefSideBar from "../global/SideBars/chefSideBar";
import BonsCommandes from "../bonCommandes";
import Products from "../products";
import Bcinfo from "../bonCommandes/info";
import BonFabrications from "../fabrication";
import BonsCommandesLite from "../bonCommandes/noModifyVersion";
import PvSideBar from "../global/SideBars/pvSideBar";
import RespSidebar from "../global/SideBars/respSideBar";
import ConsultantSideBar from "../global/SideBars/consultantSideBar";
import LivraisonInfo from "../livraison/info";
import FabricationInfo from "../fabrication/info";
import FabricationEdit from "../fabrication/edit";
import MesLivraisons from "../livraison/mesLivraisons";
import pertes from "../pertes";
import Points from "../pointVentes";
import CommandeInfo from "../invoices/commandes";
import LivraisonEdit from "../livraison/edit";
import NotificationCenter from "../../components/notificationsCenter";
import Pertes from "../pertes"
import Stock from "../stock";
import StockView from "../stock/readonly";
import StockModify from "../stock/edit";




    const Dashboard =()=> {
      const [isSidebar, setIsSidebar] = useState(true);
      const authCtx = useContext(AuthContext);
      const role = authCtx.role

      switch(role){
        case 'ADMIN':
        return (
          <div className="app">
            <AdminSidebar isSidebar={isSidebar}  />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
              <Route path="/" element={<Home />} />
                <Route path="/modifierCommande/:id" element={<AddCommande />} />
                <Route path="/ajouterCommande/:id" element={<AddCommande />} />
                <Route path="/produits" element={<Products />} />
                <Route path="/bonCommande/:id" element={<AddBon />} />
                <Route path="/bonCommande/info/:id" element={<Bcinfo />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/commande" element={<Invoices />} />
                <Route path="/commande/:id" element={<CommandeInfo />} />
                <Route path="/form" element={<Register />} />
                <Route path="/pointsVentes" element={<Points />} />
                <Route path="/notif" element={<NotificationCenter />} />
                <Route path="/livraison/info/:id" element={<LivraisonInfo />}  />
              </Routes>
            </main>
          </div>
      );
      case 'CONSULTANT':
        return (
          <div className="app">
            <ConsultantSideBar isSidebar={isSidebar}  />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/commande" element={<Invoices />} />
                <Route path="/commande/:id" element={<CommandeInfo />} />
                {/* <Route path="/ajouterCommande/:id" element={<AddCommande />} /> */}
                <Route path="/bonCommande/:id" element={<AddBon />} />
                <Route path="/bonCommande/info/:id" element={<Bcinfo />} />
                <Route path="/pointsVentes" element={<Points />} />
                <Route path="/livraison" element={<Livraison />} />
                <Route path="/livraison/info/:id" element={<LivraisonInfo />}  />
              </Routes>
            </main>
          </div>
      );
      case 'POINT_DE_VENTE':
        return (
          <div className="app">
            <PvSideBar isSidebar={isSidebar}  />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/commande" element={<Invoices />} />
                <Route path="/commande/:id" element={<CommandeInfo />} />
                <Route path="/modifierCommande/:id" element={<AddCommande />} />  
                <Route path="/livraison" element={<Livraison />} />
                <Route path="/commandes/:id" element={ <AddCommande/> } />
                <Route path="/ajouterCommande/:id" element={<AddCommande />} />
                <Route path ="/bonCommande/:id" element={<AddBon />} />
                <Route path="/bonCommande/info/:id" element={<Bcinfo />} />
                <Route path="/livraison/info/:id" element={<LivraisonInfo />}  />
                <Route path="/livraison/edit/:id" element={<LivraisonEdit />} />
                <Route path="/pertes" element={<Pertes />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/stock/info/:id" element={<StockView />} />
                <Route path="/stock/edit/:id" element={<StockModify />} />


              </Routes>
            </main>
          </div>
      );
      case 'RESPONSABLE_LOGISTIQUE':
        return (
          <div className="app">
            <RespSidebar isSidebar={isSidebar}  />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/commande" element={<Invoices />} />
                <Route path="/commande/:id" element={<CommandeInfo />} />
                <Route path ="/bonCommande/:id" element={<AddBon />} />
                <Route path="/modifierCommande/:id" element={<AddCommande />} />
                <Route path="/fabrication" element={<BonFabrications />} />
                <Route path="/fabrication/info/:id" element={<FabricationInfo />} />
                <Route path="/fabrication/edit/:id" element={<FabricationEdit />} />
                <Route path="/bonCommande/info/:id" element={<Bcinfo />} />
                <Route path="/livraison" element={<Livraison />}  />
                <Route path="/livraison/info/:id" element={<LivraisonInfo />}  />
                <Route path="/livraison/edit/:id" element={<LivraisonEdit />} />
              </Routes>
            </main>
          </div>
      );
      case 'CHEF_GLACIER':
        return (
          <div className="app">
            <ChefSideBar isSidebar={isSidebar}  />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fabrication/info/:id" element={<FabricationInfo />} />
                <Route path="/bonCommandes" element={<BonsCommandesLite />} />
                <Route path="/bonFabrications" element={<BonFabrications />} />
              </Routes>
            </main>
          </div>
      );
  
      
  }

}



export default Dashboard;