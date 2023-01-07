import React, { Component, useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import ClinicType from '../Types/ClinicType';

import styled from 'styled-components';

const Content1 = styled.div`
  padding: 0.5rem;
  width: 100%;
  height: 80%;
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  color: "palevioletred";
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

type OverviewProps = {
name: string
dentists: number
address: string
city: string
}


const Home = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [opened, setIsOpened] = useState<boolean>(false);
  // const [data, setData] = useState([]);
  const [clinic, setClinic] = useState<ClinicType>();
  const [date, setDate] = useState("0000-00-00");


  const handleOnOpen = () => setIsOpened(true);
  const handleOnClose = () => setIsOpened(false);


  // useEffect listener should be equal to clinic and date


  useEffect(() => {
    const selectedClinic = JSON.parse(localStorage.getItem('clinic') || '{}');
    if (selectedClinic) {
      if (selectedClinic){
      setClinic(selectedClinic);}
    }
  }, [clinic]);

  useEffect(() => {
    const selectedDate = JSON.parse(localStorage.getItem('date') || '{}');
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [clinic]);

  
  let handleClick = false;
  if ( date && clinic?.clinicId ) {
    handleClick = false;
  } else {
    handleClick = true;
  }

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/clinics/${clinic?.clinicId}/appointments/${date}`; 
    navigate(path);
  }

  return(<div ref={containerRef}>
    {clinic?.clinicId && date ?
      <Content1>
        <h3>Clinic Information</h3>

        <h4>{`Clinic: ${clinic?.name}`}</h4>
        <h4>{`Address: ${clinic?.address}, ${clinic?.city}`}</h4>

        <h4>{`Opening hours:`}</h4>
        <h5>{`\nMonday: ${clinic?.openinghours?.monday}`}</h5>
        <h5>{`\nTuesday: ${clinic?.openinghours?.tuesday}`}</h5>
        <h5>{`\nWednesday: ${clinic?.openinghours?.wednesday}`}</h5>
        <h5>{`\nThursday: ${clinic?.openinghours?.thursday}`}</h5>
        <h5>{`\nFriday: ${clinic?.openinghours?.friday}`}</h5>
        
       <Button 
        disabled={handleClick} 
        onClick={routeChange}
       >
         Search Times
        </Button>
      </Content1>
     : 
     <div></div>
    }
    </div>
  );
}

export default Home