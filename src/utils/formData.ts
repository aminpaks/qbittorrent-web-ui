export const getFormData = (obj: object) => {
  const body = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      body.set(key, value);
    }
  });

  return body;
};

export const getFormDataFileList = (
  data: object,
  { fieldName, files, fileNames = [] }: { fieldName: string; files: File[]; fileNames?: string[] }
) => {
  const form = getFormData(data);

  files.forEach((file, idx) => {
    form.append(fieldName, file, fileNames[idx]);
  });

  return form;
};
