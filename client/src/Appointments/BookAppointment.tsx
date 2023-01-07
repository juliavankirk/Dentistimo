import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import BookAppointmentForm from "./BookAppointmentForm";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from "../Navbar/Navbar";
import styled from 'styled-components';
import { breakpoints } from '../MediaQueries';
import {clinicApi} from '../services/clinicApi';
import { appointmentApi } from "../services/appointment";
import IClinic  from '../Types/IClinic'

const MainContainer = styled.div`
height: 100vh;
position: relative;

h2,h3,h4,h5,h6{
  font-family: "DMSans-Regular";, sans-serif ;
  font-weight:400;
}
`
const Box = styled.div`
text-align: center;
padding-top: 6rem;

@media (min-width: ${breakpoints.mobileMin}) {
  margin-bottom: -2rem;
  padding-top: 5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  text-align: left;
}
@media (min-width: ${breakpoints.tabletMin}) {
  margin-bottom: -5rem;
}
`

const BookAppointment = () => {
  const navigate = useNavigate();
  //const navigation = useNavigation()
  const {date} :any = useParams();
  const dateFormat = new Date(date);
  const {clinicId} = useParams();
  const data :any= {
    //navigation: navigation,
    clinicId: clinicId,
    d:formatDay(dateFormat.getDate()),
    m:formatMonth(dateFormat.getMonth() + 1),
    y:dateFormat.getFullYear(),
    dayOfWeek:getDayOfWeek(date),
  }

  function formatDay(day:number){
    if(day<=9){
      return "0"+day
    }
    return day
  }

  function formatMonth(month:number){
    if(month<=9){
      console.log(month)
      return "0"+month
    }
    return month
  }

  function getDayOfWeek(date :any) {
    const weekday = new Date(date).getDay()
    console.log(weekday) 
    switch(weekday){
      case 0:
        return "Sunday";
      break;
      case 1:
        return "Monday";
      break;
      case 2:
        return "Tuesday";
      break;
      
      case 3:
        return "Wednesday";
      break;
      
      case 4:
        return "Thursday";
      break;
      
      case 5:
        return "Friday";     
      break;
      
      case 6:
        return "Saturday";
      break;
    }

  }

  const [clinicData,setClinicData] = useState<IClinic>({
    clinicId: {N: ""},
    name: {S: ""},
    address: {S: ""},
    city: {S: ""},
    coordinate: {M: {
      latitude: {N: ""},
      longitude: {N: ""}
    }},
    openinghours: {M: {
      monday: {S: ""},
      tuesday: {S: ""},
      wednesday: {S: ""},
      thursday: {S: ""},
      friday: {S: ""}
    }},
    dentists: {N: ""},
    owner: {S: ""}
    })




  async function getClinicData(clinicId: any) {
    const data = await clinicApi.getClinic(clinicId)
    console.log(data.data)
    return data
    
  }
  async function getAppointmentData(clinicId:any, date: string) {
    const data = await appointmentApi.getAppointments(clinicId,date);
    console.log(data.data)
    return data;
  }

  useEffect(() => {
    const date = data.y + "-" + data.m + "-" +data.d;
    getClinicData(clinicId).then( resp =>{
      console.log(resp.data)
      setClinicData(resp.data)
    }).catch(err => {
      console.log(err)
      //navigate('/unavailable')
    }) 

    getAppointmentData(clinicId,date).then( resp =>{
      console.log(resp.data)
    }).catch(err => {
      console.log(err)
      //navigate('/unavailable')
    })
  },[])


  return (
    <MainContainer>
      <Navbar />
      <Box>
        <Container>
            <Row>
                <Col>
                <div className="card card-container">
                    <h3>Available time slots for {data.dayOfWeek}, {data.d}.{data.m}.{data.y} </h3>
                        <BookAppointmentForm data={data}/>
                    </div>
                </Col>

                <Col>
                    <div className="card card-container">
                    <h2 className="card-title">{clinicData.name.S}</h2>
                    <div className="card-text">

                        <h5>Opening hours</h5>
                        <p> Monday: {clinicData.openinghours.M.monday.S}</p>                        
                        <p> Tuesday: {clinicData.openinghours.M.tuesday.S}</p>
                        <p> Wednesday: {clinicData.openinghours.M.wednesday.S} </p>
                        <p> Thursday: {clinicData.openinghours.M.thursday.S}</p>
                        <p> Friday: {clinicData.openinghours.M.friday.S}</p>
                        <h5>Address</h5>
                        <p> {clinicData.address.S} </p>
                    </div> 
                    
                    </div>
                    
                </Col>
            </Row>
        </Container>
        </Box>
    </MainContainer>
  );
};

export default BookAppointment;