import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { Box, Typography, Button, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CTextField from './Custom/TextField'; // Adjust the path as necessary

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Repeat password is required'),
});

const Register = () => {
  const navigate = useNavigate();

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
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#ed1d24', marginBottom: '2rem' }}>
        Register for Marvelverse
      </Typography>
      <Formik
        initialValues={{ username: '', email: '', password: '', repeatPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API_DOMAIN}/auth/register`,
              {
                username: values.username,
                email: values.email,
                password: values.password,
              }
            );
            const { token } = response.data;
            Cookies.set('token', token, { secure: true, sameSite: 'strict' }); // Save token to cookies
            console.log('User registered successfully:', response.data);
            navigate('/'); // Redirect to the home page after successful registration
          } catch (error) {
            console.error('Error registering:', error);
            // Optionally, you can handle errors here (e.g., show a notification)
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Field
                name="username"
                as={CTextField}
                label="Username"
                type="text"
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
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
              <Field
                name="repeatPassword"
                as={CTextField}
                label="Repeat Password"
                type="password"
                error={touched.repeatPassword && !!errors.repeatPassword}
                helperText={touched.repeatPassword && errors.repeatPassword}
              />
              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Register
              </Button>
              <Box mt={2}>
                <Typography variant="body2" align="center">
                  Already have an account? <Link href="/login">Login</Link>
                </Typography>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;
