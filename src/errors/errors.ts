const errorPool: { [key: string]: string } = {
  APP_ID_NOT_EXIST: "app-id header is found but the value is not valid.",
  APP_ID_MISSING: "app-id header is not set correctly.",
  PARAMS_NOT_VALID: "URL param is not valid.",
  BODY_NOT_VALID: "Body format is not valid.",
  RESOURCE_NOT_FOUND: "Resource not found.",
  PATH_NOT_FOUND: "Request path is not valid.",
  SERVER_ERROR: "Something is wrong with server, try again later.",
};

exports.errorPool = (error: string | number) => {
  return errorPool[error] ? errorPool[error] : error;
};
