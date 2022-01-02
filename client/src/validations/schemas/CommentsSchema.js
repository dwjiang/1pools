import yup from "validations/validations";

const CommentsSchema = yup.object().shape({
  content: yup.string("Message must be a string.")
    .min(1, "Message must be at least 1 characters long.")
    .max(1000, "Message must be less than or equal 1000 characters long.")
    .required("Message is required."),
});
  
export default CommentsSchema;
