export const getFormData = (obj: object) => {
  const body = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      body.set(key, value);
    }
  });

  return body;
};
