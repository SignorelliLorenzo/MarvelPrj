import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Badge,
  Box,
} from "@mui/material";

// Modified CardC Component
const CardC = ({ card, copies, handleCardClick, margin = "0" }) => {
  const fontSize = useMemo(() => {
    const length = card.Desc.length;
    const sizeAdjustment = 1; // Default size adjustment without custom height/width
    if(card.Desc==="Unknown"){
      return `1vw`;
    }
    return `0.75vw`;
  }, [card.Desc]);

  return (
    <Badge
      badgeContent={copies > 1 ? copies : null}
      color="secondary"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.75rem",
          width: "1.5rem",
          height: "1.5rem",
          padding: "0.25rem",
          borderRadius: "50%",
          backgroundColor: "#2196f3",
        },
        height: "100%",
        width: "100%",
      }}
    >
      <Card
        onClick={() => handleCardClick(card)}
        sx={{
          cursor: "pointer",
          height: "100%",
          width: "100%",
         // maxHeight: "450px",
          maxWidth: "350px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.7)",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
          background: "linear-gradient(135deg, #1c1c1c, #333)",
          margin: margin,
        }}
      >
        <CardContent
          sx={{
            paddingBottom: "8px",
            paddingTop: "8px",
            borderBottom: "1px solid #555",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "2.3lh",
            lineHeight: "1.5",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textTransform: "uppercase",
              WebkitLineClamp: 2,
              maxHeight: "2lh",
              fontSize: {
                xs: "0.5rem",
                sm: "0.75rem",
                md: "1rem",
                lg: "1.2rem",
              },
              "@media (max-width: 600px)": {
                fontSize: "0.875rem",
              },
              color: "#ffcc00",
              fontWeight: "bold",
            }}
            noWrap={false}
          >
            {card.Name}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          image={card.Img}
          alt={card.Name}
          sx={{
            margin: "8px",
            maxHeight: "250px",
            height: "50%",
            objectFit: "cover",
            borderRadius: "8px",
            width: "calc(100% - 16px)",
            objectPosition: "center",
            overflow: "hidden",
            border: "1px solid #555",
          }}
        />
        <Box
          sx={{
            backgroundColor: "#444",
            padding: "8px",
            textAlign: "center",
            margin: "5px",
            borderRadius: "8px",
            flexGrow: 1,
            height: "20%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#e0e0e0",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              overflow: "scroll",
              fontSize,
            }}
          >
            {card.Desc === "false" ? "Unknown" : card.Desc}
          </Typography>
        </Box>
      </Card>
    </Badge>
  );
};

// MiniCard Component
const MiniCard = ({ card, margin = "0" }) => {
  const miniCardHeight = 200; // Set height to 200px
  const miniCardWidth = (miniCardHeight * 2.5) / 4; // Calculate width based on 2.5/4 ratio

  return (
    <Card
      sx={{
        height: `${miniCardHeight}px`,
        width: `${miniCardWidth}px`,
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.7)",
        background: "linear-gradient(135deg, #1c1c1c, #333)",
        margin: margin,
      }}
    >
              <CardContent
          sx={{
            paddingBottom: "8px",
            paddingTop: "8px",
            borderBottom: "1px solid #555",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "2.3lh",
            lineHeight: "1.5",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              overflow: "hidden",
              flexWrap: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textTransform: "uppercase",
              WebkitLineClamp: 1,
              fontSize:  "0.6rem",
              color: "#ffcc00",
              fontWeight: "bold",
            }}
          >
            {card.Name}
          </Typography>
        </CardContent>
      <CardMedia
        component="img"
        image={card.Img}
        alt={card.Name}
        sx={{
          margin: "8px",
          maxHeight: "160px", 
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
          width: "calc(100% - 16px)",
          objectPosition: "center",
          overflow: "hidden",
          border: "1px solid #555",
        }}
      />
      <Box
        sx={{
          backgroundColor: "#444",
          padding: "8px",
          textAlign: "center",
          margin: "5px",
          borderRadius: "8px",
          flexGrow: 1,
          height: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#e0e0e0",
        }}
      >
        {/* Empty box to maintain layout consistency */}
      </Box>
    </Card>
  );
};


export { CardC, MiniCard };
