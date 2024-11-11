import React, { Component } from 'react';
import axios from 'axios';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';

class UserView extends Component {
  constructor() {
    super();
    this.state = {
      userData: null,
      availableVacationDays: null,
      selectedStartDate: '',
      selectedEndDate: '',
      vacationHistory: [],
      error: null,
      success: null,
      dni: '',
      vacationDays: 0,
    };
  }

  componentDidMount() {
    if (this.state.dni) {
      this.fetchUserData();
      this.fetchVacationHistory();
    }
  }

  fetchUserData = () => {
    const { dni } = this.state;
    axios.get(`${process.env.REACT_APP_fetchUserData}${dni}`, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
    .then(response => {
      const userData = response.data.data.rows[0];
      const availableVacationDays = 28;
      this.setState({ userData, availableVacationDays, error: null }, () => {
        this.fetchVacationHistory();
      });
    })
    .catch(error => {
      console.error('Error al obtener datos del usuario', error);
      this.setState({ userData: null, availableVacationDays: null, error: 'Error al obtener datos del usuario' });
    });
  }
  
  fetchVacationHistory = () => {
    const { dni } = this.state;
    axios.get(`${process.env.REACT_APP_fetchHistory}${dni}`, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
    .then(historyResponse => {
      const vacationHistory = historyResponse.data.data.rows;
      this.setState({ vacationHistory });
    })
    .catch(historyError => {
      console.error('Error al obtener el historial de vacaciones', historyError);
    });
  }

  handleDniChange = (event) => {
    this.setState({ dni: event.target.value });
  }

  handleStartDateChange = (event) => {
    this.setState({ selectedStartDate: event.target.value }, this.calculateVacationDays);
  }

  handleEndDateChange = (event) => {
    this.setState({ selectedEndDate: event.target.value }, this.calculateVacationDays);
  }

  calculateVacationDays = () => {
    const { selectedStartDate, selectedEndDate } = this.state;
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);

    if (!isNaN(startDate) && !isNaN(endDate) && startDate < endDate) {
      const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      this.setState({ vacationDays: durationInDays });
    } else {
      this.setState({ vacationDays: 0 });
    }
  }

  handleRequestVacation = () => {
    const { selectedStartDate, selectedEndDate, vacationDays, availableVacationDays, dni } = this.state;
  
    if (!dni) {
      this.setState({ error: 'DNI inválido', success: null });
      return;
    }
  
    if (vacationDays > availableVacationDays) {
      this.setState({ error: 'Días de vacaciones exceden el límite disponible', success: null });
      return;
    }
  
    const newVacation = {
      dni: dni,
      fecha_inicio: selectedStartDate,
      fecha_final: selectedEndDate,
      estado: 'Pendiente',
    };
  
    axios.post(process.env.REACT_APP_generateVacas, newVacation, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
    .then(response => {
      this.setState({ success: 'Solicitud enviada con éxito', error: null });
      this.fetchVacationHistory();
    })
    .catch(error => {
      this.setState({ error: 'Error al enviar la solicitud de vacaciones', success: null });
    });
  }
  
  

  render() {
    const { userData, availableVacationDays, vacationHistory, error, success, vacationDays } = this.state;

    return (
      <div className="container">
        <h2>Vista Usuario</h2>
        <br></br>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <br></br>
        <div className="form-group">
          <strong>DNI:</strong>
          <input
            type="text"
            className="form-control"
            value={this.state.dni}
            onChange={this.handleDniChange}
          />
          <br></br>
          <button className="btn btn-primary" onClick={this.fetchUserData}>
            Obtener Datos
          </button>
        </div>
        <br></br>

        {userData ? (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Información del Usuario</h5>
              <p className="card-text"><strong>Nombre y Apellido:</strong> {userData.nombre}</p>
              <p className="card-text"><strong>Correo electrónico:</strong> {userData.email}</p>
              <p className="card-text"><strong>Teléfono:</strong> {userData.telefono}</p>
              <p className="card-text"><strong>Dirección:</strong> {userData.direccion}</p>
              <p className="card-text"><strong>Puesto: </strong> {userData.posicion}</p>
              <p className="card-text"><strong>Días de vacaciones disponibles:</strong> {availableVacationDays}</p>
            </div>
          </div>
        ) : (
          <p>Cargando datos del usuario...</p>
        )}
        <br></br>
        <h3>Solicitar Vacaciones</h3>
        <div className="form-group">
          <strong>Desde:</strong>
          <input
            type="date"
            className="form-control"
            value={this.state.selectedStartDate}
            onChange={this.handleStartDateChange}
          />
        </div>
        <div className="form-group">
          <strong>Hasta:</strong>
          <input
            type="date"
            className="form-control"
            value={this.state.selectedEndDate}
            onChange={this.handleEndDateChange}
          />
        </div>
        <div>
          <p><strong>Días de Vacaciones Solicitados:</strong> {vacationDays}</p>
        </div>
        <br></br>
        <button className="btn btn-primary" onClick={this.handleRequestVacation}>
          Solicitar Vacaciones
        </button>
        <br></br>
        <br></br>
        <h3>Historial de Vacaciones</h3>
        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Duración</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {vacationHistory.map(vacation => {
              const formattedStartDate = format(parseISO(vacation.fecha_inicio), 'dd-MM-yyyy');
              const formattedEndDate = format(parseISO(vacation.fecha_final), 'dd-MM-yyyy');
              const days = differenceInCalendarDays(new Date(vacation.fecha_final), new Date(vacation.fecha_inicio));
              
              return (
                <tr key={vacation.id_solicitud}>
                  <td>{format(parseISO(vacation.fecha_pedida), 'dd-MM-yyyy')}</td>
                  <td>{formattedStartDate}</td>
                  <td>{formattedEndDate}</td>
                  <td>{days} día(s)</td>
                  <td>{vacation.estado}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserView;
