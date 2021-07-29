import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  aside: {
    width: '30%',
    marginRight: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    height: '100%'
  },
  content: {
    width: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userImageContainer: {
    width: 250,
    height: 250,
    overflow: 'hidden',
    borderRadius: '50%',
    marginBottom: 10
  },
  userImage: {
    width: 250,
    height: 250,
    objectFit: "cover",
    display: "block"
  },
  userName: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 30
  },
  root: {
    display: 'flex',
    width: '100%'
  },
  tab: {
    width: '100%',
    maxWidth: '100%',
    textTransform: 'none',
    fontSize: 18
  },
  indicator: {
    right: 'auto',
    left: 0,
    backgroundColor: '#3f51b5'
  },
}));

export default useStyles;