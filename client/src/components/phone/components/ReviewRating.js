import React from 'react';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Box from '@material-ui/core/Box';

export default function ReviewRating({readOnly, field, defaultValue}) {
  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent" style={{marginBottom: 0, padding: 0}}>
        <Rating
          name="rating"
          readOnly={readOnly}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
          defaultValue={defaultValue}
          {...field}
        />
      </Box>
    </div>
  );
}