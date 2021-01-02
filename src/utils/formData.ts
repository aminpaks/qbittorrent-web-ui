export const getFormData = (obj: object) => {
  const body = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    body.set(key, value);
  });

  return body;
};
