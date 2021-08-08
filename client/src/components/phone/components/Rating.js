import React from 'react';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Box from '@material-ui/core/Box';
export default function CustomizedRatings({value}) {
  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent" style={{marginBottom: 0, padding: 0}}>
        <Rating
          name="rating"
          readOnly
          defaultValue={+value}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
      </Box>
    </div>
  );
}