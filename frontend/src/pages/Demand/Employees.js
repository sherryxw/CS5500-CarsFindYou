import React from "react";
import EmployeeForm from "src/pages/Demand/EmployeeForm.js";
import PageHeader from "../../Demand components/PageHeader.js";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function Employees() {
  const classes = useStyles();

  return (
    <>
      <PageHeader
        title='CarsFindYou'
        subTitle='What car are you looking for?'
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <EmployeeForm />
      </Paper>
    </>
  );
}
