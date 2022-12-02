import React, {useState} from "react";
import {
  Form,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
export default function PatientContactForm() {
  const [clinicName, newClinicName] = useState("");
  const [title, newTitle] = useState("");
  const [message, newMessage] = useState("");

  function onSubmit (e)  {
    e.preventDefault();
    const patientContact = {
      clinicName,
      title,
      message,
    };
    console.log(patientContact);
  };
  return (
      <Form classname="ml-5" onSubmit={onSubmit}>
      <h5 className="mb-3"> Send messages to your dentist or clinic here</h5>
      <FormGroup className="mb-4" >
        <FormLabel>Choose your Clinic</FormLabel>
        <FormSelect
          id="clinicName"
          value={clinicName}
          onChange={(e) => newClinicName(e.target.value)}
          style={{ width: "40em" }}
          required
        >
          <option value="" selected hidden>
            &lt;----Select your clinic----&gt;
          </option>
          <option>Your Dentist</option>
          <option>Tooth Fairy Dentist</option>
          <option>The Crown</option>
          <option>Lisebergs Dentists</option>
        </FormSelect>
      </FormGroup>
      <FormGroup className="mb-4" >
        <FormLabel htmlFor="title">Message Title</FormLabel>
        <FormControl
          type="text"
          id="title"
          value={title}
          onChange={(e) => newTitle(e.target.value)}
          style={{ width: "40em" }}
          placeholder="Write your message title here..."
          required
        ></FormControl>
      </FormGroup>
      <FormGroup className="mb-4" >
        <FormLabel>Message</FormLabel>
        <FormControl
          type="text"
          id="message"
          value={message}
          onChange={(e) => newMessage(e.target.value)}
          as="textarea"
          placeholder="Write your message here..."
          style={{ width: "40em" }}
          required
        ></FormControl>
      </FormGroup>

      <Button type="submit" variant="primary">
        Send Message
      </Button>
    </Form>
  );
};

