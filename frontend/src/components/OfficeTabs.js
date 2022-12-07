import { useState } from "react";
import { Container, Row, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const OfficeTabs = (props) => {
    const [state1, setState1] = useState('test value');
    

 return (
  <Container className="py-5 px-5">
    <Row className="justify-content-center">
      <Tabs justify variant="tabs" defaultActiveKey="Appointments" className="mb-3 p-0">
        <Tab eventKey="Appointments" title="Appointments">
          Appointments
        </Tab>
        <Tab eventKey="Inbox" title="Inbox"
      >Inbox</Tab>
      <Tab eventKey="Cancellations" title="Cancellations">Cancellations</Tab>
      </Tabs>
    </Row>
  </Container>
    )
}

export default OfficeTabs

