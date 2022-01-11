import yup from "validations/validations";

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
  end: yup.number("Pool duration must be a positive whole number.")
    .positive("Pool duration must be a positive whole number.")
    .integer("Pool duration must be a positive whole number.")
    .min(1, "Pool duration must be at least one day")
    .typeError("Pool duration must be a positive whole number.")
    .required("Pool duration is required."),
});

export default GeneralInfoSchema;
