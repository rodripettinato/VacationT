import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      error: null,
      success: null,
      name: '',
      dni: '',
      address: '',
      email: '',
      phone: '',
      position: '',
      rank: '',
      seniority: '',
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    axios.get(process.env.REACT_APP_getUsers, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        const users = response.data.data.rows;
        this.setState({ users, error: null });
      })
      .catch(error => {
        this.setState({ error: 'Error al cargar los usuarios', success: null });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  
    const { name, dni, address, email, phone, position, rank, seniority } = this.state;
  
    if (!name || !dni || !address || !email || !phone || !position || !rank || !seniority) {
      this.setState({ error: 'Todos los campos son obligatorios', success: null });
      return;
    }
  
    axios.post(process.env.REACT_APP_addUser, {
      nombre: name,
      dni: dni,
      direccion: address,
      email: email,
      telefono: phone,
      posicion: position,
      rango: parseInt(rank),
      antiguedad: seniority,
    }, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({
          success: 'Usuario agregado con éxito',
          error: null,
          name: '',
          dni: '',
          address: '',
          email: '',
          phone: '',
          position: '',
          rank: '',
          seniority: '',
        });
        this.loadUsers();
      })
      .catch(error => {
        this.setState({ error: 'Error al agregar el usuario', success: null });
      });
  };
  

  handleDelete = (id) => {
    axios.delete(`${process.env.REACT_APP_deleteUser}${id}`, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({ success: 'Usuario eliminado con éxito', error: null });
        this.loadUsers();
      })
      .catch(error => {
        this.setState({ error: 'Error al eliminar el usuario', success: null });
      });
  };

  handleDeleteAll = () => {
    axios.delete(process.env.REACT_APP_deleteData, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({ success: 'Toda la información ha sido eliminada', error: null });
        this.loadUsers();
      })
      .catch(error => {
        this.setState({ error: 'Error al eliminar toda la información', success: null });
      });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { users, error, success, name, dni, address, email, phone, position, rank, seniority } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="mb-4">Lista de Usuarios</h1>
        <br></br>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <br></br>
        <form onSubmit={this.handleSubmit} className="mb-4">
          <div className="form-group mt-3">
            <label>Nombre</label>
            <input type="text" className="form-control" name="name" value={name} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>DNI</label>
            <input type="text" className="form-control" name="dni" value={dni} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Dirección</label>
            <input type="text" className="form-control" name="address" value={address} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={email} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Teléfono</label>
            <input type="text" className="form-control" name="phone" value={phone} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Posición</label>
            <input type="text" className="form-control" name="position" value={position} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Rango</label>
            <input type="number" className="form-control" name="rank" value={rank} onChange={this.handleInputChange} />
          </div>
          <div className="form-group mt-3">
            <label>Antigüedad</label>
            <input type="date" className="form-control" name="seniority" value={seniority} onChange={this.handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Agregar Usuario</button>
        </form>

        <button onClick={this.handleDeleteAll} className="btn btn-danger mt-4">Eliminar Toda la Información</button>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Dirección</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Posición</th>
              <th>Rango</th>
              <th>Antigüedad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.dni}</td>
                  <td>{user.direccion}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono}</td>
                  <td>{user.posicion}</td>
                  <td>{user.rango}</td>
                  <td>{user.antiguedad}</td>
                  <td>
                    <button 
                      onClick={() => this.handleDelete(user.id)} 
                      className="btn btn-danger">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserList;
