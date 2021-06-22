import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {useHistory} from 'react-router-dom'
import { PHONE_ROUTE } from '../utils/consts';

const useStyles = makeStyles({
  root: {
    maxWidth: 265,
    width: "100%",
    margin: "20px 20px"
  },
  media: {
    height: 200,
    backgroundSize: "contain !important"
  },
});

export default function Phone({phone}) {
  const {image, name, price, manufacturer, phone_id} = phone
  const classes = useStyles();
  const history = useHistory();

  const imagePath = `${process.env.REACT_APP_API_URL}/${image ? image : "phone.jpg"}`
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => history.push(PHONE_ROUTE+`/${phone_id}`)}>
        <CardMedia
          width={300}
          height={300}
          className={classes.media}
          image={imagePath}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {manufacturer}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}