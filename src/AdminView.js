import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';

class AdminView extends Component {
  constructor() {
    super();
    this.state = {
      vacationRequests: [],
      approvedRequests: [],
      rejectedRequests: [],
      error: null,
      success: null,
    };
  }

  componentDidMount() {
    this.updateRequestList('vacationRequests', process.env.REACT_APP_vacationRequests);
    this.updateRequestList('approvedRequests', process.env.REACT_APP_approvedRequests);
    this.updateRequestList('rejectedRequests', process.env.REACT_APP_rejectedRequests);
  }

  updateRequestList = (stateKey, url) => {
    axios.get(url, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({ [stateKey]: response.data.data.rows });
      })
      .catch(error => {
        this.setState({ error: `Error al obtener las solicitudes de ${stateKey}`, success: null });
      });
  }

  handleApproveRequest = (requestId) => {
    axios.post(process.env.REACT_APP_aprobarVacas, { "id": requestId }, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({ success: 'Solicitud aprobada con éxito', error: null });
        this.updateRequestList('vacationRequests', process.env.REACT_APP_vacationRequests);
        this.updateRequestList('approvedRequests', process.env.REACT_APP_approvedRequests);
      })
      .catch(error => {
        this.setState({ error: 'Error al aprobar la solicitud de vacaciones', success: null });
      });
  }

  handleRejectRequest = (requestId) => {
    axios.post(process.env.REACT_APP_denegarVacas, { "id": requestId }, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        this.setState({ success: 'Solicitud rechazada con éxito', error: null });
        this.updateRequestList('vacationRequests', process.env.REACT_APP_vacationRequests);
        this.updateRequestList('approvedRequests', process.env.REACT_APP_approvedRequests);
      })
      .catch(error => {
        this.setState({ error: 'Error al rechazar la solicitud de vacaciones', success: null });
      });
  }

  render() {
    const { vacationRequests, approvedRequests, rejectedRequests, error, success } = this.state;

    const calculateDuration = (startDate, endDate) => {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const days = differenceInCalendarDays(end, start);
      return `${days} día(s)`;
    };

    return (
      <div className="container">
        <h2>Vista Admin</h2>
        <br></br>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <br></br>
        <h5>Solicitudes Pendientes</h5>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Duración</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacationRequests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No hay solicitudes de vacaciones</td>
              </tr>
            ) : (
              vacationRequests.map(request => (
                <tr key={request.id_solicitud} className="text-center">
                  <td>{request.nombre}</td>
                  <td>{request.email}</td>
                  <td>{request.telefono}</td>
                  <td>{format(parseISO(request.fecha_pedida), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_inicio), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_final), 'dd/MM/yyyy')}</td>
                  <td>{calculateDuration(request.fecha_inicio, request.fecha_final)}</td>
                  <td>
                    <button className="btn btn-success" onClick={() => this.handleApproveRequest(request.id_solicitud)}>Aprobar</button>
                    <button className="btn btn-danger" onClick={() => this.handleRejectRequest(request.id_solicitud)}>Rechazar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br></br>

        <h5>Solicitudes Aprobadas</h5>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Duración</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No hay solicitudes aprobadas</td>
              </tr>
            ) : (
              approvedRequests.map(request => (
                <tr key={request.id_solicitud} className="text-center">
                  <td>{request.nombre}</td>
                  <td>{request.email}</td>
                  <td>{request.telefono}</td>
                  <td>{format(parseISO(request.fecha_pedida), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_inicio), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_final), 'dd/MM/yyyy')}</td>
                  <td>{calculateDuration(request.fecha_inicio, request.fecha_final)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br></br>

        <h5>Solicitudes Rechazadas</h5>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th scope="col">Nombre</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha Solicitada</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Duración</th>
            </tr>
          </thead>
          <tbody>
            {rejectedRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No hay solicitudes rechazadas</td>
              </tr>
            ) : (
              rejectedRequests.map(request => (
                <tr key={request.id_solicitud} className="text-center">
                  <td>{request.nombre}</td>
                  <td>{request.email}</td>
                  <td>{request.telefono}</td>
                  <td>{format(parseISO(request.fecha_pedida), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_inicio), 'dd/MM/yyyy')}</td>
                  <td>{format(parseISO(request.fecha_final), 'dd/MM/yyyy')}</td>
                  <td>{calculateDuration(request.fecha_inicio, request.fecha_final)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AdminView;
