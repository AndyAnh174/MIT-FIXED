import firebase from "firebase/compat/app";
import { storage } from ".";

export const filesService = {
  uploadFile: async (
    pathName = "public/images/",
    fileName = "unset",
    file,
    callback,
    progressCallback,
  ) => {
    try {
      if (file) {
        const uploadTask = storage.ref(pathName + fileName).put(file);
        await uploadTask.on(
          "state_changed",
          function (snapshot) {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressCallback(progress);
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;

              case "storage/canceled":
                // User canceled the upload
                break;
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
              default:
                break;
            }
          },
          async function () {
            // Upload completed successfully, now we can get the download URL
            await uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log("File available at", downloadURL);
                callback(downloadURL);
              });
          },
        );
      }
    } catch (e) {
      console.log("upload fail");
    }
  },
  uploadTaskPromise: async (path, file) => {
    return new Promise(function (resolve, reject) {
      const storageRef = storage.ref(path);
      const uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function error(err) {
          console.log("error", err);
          reject();
        },
        function complete() {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              resolve(downloadURL);
            });
        },
      );
    });
  },
};
