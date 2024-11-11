import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserView from './UserView';
import AdminView from './AdminView';
import UserList from './UserList';
import Calendario from './Calendario';

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Bienvenido a la pagina principal</h1>
      <p className="mb-4">Elegí una opcion para continuar:</p>
      <div className="d-flex justify-content-center">
        <Link to="/UserView" className="btn btn-primary mx-2">
          Ir a Panel de Usuario
        </Link>
        <Link to="/AdminView" className="btn btn-primary mx-2">
          Ir Panel de Administrador
        </Link>
        <Link to="/UserList" className="btn btn-secondary mx-2">
          Ir a Usuarios
        </Link>
        <Link to="/Calendario" className="btn btn-secondary mx-2">
          Ir al Calendario
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/UserView" element={<UserView />} />
        <Route path="/AdminView" element={<AdminView />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/Calendario" element={<Calendario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
