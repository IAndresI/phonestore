import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const Title = (props) => {
  return (
    <div>
      <Typography variant="h4" className="profile__title">
        {props.children}
      </Typography>
      <Divider/>
    </div>
  );
};

export default Title;