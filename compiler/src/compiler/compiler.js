const fs = require("fs");
var kill = require("tree-kill");
const { exec, spawn, fork } = require("child_process");
const path = require("path");
const basePath = "./src/compiler/files/";
const folderPath = "./files/";

const saveFile = (name, data) => {
  return new Promise((resolve, reject) => {
    // Saving File
    console.log(" |> Saving file " + name + " ...");
    fs.writeFile(name, data, function (err) {
      if (err) {
        console.log(" |> Save file fail!! : " + err);
        reject();
      } else {
        console.log(" |> The file was saved!");
        resolve();
      }
    });
  });
};

const deleteFile = filename => {
  fs.unlink(filename, function (err) {
    if (err) {
      console.log("SORRY NOT DELETED");
    }
    // if no error, file has been deleted successfully
    console.log("File deleted!");
  });
};

const replaceAllSpecialString = (str, userId) => {
  const regex = /[\.\w:]*([\\\/][\w-]*)*\.(exe|cpp)/gm;
  const subst = `*.$2`;

  const result = str.toString().replace(regex, subst);
  return result;
};

// Function for executing C codes
const cExecute = (data, input, name) => {
  return new Promise((resolve, reject) => {
    const fileName = name ? name + ".c" : "test.c";
    const fileNameInput = name ? name + ".txt" : "test.txt";
    const fileNameOutput = name ? name + ".exe" : "test.exe";
    saveFile(basePath + fileName, data)
      .then(() => {
        // Create Input file
        console.log(" |> Create file input .txt");
        // fs.writeFile(fileNameInput, input, function (err) {
        //   if (err) {
        //     console.log(err);
        //     reject();
        //   }
        // });
        if (input) {
          input = "";
        }
        saveFile(basePath + fileNameInput, input)
          .then(() => {
            // FILE SAVED SUCCESSFULLY
            // Generate the output file for it
            const filePath = path.join(
              __dirname,
              folderPath + fileName,
            );
            console.log("FILE PATH >> " + filePath);

            // COMPILE THE C++ CODES
            exec(
              "gcc " + filePath + " -o " + basePath + fileNameOutput,
              (err, stdout, stderr) => {
                if (err) {
                  // IF COMPILATION ERROR
                  console.error(`exec error: ${err}`);
                  resolve({
                    err: true,
                    output: err,
                    error: stderr,
                  });
                } else {
                  //debug success
                }

                // SUCCESSFULL COMPILATION EXECUTING
                console.log("SUCCESSFULLY COMPILED");
                const fileExe = path.join(
                  __dirname,
                  folderPath + fileNameOutput,
                );
                exec(
                  fileExe + " < " + basePath + fileNameInput,
                  (err, stdout, stderr) => {
                    //Clear file
                    deleteFile(
                      path.join(__dirname, folderPath + fileName),
                    );
                    deleteFile(
                      path.join(
                        __dirname,
                        folderPath + fileNameInput,
                      ),
                    );
                    deleteFile(
                      path.join(
                        __dirname,
                        folderPath + fileNameOutput,
                      ),
                    );
                    if (err) {
                      console.log("ERROR " + err);
                      resolve({
                        err: true,
                        output: err,
                        error: stderr,
                      });
                    }

                    console.log("OUTPUT ", stdout);
                    resolve({
                      err: false,
                      output: stdout,
                    });
                  },
                );
              },
            );
          })
          .catch(() => {
            reject();
          });
      })
      .catch(e => {
        console.log(e);
        console.log("ERROR SAVE FILE" + saveFileRes);
        const err = {
          err: true,
          output: "Internal Server Error!",
        };
        resolve(err);
      });
  });
};

// Function for executing C++ codes
const cPlusPlusExecute = (data, input, name) => {
  if (data.toString().includes("stdlib.h")) {
    return {
      err: false,
      output: "can't support library <stdlib.h>",
    };
  }
  const fileName = name ? name + ".cpp" : "test.cpp";
  const fileNameInput = name ? name + ".txt" : "test.txt";
  const fileNameOutput = name ? name + ".exe" : "test.exe";
  const res = {
    err: false,
    msg: "",
  };
  return new Promise((resolve, reject) => {
    var flag = true;
    saveFile(basePath + fileName, data)
      .then(() => {
        console.log(" |> Create file input .txt");
        // Create Input file
        if (!input) {
          input = "";
        }
        saveFile(basePath + fileNameInput, input)
          .then(() => {
            // FILE SAVED SUCCESSFULLY
            // Generate the output file for it
            const filePath = path.join(
              __dirname,
              folderPath + fileName,
            );
            console.log("FILE PATH >> " + filePath);

            // COMPILE THE C++ CODES
            exec(
              "g++ " + filePath + " -o " + basePath + fileNameOutput,
              (err, stdout, stderr) => {
                if (err) {
                  var x = replaceAllSpecialString(
                    err.toString(),
                    name,
                  );
                  console.error(`1. exec error: ${x}`);
                  resolve({
                    err: true,
                    output: replaceAllSpecialString(err, name),
                    error: stderr,
                  });
                } else {
                }

                // SUCCESSFULL COMPILATION EXECUTING
                console.log("SUCCESSFULLY COMPILED");
                const fileExe = path.join(
                  __dirname,
                  folderPath + fileNameOutput,
                );

                var child;

                setTimeout(function () {
                  if (flag) {
                    console.log("run task kill");
                    kill(child.pid);
                    deleteFile(
                      path.join(
                        __dirname,
                        folderPath + fileNameOutput,
                      ),
                    );
                    resolve({
                      err: false,
                      output: `time out!!\n------\nMaybe because exist infinity loop in your code!`,
                    });
                  }
                }, 10000);

                child = spawn(
                  fileExe + " < " + basePath + fileNameInput,
                  {
                    shell: true,
                    stdio: [
                      "inherit", // StdIn.
                      "pipe", // StdOut.
                      "pipe", // StdErr.
                    ],
                  },
                );

                let mergedOut = "";
                let isError = false;
                let errorOut = "";
                child.stdout.setEncoding("utf8");
                child.stdout.on("data", chunk => {
                  process.stdout.write(chunk, _err => {});
                  mergedOut += chunk;
                });
                child.stderr.setEncoding("utf8");
                child.stderr.on("data", data => {
                  isError = true;
                  errorOut = data;
                });
                // child.stdin.setEncoding("utf8");
                // child.stdin.on("data", data => {
                //   console.log(data);
                //   isError = true;
                //   errorOut = data;
                // });

                child.on("error", err => {
                  console.log(err);
                  reject();
                });

                child.on("'message'", mess => {
                  console.log(mess);
                });

                child.on("close", (_code, _signal) => {
                  flag = false;
                  deleteFile(
                    path.join(__dirname, folderPath + fileNameOutput),
                  );
                  if (isError) {
                    resolve({
                      output: replaceAllSpecialString(errorOut, name),
                    });
                  } else {
                    resolve({
                      output: replaceAllSpecialString(
                        mergedOut,
                        name,
                      ),
                    });
                  }
                });

                child.on("exit", (_code, _signal) => {
                  flag = false;
                  // deleteFile(
                  //   path.join(__dirname, folderPath + fileName),
                  // );
                  // deleteFile(
                  //   path.join(__dirname, folderPath + fileNameInput),
                  // );
                  deleteFile(
                    path.join(__dirname, folderPath + fileNameOutput),
                  );
                  if (isError) {
                    resolve({
                      output: replaceAllSpecialString(errorOut, name),
                    });
                  } else {
                    resolve({
                      output: replaceAllSpecialString(
                        mergedOut,
                        name,
                      ),
                    });
                  }
                });
              },
            );
          })
          .catch(() => {
            reject();
          });
      })
      .catch(e => {
        // console.log("ERROR SAVE FILE"+ saveFileRes)
        console.log("Here ERROR SAVE FILE");
        console.log(e);
        const err = {
          err: true,
          output: "Internal Server Error!",
        };
        resolve(err);
      });
  });
};

const cPlusPlusDebug = (data, name) => {
  if (data.toString().includes("stdlib.h")) {
    return {
      err: false,
      output: "can't support library <stdlib.h>",
    };
  }
  const fileName = name ? name + ".cpp" : "test.cpp";
  const fileNameOutput = name ? name + ".exe" : "test.exe";
  const res = {
    err: false,
    msg: "",
  };
  return new Promise((resolve, reject) => {
    saveFile(basePath + fileName, data)
      .then(() => {
        // FILE SAVED SUCCESSFULLY
        // Generate the output file for it
        const filePath = path.join(__dirname, folderPath + fileName);
        console.log("FILE PATH >> " + filePath);

        // COMPILE THE C++ CODES
        exec(
          "g++ " + filePath + " -o " + basePath + fileNameOutput,
          (err, stdout, stderr) => {
            deleteFile(path.join(__dirname, folderPath + fileName));
            deleteFile(
              path.join(__dirname, folderPath + fileNameOutput),
            );
            if (err) {
              var x = replaceAllSpecialString(err.toString());
              console.error(`1. exec error: ${x}`);
              resolve({
                err: true,
                output: replaceAllSpecialString(err, name),
                error: replaceAllSpecialString(stderr, name),
              });
            } else {
              if (data.toString().includes("system(")) {
                resolve({
                  err: false,
                  output: "can't support function 'system()'",
                });
              }
              resolve({
                err: false,
                output: "Program finished with exit code 0 !",
                error: stderr,
              });
            }
          },
        );
      })
      .catch(e => {
        console.log("Here ERROR SAVE FILE");
        console.log(e);
        const err = {
          err: true,
          output: "Internal Server Error!",
        };
        resolve(err);
      });
  });
};

module.exports = {
  cPlusPlusExecute,
  cExecute,
  cPlusPlusDebug,
};

// exec(
//   fileExe + " < " + basePath + fileNameInput,
//   (err, stdout, stderr) => {
//     flag = false;

//     deleteFile(
//       path.join(__dirname, folderPath + fileName),
//     );
//     deleteFile(
//       path.join(
//         __dirname,
//         folderPath + fileNameInput,
//       ),
//     );
//     deleteFile(
//       path.join(
//         __dirname,
//         folderPath + fileNameOutput,
//       ),
//     );
//     if (err) {
//       console.error(
//         `2. exec error: ${replaceAllSpecialString(
//           err,
//           name,
//         )}`,
//       );

//       resolve({
//         err: true,
//         output: replaceAllSpecialString(err, name),
//         error: replaceAllSpecialString(err, name),
//       });
//     }

//     console.log("OUTPUT ", stdout);
//     resolve({
//       err: false,
//       output: stdout,
//     });
//   },
// );
