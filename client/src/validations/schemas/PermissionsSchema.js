import yup from "validations/validations";

const PermissionsSchema = yup.object().shape({
  owners: yup.array().of(
    yup.object().shape({  
      address: yup.string("Owner's Harmony One wallet address must be a string.")
        .matches(/one1.{38}/, "Not a valid Harmony One wallet address (one1...).")
        .required("Harmony One wallet address is required."),
    }),
    ).min(1, "A pool must have at least one owner or the funds would be unrecoverable.")
    .uniqueProperty("address", "Owner wallet addresses need to be unique."),
  ownersForProposal: yup.number("Minimum owners for proposal must be a positive whole number.")
    .min(1, "Minimum owners for proposal must be at least 1")
    .integer("Minimum owners for proposal must be a positive whole number.")
    .test({
      name: "max",
      message: "Minimum owners for proposal must not be more than the total number of owners.",
      test: function (value) { 
        return value <= this.parent.owners.length
      }
    }).typeError("Minimum owners for proposal must be a positive integer."),
});

export default PermissionsSchema;
