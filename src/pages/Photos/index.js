import React from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/loading';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Photos({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [isLoading, setIsLoading] = React.useState(false);
  const [photo, setPhoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        setPhoto(get(data, 'Photos[0].url', ''));
        setIsLoading(false);
      } catch (err) {
        toast.error('There was as error getting image.');
        setIsLoading(false);
        history.push('/');
      }
    };

    getData();
  }, [id]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const photoURL = URL.createObjectURL(file);
    setPhoto(photoURL);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('photo', file);

    try {
      setIsLoading(true);

      await axios.post('/photos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('File uploaded successfully!');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const { status } = get(err, 'response', '');
      toast.error('There was as error uploading file.');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading}></Loading>

      <h1>Photos</h1>

      <Form>
        <label htmlFor="photo">
          {photo ? <img src={photo} alt="photo" /> : 'Select file'}
          <input type="file" id="photo" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
