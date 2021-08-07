import { Avatar, Divider, Grid } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { usePageDataLoad } from '../../../customHooks';
import { getReviews } from '../../../http/phoneAPI';
import Spinner from '../../Spinner';

function time_ago(time) {

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  let time_formats = [
    [60, 'seconds', 1],
    [120, '1 minute ago', '1 minute from now'],
    [3600, 'minutes', 60], 
    [7200, '1 hour ago', '1 hour from now'],
    [86400, 'hours', 3600], 
    [172800, 'Yesterday', 'Tomorrow'],
    [604800, 'days', 86400], 
    [1209600, 'Last week', 'Next week'],
    [2419200, 'weeks', 604800],
    [4838400, 'Last month', 'Next month'],
    [29030400, 'months', 2419200],
    [58060800, 'Last year', 'Next year'],
    [2903040000, 'years', 29030400],
    [5806080000, 'Last century', 'Next century'],
    [58060800000, 'centuries', 2903040000] 
  ];
  let seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  let i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

const Comments = ({phoneId}) => {

  const [reviews, setReviews, loading, error] = usePageDataLoad(() => getReviews(phoneId))

  if(loading) return <Spinner />

  if(error) return <h3>Some Error {error.message}</h3>

  return (
    <div>
      {
        reviews.length > 0 ?
        reviews.map((review, i) => {
          const imgLink = `${process.env.REACT_APP_API_URL}/${review.image ? review.image : "user.png"}`
          return <div key={review.review_id}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src={imgLink} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{review.fio}</h4>
                <p style={{ textAlign: "left" }}>
                  {review.comment}
                </p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  Posted {time_ago(Date.now() - (Date.now() - (new Date(review.created_at)).valueOf()))}
                </p>
              </Grid>
            </Grid>
            {
              i === reviews.length-1 ? null : <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
            }
          </div>
        })
        :
        <h3 style={{textAlign: "center"}}>Theres No Comments</h3>
      }
    </div>
  );
};

export default Comments;