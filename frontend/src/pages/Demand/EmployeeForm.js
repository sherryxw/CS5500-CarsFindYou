import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../Demand components/controls/Controls.js";
import { useForm, Form } from "../../Demand components/useForm.js";
import * as employeeService from "src/pages/Demand/employeeService.js";
import api from "src/api";
import _ from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

const drivetrainItems = [
  { id: "allwheeldrive", title: "All-Wheel Drive" },
  { id: "frontwheeldrive", title: "Front-Wheel Drive" },
  { id: "rearwheeldrive", title: "Rear-Wheel Drive" },
];

const initialFValues = {
  dealerId: 0,
  title: "",
  carMake: "",
  carModel: "",
  carYear: "",
  zip: "",
  mileage: "",
  drivetrain: "",
  radius: "",
  trim: "",
  color: "",
  price: "",
  comment: "",
  description: "",
  vin: "",
  isCorrect: false,
};

export default function EmployeeForm() {
  const { user } = useAuth0();
  const history = useHistory();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("carMake" in fieldValues)
      temp.carMake = fieldValues.carMake ? "" : "This field is required.";
    if ("carModel" in fieldValues)
      temp.carModel = fieldValues.carModel ? "" : "This field is required.";
    if ("zip" in fieldValues)
      temp.zip =
        fieldValues.zip.length > 4 ? "" : "Minimum 5 numbers required.";
    if ("mileage" in fieldValues)
      temp.mileage = fieldValues.mileage ? "" : "This field is required.";
    if ("price" in fieldValues)
      temp.price = fieldValues.price ? "" : "This field is required.";
    if ("carYear" in fieldValues)
      temp.carYear =
        fieldValues.carYear.length > 3 ? "" : "Minimum 4 numbers required.";
    if ("radius" in fieldValues)
      temp.radius =
        fieldValues.radius.length != 0 ? "" : "This field is required.";
    if ("title" in fieldValues) {
      temp.title = !fieldValues.title ? "This field is required" : "";
    }
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const cloneValues = _.cloneDeep(values);
      cloneValues.userId = _.get(user, "sub", "");
      api.post
        .create(cloneValues)
        .then((res) => {
          alert("car added succefully");
          resetForm();
          history.push("/");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name='title'
            label='Post Title'
            value={values.title}
            onChange={handleInputChange}
            error={errors.title}
          />
          <Controls.Input
            name='carMake'
            label='Car Make'
            value={values.carMake}
            onChange={handleInputChange}
            error={errors.carMake}
          />
          <Controls.Input
            label='Car Model'
            name='carModel'
            value={values.carModel}
            onChange={handleInputChange}
            error={errors.carModel}
          />
          <Controls.Input
            label='Year'
            name='carYear'
            value={values.carYear}
            onChange={handleInputChange}
            error={errors.carYear}
          />
          <Controls.Input
            label='Mileage'
            name='mileage'
            value={values.mileage}
            onChange={handleInputChange}
            error={errors.mileage}
          />
          <Controls.Select
            name='radius'
            label='Radius'
            value={values.radius}
            onChange={handleInputChange}
            options={employeeService.getRadiusCollection()}
            error={errors.radius}
          />
          <Controls.Input
            label='Zip'
            name='zip'
            value={values.zip}
            onChange={handleInputChange}
            error={errors.zip}
          />
          <Controls.Input
            label='Out-the-door price'
            name='price'
            value={values.price}
            onChange={handleInputChange}
            error={errors.price}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.RadioGroup
            name='drivetrain'
            label='Drivetrain'
            value={values.drivetrain}
            onChange={handleInputChange}
            items={drivetrainItems}
          />
          <Controls.Input
            label='Trim(Optional)'
            name='trim'
            value={values.trim}
            onChange={handleInputChange}
          />
          <Controls.Input
            label='Color(Optional)'
            name='color'
            value={values.color}
            onChange={handleInputChange}
          />
          <Controls.Input
            label='VIN(Optional)'
            name='vin'
            value={values.vin}
            onChange={handleInputChange}
          />
          <Controls.Input
            label='Comment Box(Additional Details)'
            name='comment'
            value={values.comment}
            onChange={handleInputChange}
          />
          <Controls.Input
            label='Description'
            name='description'
            value={values.description}
            onChange={handleInputChange}
          />
          <Controls.Checkbox
            name='isCorrect'
            label='Once submitted, it cannot be modified, the form will reset.'
            value={values.isCorrect}
            onChange={handleInputChange}
          />
          <div>
            <Controls.Button type='submit' text='Submit' />
            <Controls.Button text='Reset' color='default' onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
