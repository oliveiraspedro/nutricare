import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Cadastro/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NewPassword from "./pages/NewPassword/NewPassword";
import Perfil from "./pages/Perfil/Perfil";
import Dietas from "./pages/Dietas/Dietas";
import Pacientes from "./pages/Pacientes/Pacientes";
import NutriCareDashboard from "./pages/Plano/NutriCareDashboard";

function App() {
  return (
    <div className="page-wrapper">
      <Router>
        <Header />
        {/* <div style={{display: "flex", gap: "10px"}}>
          Atalho:
          <a href="http://localhost:3000/pacientes">Pacientes</a>
          <a href="http://localhost:3000/perfil">Perfil</a>
          <a href="http://localhost:3000/plano-alimentar">Plano</a>
        </div> */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/newPassword" element={<NewPassword />} />
            <Route path="/dietas" element={<Dietas />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/plano-alimentar/:pacienteEmail" element={<NutriCareDashboard />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
