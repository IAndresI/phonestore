import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  imageContainer: {
    height: 120,
    width: 120,
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    overflow: 'hidden',
    marginRight: 20
  },
  name: {
    textDecoration: 'none',
    color: 'black',
    transition: 'all 0.5s',
    '&:hover,&:focus': {
      color: "#3f51b5"
    },
    '&:active': {
      color: "inherit"
    }
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transform: "scale(0.9)",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    '&:hover': {
      transform: "scale(1)"
    },
  },
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: '15px',
    marginBottom: 15,
    padding: "10px 20px",
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    backgroundColor: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    '&:hover': {
      background: "#fafafa",
      transform: "translateY(-2px)"
    },
  },
  info: {
    display: 'flex',
    width: '70%',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 50
  },
  order: {
    marginTop: 72,
    position: "sticky",
    top: 30,
    width: '30%',
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: '15px',
    padding: 20,
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  count: {
    width: '70px',
  },
  className: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkout: {
    backgroundColor: "#3f51b5",
    width: '100%',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    border: '1px solid #3f51b5',
    "&:hover, &:focus": {
      outline: "transparent",
      color: "#3f51b5",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "#3f51b5",
    }
  },
  totalPrice: {
    fontSize: 25,
    color: "#000000",
    fontWeight: 700,
    marginBottom: 25
  },
  removeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: "0 10px 0 0",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:hover, &:focus": {
      color: "red",
    },
    "&:active": {
      color: "black",
    }
  },
  wayToGet: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 30
  },
  wayToGetItem: {
    width: "50%",
    display: "flex",
    alignItems: "flex-start",
    marginRight: 0,
    justifyContent: "center",
    padding: "40px 0",
  },
  wayToGetLabel: {
    display: "flex",
    flexDirection: "column",
  },
  wayToGetName: {
    fontWeight: 500,
    fontSize: 20,
    marginBottom: 5,
    paddingTop: 6.5
  },
  radio: {
    color: "#3f51b5 !important",
  },
  map: {
    height: 400,
    width: '100%'
  },
  paymentMethod: {
    width: '100%',
    marginBottom: 30
  },
  paypalButton: {
    width: '100%',
  },
  userData: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  userDataInput: {
    width: '100%',
    marginBottom: 30
  },
  form: {
    width: '100%'
  }
}));

export default useStyles;