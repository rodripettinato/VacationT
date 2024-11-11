import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { Button, Container, Row, Col, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendario = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    axios.get(process.env.REACT_APP_approvedRequests, {
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then(response => {
        setApprovedRequests(response.data.data.rows);
      })
      .catch(error => {
        console.error('Error al obtener las solicitudes aprobadas', error);
      });
  }, []);

  const getReservationsForDay = (day) => {
    const dayFormatted = format(day, 'yyyy-MM-dd');
    return approvedRequests.filter(r => {
      const start = new Date(r.fecha_inicio);
      const end = new Date(r.fecha_final);
      return day >= start && day <= end;
    });
  };

  const renderCalendarDays = () => {
    const startOfCurrentMonth = startOfMonth(currentMonth);
    const endOfCurrentMonth = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

    return days.map((day) => {
      const reservations = getReservationsForDay(day);
      const dayFormatted = format(day, 'yyyy-MM-dd');

      return (
        <Col key={dayFormatted} xs={2} className="mb-3 d-flex justify-content-center">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${dayFormatted}`}>{reservations.map(r => r.nombre).join(', ')}</Tooltip>}
          >
            <Button
              variant={reservations.length > 0 ? 'danger' : 'secondary'}
              className="w-100"
              onClick={() => reservations.length > 0 ? setSelectedDayInfo({
                date: dayFormatted,
                names: reservations.map(r => r.nombre).join(', ')
              }) : null}
              style={{ fontWeight: 'bold', padding: '10px', borderRadius: '5px' }}
            >
              {format(day, 'd')}
            </Button>
          </OverlayTrigger>
        </Col>
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '800px' }}>
      <h4 className="text-center mb-3">Calendario de Vacaciones</h4>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handlePrevMonth}>Anterior</Button>
        <h5>{format(currentMonth, 'MMMM yyyy')}</h5>
        <Button variant="primary" onClick={handleNextMonth}>Siguiente</Button>
      </div>

      <Row>
        {renderCalendarDays()}
      </Row>

      {selectedDayInfo && (
        <Alert variant="info" className="mt-3" style={{ fontSize: '1.1rem' }}>
          <strong>{selectedDayInfo.date}</strong> está reservado por <strong>{selectedDayInfo.names}</strong>.
        </Alert>
      )}
    </Container>
  );
};

export default Calendario;
