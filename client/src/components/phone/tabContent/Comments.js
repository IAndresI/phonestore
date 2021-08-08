import { Avatar, Divider, Grid, makeStyles } from '@material-ui/core';
import React, {useState} from 'react';
import { usePageDataLoad } from '../../../customHooks';
import { getReviews } from '../../../http/phoneAPI';
import Spinner from '../../Spinner';
import CustomizedRatings from '../components/Rating';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  commentHeader: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  fio: { 
    margin: 0, 
    textAlign: "left"
  },
  text: { 
    textAlign: "left" 
  },
  commentDate: { 
    textAlign: "left", 
    color: "gray" 
  },
  devider: {
    marginBottom: 30
  },
  noComments: {
    textAlign: "center"
  },
  pagination: {
    width: "fit-content",
    margin: "30px auto 0"
  },
  paginationHide: {
    display: "none"
  },
  paginationShow: {
    display: "block"
  }
});

const Comments = ({phoneId, page, setPage}) => {

  const [limit, setLimit] = useState(5)

  const [reviews, setReviews, loading, error] = usePageDataLoad(() => getReviews(phoneId, limit, page), null, page)

  const paginationChange = (event, value) => {
    setPage(value)
  }

  const classes = useStyles();

  if(loading) return <Spinner />

  if(error) return <h3>Some Error {error.message}</h3>

  const pageCount = Math.ceil(+reviews.count/limit);

  return (
    <div>
      {
        reviews.data.length > 0 ?
        (
          <>
            {
              reviews.data.map((review, i) => {
                const imgLink = `${process.env.REACT_APP_API_URL}/${review.image ? review.image : "user.png"}`
                return <div key={review.review_id}>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar alt="Remy Sharp" src={imgLink} />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      <div className={classes.commentHeader}>
                        <h4 className={classes.fio}>{review.fio}</h4>
                        <CustomizedRatings value={review.rating}/>
                      </div>
                      
                      <p className={classes.text}>
                        {review.comment}
                      </p>
                      <p className={classes.commentDate}>
                        Posted {timeAgo(Date.now() - (Date.now() - (new Date(review.created_at)).valueOf()))}
                      </p>
                    </Grid>
                  </Grid>
                  {
                    i === reviews.data.length-1 ? null : <Divider variant="fullWidth" className={classes.devider} />
                  }
                </div>
              })
            }
            <Pagination 
              className={`${classes.pagination} ${pageCount <= 1 ? classes.paginationHide : classes.paginationShow}`} 
              page={page} 
              onChange={paginationChange}
              count={pageCount} 
              variant="outlined" 
              color="primary" 
            />
          </>
        )
        :
        <h3 className={classes.noComments}>Theres No Comments</h3>
      }
    </div>
  );
};

function timeAgo(time) {

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

export default Comments;