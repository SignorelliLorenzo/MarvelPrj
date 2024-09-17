import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const [packets, setPackets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackets();
  }, []);

  const fetchPackets = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/packet/unopened`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      if (response.status === 200) {
        const packetMap = {};
        for (const packet of response.data) {
          const packetId = packet.packetId;

          if (!packetMap[packetId]) {
            const packetResponse = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/packet/getById/${packetId}`, {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
            });
            
            const packetData = packetResponse.data;
            packetMap[packetId] = {
              id: packetId,
              copys: [packet._id], // Initialize copys array with the current packet copy ID
              name: packetData.Name,
              image: packetData.img,
              quantity: 1,
            };
          } else {
            packetMap[packetId].quantity += 1;
            packetMap[packetId].copys.push(packet._id); // Add the current packet copy ID to the copys array
          }
        }

        setPackets(Object.values(packetMap));
        setIsLoading(false);
      } else {
        console.error('Failed to fetch packets');
      }
    } catch (error) {
      console.error('Error fetching packets:', error);
    }
  };

  const handleOpenPacket = (copys) => {
    const randomIndex = Math.floor(Math.random() * copys.length);
    const selectedCopyId = copys[randomIndex];
    navigate(`/open/${selectedCopyId}`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '2rem',
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          borderBottom: '2px solid white',
          display: 'inline-block',
          paddingBottom: '0.5rem',
        }}
      >
        Inventory
      </Typography>
      <Grid container spacing={3}>
        {packets.map((packet) => (
          <Grid item xs={12} sm={6} md={4} key={packet.id} sx={{ position: 'relative' }}>
            <Card
              sx={{
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.7)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f4f4f4',
                boxShadow: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
              onClick={() => handleOpenPacket(packet.copys)} // Pass the entire copys array to select a random ID
            >
              <CardMedia
                component="img"
                alt={packet.name}
                image={packet.image}
                title={packet.name}
                sx={{
                  height: '250px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#1c1c1c',
                  padding: '1rem',
                }}
              >
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    letterSpacing: '1px',
                  }}
                >
                  {packet.name}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: '#ed1d24',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '50%',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                {packet.quantity}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Inventory;
