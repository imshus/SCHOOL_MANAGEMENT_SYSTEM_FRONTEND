import * as Yup from "yup";

export const subjectSchema = Yup.object({
  
  subject_name: Yup.string()
    .trim()
    .required("subject Text is required.")
    .min(2,"subject Text must contain at least 2 characters."),

  subject_codename: Yup.string()
    .trim()
    .min(1, "subject Number must contain at least 1 characters.")
    .required("subject Number is required."),
});