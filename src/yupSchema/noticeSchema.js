import * as Yup from "yup";

export const noticeSchema = Yup.object({
  
  title: Yup.string()
    .trim()
    .required("Title is required."),
  message: Yup.string()
    .trim()
    .required("Message is required."),
  audience:Yup.string()
  .trim()
  .required("Audiance is required")
});