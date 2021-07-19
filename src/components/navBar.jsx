import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LoginContext from "../contexts/loginContext";
import CustomDrawer from "./drawer";
import Avatar from "@material-ui/core/Avatar";

import ProfileDialog from "./profile/profileDialog";
import { useHistory } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar_large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const NavBar = ({ user, toggleSidebar, updateUser }) => {
  const loginModal = useContext(LoginContext);
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [profileOpen, setOpen] = React.useState(false);

  const handleProfileOpen = () => {
    setOpen(true);
  };

  const handleProfileClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = async () => {
    // global: true for signing out user out of all devices
    console.log("signing out");
    try {
      await Auth.signOut();
      updateUser(null);
      history.push('/home');
    } catch (ex) {
      console.log(ex);
    }
  };

  const isLogged = user || false;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {isLogged && <CustomDrawer />}
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => history.push("/mails")}
          >
            <i className="fa fa-thumb-tack" aria-hidden="true"></i> WhileMail
          </Typography>
          {isLogged && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {!user.avatar && <AccountCircle />}
                {user.avatar && <Avatar src={user.avatar} />}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                keepMounted
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
                <MenuItem onClick={() => signOut()}>logout</MenuItem>
              </Menu>
              <ProfileDialog
                open={profileOpen}
                handleClose={handleProfileClose}
              />
            </div>
          )}
          {!isLogged && (
            <Button
              onClick={() => loginModal.setShow(!loginModal.show)}
              variant="contained"
              size="small"
              color="secondary"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default NavBar;
