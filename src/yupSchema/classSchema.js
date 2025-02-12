import * as Yup from "yup";

export const classSchema = Yup.object({
  
  class_text: Yup.string()
    .trim()
    .required("Class Text is required.")
    .min(2,"Class Text must contain at least 2 characters."),

  class_num: Yup.string()
    .trim()
    .min(1, "Class Number must contain at least 1 characters.")
    .required("Class Number is required."),
});