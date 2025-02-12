import * as Yup from "yup";

export const registerSchema = Yup.object({
  school_name: Yup.string()
    .trim()
    .min(8, "School name must contain at least 8 characters.")
    .required("School Name is required."),

  email: Yup.string()
    .trim()
    .email("Invalid email format.")
    .required("Email is required."),

  owner_name: Yup.string()
    .trim()
    .min(3, "Owner name must have at least 3 characters.")
    .required("Owner Name is required."),

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
});
