export const checkRequiredFields = (fieldsConfig, requestBody) => {
  for (const fieldInfo of fieldsConfig) {
    const fieldValue = requestBody[fieldInfo.field];
    if (!fieldValue) {
      const error = new Error(`Missing required field: ${fieldInfo.name}`);
      error.status = 400;
      throw error;
    }
  }
};
