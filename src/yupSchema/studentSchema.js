import * as Yup from "yup";

export const studentSchema = Yup.object({
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

  student_class: Yup.string()
    .trim()
    .required("Student Class is required."),

  age: Yup.string()
    .min(1, "Age must be at least 3 years.")
    .max(18, "Age must be less than or equal to 18 years.")
    .required("Age is required."),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection.")
    .required("Gender is required."),

  guardian: Yup.string()
    .trim()
    .min(3, "Guardian name must contain at least 3 characters.")
    .required("Guardian Name is required."),

  guardian_phone: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Guardian phone number must be exactly 10 digits."
    )
    .required("Guardian Phone Number is required."),
});
