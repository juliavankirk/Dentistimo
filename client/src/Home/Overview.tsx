import React, { Component, useState, useEffect } from 'react'
import styled from 'styled-components';
import { breakpoints } from '../MediaQueries'

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
  const [data, setClinic] = useState([]);
  const [selectedDate, setDate] = useState();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('clinic') || '{}');
    if (data) {
      setClinic(data);
    }
  }, [data])

  useEffect(() => {
    const selectedDate = JSON.parse(localStorage.getItem('date') || '{}');
    if (selectedDate) {
      setClinic(selectedDate);
    }
  }, [selectedDate])

  console.log("clinic: " + data + "")

  /* If there is no selected clinic or no selected date, the button should be disabled
  ** if (!data || !selectedDate)
  **/


  return(
    <Content1>
        <h3>Clinic Information</h3>
        <h4>Clinic: {data[0]}</h4>
        <h4>Address: {data[2]}, {data[3]}</h4>
        <h4>Dentists: {data[1]}</h4>        
        <h4>Opening hours:</h4>
        <Button>Search Times</Button>
    </Content1>
  );
}

export default Home