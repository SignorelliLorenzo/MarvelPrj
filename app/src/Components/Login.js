import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { Box, Typography, Container, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import CTextField from './Custom/TextField'; 
import ErrorModal from './Custom/ErrorModal'; // Import the ErrorModal component

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate(); 
  const [error, setError] = useState(null); // State for managing error messages
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        background: 'linear-gradient(135deg, #1c1c1c, #2c2c2c)',
        borderRadius: '8px',
        padding: '2rem',
        marginTop: '4rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ color: 'white', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Bebas Neue, sans-serif' }}>
        Login to Marvelverse
      </Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API_DOMAIN}/auth/login`,
              {
                email: values.email,
                password: values.password,
              }
            );
            const { token } = response.data;
            Cookies.set('token', token, { secure: true, sameSite: 'strict' }); // Save token to cookies
            console.log('User logged in successfully:', response.data);
            navigate('/'); // Redirect to the home page after successful login
          } catch (error) {
            console.error('Error logging in:', error);
            setError(error.response?.data?.message || 'Invalid login credentials');
            setIsModalOpen(true); // Open the error modal
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Field
                name="email"
                as={CTextField}
                label="Email"
                type="email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                name="password"
                as={CTextField}
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
              <Box mt={2}>
                <Typography variant="body2" align="center" sx={{ color: 'white' }}>
                  Don’t have an account? <Link href="/register">Create a new account</Link>
                </Typography>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Error Modal */}
      <ErrorModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Login Error"
        message={error}
      />
    </Container>
  );
};

export default Login;
