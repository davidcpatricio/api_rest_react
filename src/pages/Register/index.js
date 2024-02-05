import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Name must contain between 3 and 255 characters.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid e-mail address.');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Password must contain between 6 and 50 characters.');
    }

    if (formErrors) return;

    try {
      await axios.post('/users/', { name, email, password });
      toast.success('Successfully registered!');
      history.push('/');
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);
      errors.map((error) => toast.error(error));
    }
  }

  return (
    <Container>
      <h1>Register</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Input your username"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Input your e-mail address"
          />
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Input your password"
          />
        </label>

        <button type="submit">Submit</button>
      </Form>
    </Container>
  );
}
