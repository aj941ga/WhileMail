import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import { Link } from "react-router-dom";
import monthAndDays from "../../utils/monthsAndDays";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function MailCard({ mails: mailsList, onDelete }) {
  const [mails, setMails] = React.useState(mailsList);

  useEffect(() => {
    setMails(mailsList);
  }, [mailsList]);

  return (
    <>
      {mails &&
        mails.map((mail) => (
          <MailsList key={mail.id} currmail={mail} onDelete={onDelete} />
        ))}
    </>
  );
}

function createMarkup(text) {
  return {
    __html: text,
  };
}

function MailsList({ currmail, onDelete }) {
  const [mail, setMail] = React.useState(currmail);

  const classes = useStyles();
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  const handleMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <Grid item key={mail.id} xs={12} sm={6} md={4}>
      <Card className={classes.root}>
        <CardHeader
          style={{ fontSize: 10 }}
          action={
            <IconButton
              aria-label="settings"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <MoreVertIcon />
            </IconButton>
          }
          titleTypographyProps={{ variant: "h6" }}
          title={
            <Chip color="secondary" label={mail.recur} size="small"></Chip>
          }
          subheader={
            <ScheduleDate cron={mail.cronExpression} recur={mail.recur} />
          }
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div">
            <Grid container direction="column" spacing={2}>
              <Grid item container direction="row">
                <Grid item>To :</Grid>
                <Grid item>
                  <MailChips emails={mail.to} />
                </Grid>
              </Grid>
              <Grid item container direction="row">
                <Grid item>CC :</Grid>
                <Grid item>
                  <MailChips emails={mail.cc} />
                </Grid>
              </Grid>
              <Grid item container direction="row">
                <Grid item>Subject :</Grid>
                <Grid item>{mail.subject}</Grid>
              </Grid>
              <Grid item container direction="row">
                <Grid item>Body :</Grid>
                <Grid item>
                  <div dangerouslySetInnerHTML={createMarkup(mail.body)}></div>
                </Grid>
              </Grid>
            </Grid>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Menu
            id="settings"
            anchorEl={anchor}
            open={open}
            keepMounted
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link to={`mailForm/${mail.id}`}>update</Link>
            </MenuItem>
            <MenuItem onClick={() => onDelete(mail.id)}>Delete</MenuItem>
          </Menu>
        </CardActions>
      </Card>
    </Grid>
  );
}

function ScheduleDate({ cron, recur: scheduled }) {
  const cronAttributes = cron.toString().split(" ");
  const minute = cronAttributes[0];
  const hour = cronAttributes[1];
  const day = cronAttributes[2];
  const month = cronAttributes[3];
  const weekDay = cronAttributes[4];
  const year = cronAttributes[5];
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      {scheduled === "hourly" && (
        <Chip
          color="secondary"
          label={`every hour at ${minute} minute`}
          size="small"
        />
      )}
      {scheduled === "daily" && (
        <Chip
          color="secondary"
          label={`every day at ${hour}:${minute}`}
          size="small"
        />
      )}
      {scheduled === "weekly" && (
        <Chip
          color="secondary"
          label={`every ${weekDays[weekDay]} at ${hour}:${minute}`}
          size="small"
        />
      )}
      {scheduled === "monthly" && (
        <Chip
          color="secondary"
          label={`${day} of every month at ${hour}:${minute}`}
          size="small"
        />
      )}
      {scheduled === "yearly" && (
        <Chip
          color="secondary"
          label={`every ${day} of ${
            monthAndDays[month - 1].month
          } at ${hour}:${minute}`}
          size="small"
        />
      )}
      {scheduled === "custom" && (
        <Chip color="secondary" label={cron} size="small" />
      )}
    </>
  );
}

function MailChips({ emails }) {
  if (!emails) return <></>;
  return emails.map((m) => (
    <Chip
      color="primary"
      key={m}
      size="small"
      label={m}
      style={{ margin: 5 }}
    />
  ));
}
