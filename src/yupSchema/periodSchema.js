import * as Yup from "yup";

export const periodSchema = Yup.object({
  teacher: Yup.string().trim().required("Teacher is required."),
  subject: Yup.string().trim().required("Subject is required."),
  period: Yup.string().trim().required("Period is required."),
  date: Yup.date().required("Date is required."),
});
