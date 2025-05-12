import fileApi from "apis/fileApi";

export const localFilesService = {
  uploadTaskPromise: async file => {
    // Create a form and append image with additional fields
    var form = new FormData();
    form.append("image", file);
    const result = await fileApi.upload(form);
    return result;
  },
};
