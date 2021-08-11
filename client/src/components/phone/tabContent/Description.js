import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  noDescription: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800'
  }
})

const Description = ({description}) => {

  const descriptionHtml = document.createElement('div');
  descriptionHtml.innerHTML = description;

  const classes = useStyles();

  return description ?  (
    <div dangerouslySetInnerHTML={{__html: description}} className={classes.root} />
  ) : <div className={classes.noDescription}>Theres Is No Description Yet</div>;
};

export default Description;