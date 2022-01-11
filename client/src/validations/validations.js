import * as yup from "yup";
import * as _ from "lodash";

// uniqueProperty adapted from https://github.com/jquense/yup/issues/345#issuecomment-717400071
yup.addMethod(yup.array, "uniqueProperty", function(propertyPath, message) {
  return this.test("unique", "", function(list) {
    const errors = [];
    list.forEach((item, index) => {
      const propertyValue = _.get(item, propertyPath);
      if (propertyValue && _.filter(list, [propertyPath, propertyValue]).length > 1) {
        errors.push(this.createError({
            path: `${this.path}[${index}].${propertyPath}`,
            message,
        }));
      }
    });
    if (!_.isEmpty(errors))
      throw new yup.ValidationError(errors);
    return true;
  });
});

yup.addMethod(yup.array, "unique", function(message, mapper = a => a) {
  return this.test("unique", message, function(list) {
    return list.length  === new Set(list.map(mapper)).size;
  });
});

export default yup;
