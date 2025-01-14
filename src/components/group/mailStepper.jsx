import React, { useEffect, useState, useRef } from "react";
import { saveMail, getMail, updateMail } from "../../services/mailService";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import monthAndDays from "../../utils/monthsAndDays";

import JoditEditor from "jodit-react";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="outlined" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  textField_time: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: 100,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Create Mail", "Select Schedule", "Review"];
}

const initialMailForm = {
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  body: "",
  cronExpression: "",
  recur: "daily",
  minute: "*",
  hour: "*",
  day: "*",
  month: "*",
  weekDay: "*",
  year: "*",
};

const generateArray = (from, to) => {
  let ar = [];
  if (to < from) return ar;
  for (let i = from; i <= to; i++) {
    ar.push(i);
  }
  return ar;
};

const cronAttributeLists = {
  minuteList: generateArray(0, 59),
  hourList: generateArray(0, 23),
  dayList: generateArray(1, 31),
  monthList: generateArray(1, 12),
  weekDayList: generateArray(1, 7),
};
const recurList = {
  hourly: ["minute"],
  daily: ["minute", "hour"],
  weekly: ["minute", "hour", "weekDay"],
  monthly: ["minute", "hour", "day"],
  yearly: ["minute", "hour", "day", "month"],
  custom: ['cronExpression']
};

export default function MailStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [mailForm, setMailForm] = useState(initialMailForm);

  useEffect(() => {
    populateMail();
  }, []);

  async function populateMail() {
    try {
      const MailId = props.match.params.id;
      if (MailId === "new") return;
      const { data: mail } = await getMail(MailId);
      const attributesArray = mail.cronExpression.toString().split(' ');
      mail.minute = attributesArray[ 0 ];
      mail.hour = attributesArray[ 1 ];
      mail.day = attributesArray[ 2 ];
      mail.month = attributesArray[ 3 ];
      mail.weekDay = attributesArray[ 4 ];
      mail.year = attributesArray[ 5 ];
      setMailForm(mail);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        props.history.replace("/not-found");
      if (ex.response) {
        setMailForm({ ...mailForm, error: ex.response.data });
      }
    }
  }

  const toArray = (str) => {
    if (str) {
      return str
        .toString()
        .split(",")
        .map((s) => s.trim());
    } else str = [];
    return str;
  };

  const onSubmit = async () => {
    const id = props.match.params.id;

    let { to, cc, bcc, body, subject, cronExpression, recur,
       minute, hour, day, month, weekDay, year  } = mailForm;

    if(recur !== 'custom'){

      cronExpression = `${minute} ${hour} ${day} ${month} ${weekDay} ${year}`;
    }

    let data = { to, cc, bcc, body, subject, cronExpression, recur };
    console.log(data);
    // data.to = data.to.trim();
    data.to = toArray(data.to);
    data.cc = toArray(data.cc);
    data.bcc = toArray(data.bcc);

    try {
      if (id === "new") {
        //post
        await saveMail(data);
      } else {
        //put
        await updateMail(id, data);
      }
      props.history.push("/mails");
    } catch (ex) {
      if (ex.response) {
        setMailForm({ ...mailForm, error: ex.response.data });
      }
    }
  };

  function onChange(e) {
    e.persist();
    setMailForm({ ...mailForm, [e.target.name]: e.target.value });
    console.log(mailForm);
  }

  const handleNext = (activeStep, steps) => {
    if (activeStep === steps.length - 1) {
      onSubmit();
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {
          <div>
            <Typography className={classes.instructions}>
              {activeStep === 0 && (
                <MailForm
                  mailForm={mailForm}
                  setMailForm={setMailForm}
                  onChange={onChange}
                />
              )}
              {activeStep === 1 && (
                <ScheduleForm
                  mailForm={mailForm}
                  setMailForm={setMailForm}
                  onChange={onChange}
                />
              )}
              {activeStep === 2 && (
                <ReviewForm
                  mailForm={mailForm}
                  setMailForm={setMailForm}
                  onChange={onChange}
                  handleSubmit={onSubmit}
                />
              )}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNext(activeStep, steps)}
              >
                {activeStep === steps.length - 1 ? "Send Mail" : "Next"}
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

function ScheduleForm({ mailForm, onChange, readonly }) {
  const { minute, hour, day, month, weekDay } = mailForm;
  const { minuteList, hourList, dayList, monthList, weekDayList } =
    cronAttributeLists;
    
  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid item>
          <CustomSelect
            label="recur"
            onChange={onChange}
            value={mailForm.recur}
            list={["hourly", "daily", "weekly", "monthly", "yearly", "custom"]}
            readonly={readonly}
            helperText={"NOTE: it follows UTC time"}
          />
        </Grid>
        {recurList[mailForm.recur].includes("cronExpression") && (
          <Grid item>
            <TextField
              id="cronExpression"
              name="cronExpression"
              label="cron expression :"
              value={mailForm.cronExpression}
              onChange={onChange}
              fullWidth
              helperText={"enter amazon cron expression"}
              variant="outlined"
              InputProps={{
                readOnly: readonly,
              }}
            />
          </Grid>
        )}
        {recurList[mailForm.recur].includes("minute") && (
          <Grid item>
            <CustomSelect
              label="minute"
              onChange={onChange}
              value={minute}
              list={minuteList}
              readonly={readonly}
            />
          </Grid>
        )}
        {recurList[mailForm.recur].includes("hour") && (
          <Grid item>
            <CustomSelect
              label="hour"
              onChange={onChange}
              value={hour}
              list={hourList}
              readonly={readonly}
            />{" "}
          </Grid>
        )}
        {recurList[mailForm.recur].includes("day") && (
          <Grid item>
            <CustomSelect
              label="day"
              onChange={onChange}
              value={day}
              list={dayList}
              readonly={readonly}
            />{" "}
          </Grid>
        )}
        {recurList[mailForm.recur].includes("month") && (
          <Grid item>
            <CustomSelect
              label="month"
              onChange={onChange}
              value={month}
              list={monthList}
              readonly={readonly}
            />{" "}
          </Grid>
        )}
        {recurList[mailForm.recur].includes("weekDay") && (
          <Grid item>
            <CustomSelect
              label="weekDay"
              onChange={onChange}
              value={weekDay}
              list={weekDayList}
              readonly={readonly}
            />{" "}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function CustomSelect({ label, onChange, value, list, readonly }) {

  return (
    // <FormControl className={classes.formControl}>
    //   <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
    //   <Select
    //     labelId="demo-mutiple-chip-label"
    //     id="demo-mutiple-chip"
    //     multiple
    //     value={personName}
    //     onChange={onChange}
    //     input={<Input id="select-multiple-chip" />}
    //     renderValue={(selected) => (
    //       <div className={classes.chips}>
    //         {selected.map((value) => (
    //           <Chip key={value} label={value} className={classes.chip} />
    //         ))}
    //       </div>
    //     )}
    //     MenuProps={MenuProps}
    //   >
    //     {list.map((name) => (
    //       <MenuItem
    //         key={name}
    //         value={name}
    //         style={getStyles(name, personName, theme)}
    //       >
    //         {name}
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
    <FormControl>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id={label}
        value={value}
        name={label}
        // inputRef={refScheduled}
        onChange={onChange}
        style={{ width: 130, marginRight: 20, marginTop: 20 }}
        // error={errors.scheduled && 1}
        required="true"
        InputProps={{
          readOnly: readonly,
        }}
      >
        {list.map((d) => (
          <MenuItem value={d}>{d}</MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {/* {errors.scheduled && errors.scheduled.message} */}
      </FormHelperText>
    </FormControl>
  );
}

function MailForm({ mailForm, setMailForm, onChange, readonly }) {
  const classes = useStyles();

  if (!readonly) readonly = false;

  const config = {
    readonly,
    height: 300,
  };
  const editor = useRef(null);

  function createMarkup(text) {
    return {
      __html: text,
    };
  }

  return (
    <Container>
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="row">
          <TextField
            style={{ maxWidth: 700 }}
            id="to"
            name="to"
            label="to :"
            fullWidth
            value={mailForm.to}
            onChange={onChange}
            helperText={"enter , separated emails"}
            variant="outlined"
            multiline
            InputProps={{
              readOnly: readonly,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            id="cc"
            name="cc"
            label="Cc :"
            fullWidth
            value={mailForm.cc}
            onChange={onChange}
            helperText={"enter , separated emails"}
            variant="outlined"
            multiline
            InputProps={{
              readOnly: readonly,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            id="bcc"
            name="bcc"
            label="Bcc :"
            fullWidth
            value={mailForm.bcc}
            onChange={onChange}
            helperText={"enter , separated emails"}
            variant="outlined"
            multiline
            InputProps={{
              readOnly: readonly,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            id="subject"
            name="subject"
            label="subject :"
            fullWidth
            multiline
            value={mailForm.subject}
            onChange={onChange}
            variant="outlined"
            InputProps={{
              readOnly: readonly,
            }}
          />
        </Grid>
        <Grid item>
          {readonly === false && (
            <JoditEditor
              ref={editor}
              value={mailForm.body}
              config={config}
              onBlur={(event) => setMailForm({ ...mailForm, body: event })}
              // onChange={(content) => console.log(content)}
            />
          )}
          {readonly === true && (
            <>
              Body:{" "}
              <div dangerouslySetInnerHTML={createMarkup(mailForm.body)}></div>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

function ReviewForm({ mailForm, setMailForm, onChange }) {
  return (
    <Container>
      <MailForm
        mailForm={mailForm}
        setMailForm={setMailForm}
        onChange={onChange}
        readonly={true}
      />
      <ScheduleForm
        mailForm={mailForm}
        setMailForm={setMailForm}
        onChange={onChange}
        readonly={true}
      />
      {mailForm.error && <Alert severity="error">{mailForm.error}</Alert>}
    </Container>
  );
}

// function MailForm(props) {
//   console.log(monthAndDays);

//   const classes = useStyles();
//   const [month, setMonth] = useState(1);
//   const [scheduled, setSchedule] = useState("recurring");
//   const [time, setTime] = useState("07:00");
//   const [weekDay, setWeekDay] = useState(1);
//   const [monthDay, setMonthDay] = useState(1);
//   const editor = useRef(null);

//   const schedules = ["recurring", "weekly", "monthly", "yearly"];
//   const weekDays = [
//     { value: 0, day: "Sunday" },
//     { value: 1, day: "Monday" },
//     { value: 2, day: "Tuesday" },
//     { value: 3, day: "Wednesday" },
//     { value: 4, day: "Thursday" },
//     { value: 5, day: "Friday" },
//     { value: 6, day: "Saturday" },
//   ];

//   const [monthDays, setMonthDays] = useState([]);

//   useEffect(() => {
//     for (let i = 1; i <= 31; i++) {
//       monthDays.push(i);
//     }
//     setMonthDays(monthDays);
//   }, []);

//   // const { ref: refTo } = register("to");
//   // const { ref: refSubject } = register("subject");

//   const handleUpdate = (event) => {
//     setBody(event);
//   };

//   return (
//     <Container>
//       <form>
//         <Grid container direction="column" spacing={2}>
//           <Grid item container direction="row">
//             <TextField
//               style={{ maxWidth: 700 }}
//               id="to"
//               name="to"
//               label="to :"
//               fullWidth
//               value={to}
//               onChange={(event) => setTo(event.target.value)}
//               helperText={"enter , separated emails"}
//             />
//           </Grid>
//           <Grid item>
//             <TextField
//               id="cc"
//               name="cc"
//               label="CC :"
//               fullWidth
//               value={cc}
//               onChange={(event) => setCc(event.target.value)}
//               helperText={"enter , separated emails"}
//             />
//           </Grid>
//           <Grid item>
//             <TextField
//               id="subject"
//               name="subject"
//               label="subject :"
//               fullWidth
//               value={subject}
//               onChange={(event) => setSubject(event.target.value)}
//             />
//           </Grid>
//           <Grid item>
//             <Grid container direction="row" spacing={2}>

//               {scheduled && scheduled === "yearly" && (
//                 <>
//                   <FormControl>
//                     <InputLabel id="month">Month</InputLabel>
//                     <Select
//                       labelId="month"
//                       id="month"
//                       value={month}
//                       onChange={(event) => setMonth(event.target.value)}
//                       style={{ width: 130, marginRight: 20 }}
//                       required="true"
//                     >
//                       {monthAndDays.map((m) => (
//                         <MenuItem value={m.value}>{m.month}</MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl>
//                     <InputLabel id="monthDay">Day of month</InputLabel>
//                     <Select
//                       labelId="monthDay"
//                       id="monthDay"
//                       value={monthDay}
//                       // inputRef={refScheduled}
//                       onChange={(event) => setMonthDay(event.target.value)}
//                       style={{ width: 130, marginRight: 20 }}
//                       // error={errors.scheduled && 1}
//                       required="true"
//                     >
//                       {monthAndDays[month - 1].days.map((d) => (
//                         <MenuItem value={d}>{d}</MenuItem>
//                       ))}
//                     </Select>
//                     <FormHelperText>
//                       {/* {errors.scheduled && errors.scheduled.message} */}
//                     </FormHelperText>
//                   </FormControl>
//                 </>
//               )}
//               {scheduled && scheduled === "monthly" && (

//               )}

//               {scheduled && scheduled === "weekly" && (
//                 <FormControl>
//                   <InputLabel id="weekDay">Day of Week</InputLabel>
//                   <Select
//                     labelId="weekDay"
//                     id="weekDay"
//                     value={weekDay}
//                     // inputRef={refScheduled}
//                     onChange={(event) => setWeekDay(event.target.value)}
//                     style={{ width: 150, marginRight: 20 }}
//                   >
//                     {weekDays.map((w) => (
//                       <MenuItem value={w.value}>{w.day}</MenuItem>
//                     ))}
//                   </Select>
//                   <FormHelperText>
//                     {/* {errors.scheduled && errors.scheduled.message} */}
//                   </FormHelperText>
//                 </FormControl>
//               )}

//               {scheduled && scheduled !== "recurring" && (
//                 <form>
//                   <TextField
//                     id="time"
//                     label="Select Time"
//                     type="time"
//                     defaultValue="07:30"
//                     value={time}
//                     onChange={(event) => setTime(event.target.value)}
//                     className={classes.textField_time}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     inputProps={{
//                       step: 300, // 5 min
//                     }}
//                   />
//                   <FormHelperText>click on clock icon</FormHelperText>
//                 </form>
//               )}
//             </Grid>
//           </Grid>
//           <Grid item>
//             <JoditEditor
//               ref={editor}
//               value={body}
//               config={config}
//               onBlur={handleUpdate}
//               // onChange={(content) => console.log(content)}
//             />
//           </Grid>
//           <Grid item>
//             {error && (
//               <Grid item>
//                 <div variant="danger">{error}</div>;
//               </Grid>
//             )}
//             <Grid item>
//               <Button
//                 startIcon={<SaveIcon />}
//                 variant="contained"
//                 style={{ backgroundColor: "lightGreen" }}
//                 margin="medium"
//                 onClick={() => onSubmit()}
//               >
//                 Send
//               </Button>
//             </Grid>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// }
