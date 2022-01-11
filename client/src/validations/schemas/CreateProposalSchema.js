import yup from "validations/validations";

const CreateProposalSchema = yup.object().shape({
  address: yup.string("Destination Harmony One wallet address must be a string.")
    .matches(/one1.{38}/, "Not a valid Harmony One wallet address (one1...).")
    .required("Harmony One wallet address is required."),
  amount: yup.number("Amount to delegate must be a positive number.")
    .positive("Amount to delegate must be a positive number.")
    .max(999999999999999, "Amount to delegate must be no larger than 15 characters.")
    .typeError("Amount to delegate must be a positive number.")
    .required("Amount to delegate is required."),
  message: yup.string("Message must be a string."),
});
  
export default CreateProposalSchema;
