import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function RegistrationView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    props.onLoggedIn(username);
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
  <Button variant="primary" type="submit" onClick={handleSubmit}>
    Submit
  </Button>
</Form>
  );
}

RegistrationView.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};
