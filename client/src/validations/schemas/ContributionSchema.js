import yup from "validations/validations";

const ContributionSchema = yup.object().shape({
  contribution: yup.number("Contribution amount must be a positive number.")
    .positive("Contribution amount must be a positive number.")
    .max(999999999999999, "Contribution amount must be no larger than 15 characters.")
    .typeError("Contribution amount must be a positive number.")
    .required("Contribution amount is required."),
});
  
export default ContributionSchema;
