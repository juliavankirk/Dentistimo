import React from "react";
import { Container, Row, Tabs, Tab } from "react-bootstrap";
import PatientContactForm from "./PatientContactForm";
import PatientInbox from "./PatientInbox";

function PatientDashboard() {
  const tempMessages = [
    {
      id:1,
      sender: "Person 1",
      title: "Message Title 1",
      message: "This is message 1",
      

  },
  {
      id:2,
      sender: "Person 2",
      title: "Message Title 2",
      message: "This is message 2",

  },
  {
      id:3,
      sender: "Person 3",
      title: "Message Title 3",
      message: "This is message 3",
  }

  ]

  return (
    <>
      <Container className="py-2 px-2">
        <Row className="justify-content-center">
          <Tabs
            justify
            variant="tabs"
            defaultActiveKey="PatientMsgs"
            className="mb-3 p-0"
          >
            <Tab eventKey="PatientMsgs" title="Messages">
             <div><PatientInbox msgs={tempMessages}/></div>
            </Tab>
            <Tab eventKey="Contact" title="Contact">
              <div><PatientContactForm /></div>
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>
  );
};

export default PatientDashboard;
