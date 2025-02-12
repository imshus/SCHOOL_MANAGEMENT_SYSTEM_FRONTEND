import * as Yup from "yup";

export const teacherSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(8, "Student name must contain at least 8 characters.")
    .required("Student Name is required."),

  email: Yup.string()
    .trim()
    .email("Invalid email format.")
    .required("Email is required."),

  password: Yup.string()
    .trim()
    .min(8, "Password must contain at least 8 characters.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required("Password is required."),

  confirm_password: Yup.string()
    .trim()
    .oneOf([Yup.ref("password")], "Confirm Password must match the Password.")
    .required("Confirm Password is required."),

  qualification: Yup.string()
    .trim()
    .required("Qualification Class is required."),

  age: Yup.string()
    .min(1, "Age must be at least 3 years.")
    .max(18, "Age must be less than or equal to 18 years.")
    .required("Age is required."),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection.")
    .required("Gender is required."),
});
