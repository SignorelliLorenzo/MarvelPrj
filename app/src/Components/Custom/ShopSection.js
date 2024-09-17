import React from 'react';
import { Grid, Typography } from '@mui/material';
import ShopItem from './ShopItem';

const ShopSection = ({ header, items, onItemClick, badgeButtons,handleBadgeClick }) => {
  return (
    <div style={{ marginBottom: '3rem' }}>
      {header}
      

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <ShopItem item={item} onItemClick={onItemClick} badgeButton={badgeButtons} handleBadgeClick={handleBadgeClick} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ShopSection;
