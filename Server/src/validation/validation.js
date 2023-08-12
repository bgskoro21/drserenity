import { ResponseError } from "../err/response-error.js";

export const validate = (schema, request) => {
  const { error, value } = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const validationErrors = error.details.map((detail) => {
      return {
        field: detail.context.key,
        message: detail.message,
      };
    });
    throw validationErrors;
  } else {
    return value;
  }
};
