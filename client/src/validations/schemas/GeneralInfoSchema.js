import yup from "validations/validations";
import moment from "moment";

const tomorrowUTC = moment.utc().add(1, "days");
const GeneralInfoSchema = yup.object().shape({
  name: yup.string("Pool name must be a string.")
    .min(5, "Pool name must be at least than 5 characters long.")
    .max(50, "Pool name must be less than 50 characters long.")
    .required("Pool name is required."),
  description: yup.string("Pool description must be a string.")
    .min(10, "Pool description must be at least 10 characters long.")
    .max(10000, "Pool description must be less than 10000 characters long.")
    .required("Pool description is required."),
  goal: yup.number("Goal amount must be a positive whole number.")
    .positive("Goal amount must be a positive whole number.")
    .integer("Goal amount must be a positive whole number.")
    .max(999999999999999, "Goal amount must be no larger than 15 characters.")
    .typeError("Goal amount must be a positive whole number.")
    .required("Goal amount is required."),
  end: yup.date("Pool end date must be formatted as a date.")
    .min(tomorrowUTC, `Pool end date must be at least one day after ${tomorrowUTC.format("L")}.`)
    .nullable(true).transform((curr_val, orig_val) => orig_val === "" ? null : curr_val),
});

export default GeneralInfoSchema;
