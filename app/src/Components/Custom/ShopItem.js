import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
} from "@mui/material";
import MarvelCoinIcon from "../../images/Coin.ico";

const ShopItem = ({ item, onItemClick, badgeButton = null, handleBadgeClick }) => {
  // Check if the item is a package by seeing if it has the Ncards property
  const isPackage = Object.hasOwn(item, "Ncarte");

  return (
    <Badge
      badgeContent={
        badgeButton ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              variant="contained"
              sx={{
                width: "2rem",
                height: "2rem",
                marginLeft: "2rem",
                backgroundColor: "#ed1d24",
                color: "#fff",
                fontFamily: "Bebas Neue, sans-serif",
                "&:hover": {
                  backgroundColor: "#c21825",
                },
              }}
              onClick={() => handleBadgeClick(item)}
            >
              {badgeButton}
            </IconButton>
          </Box>
        ) : null
      }
      sx={{ position: "relative", zIndex: 1, width: "100%" }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Card
        sx={{
          maxWidth: 300,
          textAlign: "center",
          borderRadius: "14px 14px 12px 12px",
          aspectRatio: "3/4",
          background: "#1c1c1c",
          color: "#fff",
          width: "100%",
          overflow: "unset",
        }}
      >
        <CardMedia
          component="img"
          image={item.img}
          alt={item.name}
          sx={{ borderRadius: "12px 12px 0px 0px", height: "250px" }}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "Bebas Neue, sans-serif",
              textTransform: "uppercase",
            }}
          >
            {isPackage ? `${item.Name} Paket: ${item.Ncarte} Cards` : item.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              color: "#ed1d24",
              fontWeight: "bold",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPackage ? (
              <>
                {item.Price}
                <img
                  src={MarvelCoinIcon}
                  alt="Marvel Coin"
                  style={{ width: "18px", margin: "4px" }}
                />
              </>
            ) : (
              item.price
            )}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "1rem",
              backgroundColor: "#ed1d24",
              color: "#fff",
              fontFamily: "Bebas Neue, sans-serif",
              "&:hover": {
                backgroundColor: "#c21825",
              },
            }}
            onClick={() => onItemClick(item.id)}
          >
            Buy Now
          </Button>
        </CardContent>
      </Card>
    </Badge>
  );
};

export default ShopItem;
