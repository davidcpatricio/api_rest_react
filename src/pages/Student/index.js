import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/loading';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', 0);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        // const Photo = get(data, 'Photos[0].url', '');

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (first_name.length < 2 || first_name.length > 255) {
      toast.error('First name must contain between 2 and 255 characteres.');
      formErrors = true;
    }

    if (last_name.length < 2 || last_name.length > 255) {
      toast.error('Last name must contain between 2 and 255 characteres.');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Invalid e-mail address.');
      formErrors = true;
    }

    if (!isInt(String(age))) {
      toast.error('Age must be an integer number.');
      formErrors = true;
    }

    if (!isFloat(String(weight))) {
      toast.error('Weight must be an integer or float number.');
      formErrors = true;
    }

    if (!isFloat(String(height))) {
      toast.error('Height must be an integer or float number.');
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);

      if (id) {
        await axios.put(`/students/${id}`, {
          first_name,
          last_name,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student updated successfully!');
      } else {
        const { data } = axios.post('/students/', {
          first_name,
          last_name,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student created successfully!');
        history.push(`/student/${data.id}/edit`);
      }

      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown error.');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'New student' : 'Edit student'}</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Input first name"
        />
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Input last name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Input e-mail address"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Input age"
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Input weight"
        />
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Input height"
        />

        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
