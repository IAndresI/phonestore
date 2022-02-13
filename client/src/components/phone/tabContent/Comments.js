import { Avatar, Divider, Grid, makeStyles } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import { usePageDataLoad } from '../../../customHooks';
import { getReviews } from '../../../http/phoneAPI';
import Spinner from '../../Spinner';
import Rating from '../components/ReviewRating';
import ReviewModal from '../components/ReviewModal'
import Pagination from '@material-ui/lab/Pagination';
import {useSelector} from 'react-redux'

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
    textAlign: "left",
    width: "100%",
    overflow: "hidden"
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    akignContent: "center",
    marginBottom: 30
  }
});

const Comments = ({phoneId, page, setPage}) => {

  const classes = useStyles();

  const isAuth = useSelector(state => state.user.isAuth)
  const clientId = useSelector(state => state.user.user.id)

  const [limit, setLimit] = useState(5)
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [reviews, setReviews, loading, error] = usePageDataLoad(() => getReviews(phoneId, clientId || -1, limit, page), null, page)

  const [alreadyReviewed, setAlreadyReviewed] = useState(!!reviews?.clientReview)

  useEffect(async () => {
    const reviews = await getReviews(phoneId, clientId || -1, limit, page);
    setReviews(reviews);
  }, [alreadyReviewed])
  
  
  const paginationChange = (event, value) => {
    setPage(value)
  }

  const handleOpen = () => {
    setOpenReviewModal(true);
  };

  if(loading) return <Spinner />

  if(error) return <h3>Some Error {error.message}</h3>

  const reviewOnVerification = reviews.clientReview?.verified;

  const pageCount = Math.ceil(+reviews.count/limit);
  const allReviews = reviewOnVerification && page === 1 ?  [reviews.clientReview, ...reviews.otherClientReview] : reviews.otherClientReview;

  return (
    <div>
      {
        isAuth ?
        (
          <div className={classes.header}>
            <h3>Overall: {reviews.count}</h3>
            {
              reviewOnVerification===false ?
              (
                <button className="button button--mini" onClick={handleOpen}>You have already written review and it is being reviewed. You can change your review</button>
              )
              :
              (
                <button className="button button--mini" onClick={handleOpen}>
                  {alreadyReviewed ? "Edit Review" : "Make Review"}
                </button>
              )
            }
          </div>
        )
        :
        null
      }
      {
        allReviews.length > 0 ?
        (
          <>
            {
              allReviews.map((review, i) => {
                const imgLink = `${process.env.REACT_APP_API_URL}/${review.image ? review.image : "user.png"}`
                return review.verified ? 
                <div key={review.review_id}>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar alt="Remy Sharp" src={imgLink} />
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <div className={classes.commentHeader}>
                        <h4 className={classes.fio}>{review.fio}</h4>
                        <Rating readOnly defaultValue={review.rating}/>
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
                    i === allReviews.length-1 ? null : <Divider variant="fullWidth" className={classes.devider} />
                  }
                </div>
                :
                null
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
      <ReviewModal clientId={clientId} phoneId={phoneId} open={openReviewModal} setOpen={setOpenReviewModal} alreadyReviewed={reviews.clientReview} setAlreadyReviewed={setAlreadyReviewed}/>
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