export const userRegisterSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 20,
    },
  },
  required: ["email", "password"],
};
