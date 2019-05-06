import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login-view.scss'

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://my-movie-108.herokuapp.com/login', {
      username: username,
      password: password
    })
    .then(response =>{
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(e => {
      console.log('no such user')
    })
  };

  return(
<Form>
  <Form.Group controlId="formBasicUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
  </Form.Group>
  <Form.Group controlId="formBasicChecbox">
  </Form.Group>
  <Button className="submit" variant="primary" type="submit" onClick={handleSubmit}>
    Submit
  </Button>
</Form>
  );
}
