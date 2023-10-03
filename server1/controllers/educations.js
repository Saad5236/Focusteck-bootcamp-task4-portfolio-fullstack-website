const generateEducationId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let usersData = req.users;

    if (educations && educations.find((i) => i.userEducationId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import requestBodyParser from "../utils/body-parser.js";
import educationsServices from "../services/educations.js";
import usersServices from "../services/users.js";
import educations from "../data/educations.json" assert { type: "json" };
import middlewares from "../utils/middleware.js";
import users from "../data/users.json" assert { type: "json" };
let educationsData = educations;

// const getAllEducations = async (req, res) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "admin") {
//       if (educationsData.length > 0) {
//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(educationsData));
//         res.end();
//       } else {
//         middlewares.returnError(
//           req,
//           res,
//           404,
//           "project not found",
//           "project you're trying to find does not exist."
//         );
//       }
//     } else if (req.user.userRole === "user") {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

// const getEducationsByUserId = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "user") {
//       let educations = educationsData.filter(
//         (education) => education.userId === userId
//       );
//       if (educations.length > 0) {
//         console.log("first", educations);
//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(educations));
//         res.end();
//       } else {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             title: "educations not found",
//             message: "educations you're trying to find do not exist.",
//           })
//         );
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

const getEducations = (req, res) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      // let educations = educationsData.filter(
      //   (education) => education.userId === req.user.userId
      // );
      // console.log("EDUCATIONS DATA FROM DB", await educationsServices.getEducations(req.user.userId));
      
      // if (educations.length > 0) {
      //   console.log("first", educations);
      //   res.writeHead(200, { "Content-Type": "application/json" });
      //   res.write(JSON.stringify(educations));
      //   res.end();
      // } else {
      //   res.writeHead(404, { "Content-Type": "application/json" });
      //   res.end(
      //     JSON.stringify({
      //       title: "educations not found",
      //       message: "educations you're trying to find do not exist.",
      //     })
      //   );
      // }

      try {
        let educations = await educationsServices.getEducations(req.user.userId)
        if (educations.length > 0) {
          console.log("first", educations);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(educations));
          res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "educations not found",
              message: "educations you're trying to find do not exist.",
            })
          );
        }
      } catch (error) {
        middlewares.returnError(req, res, 400, "Unable to request.", "Unable to send request to find educations.");
        console.log("COULDN'T GET EDUCATIONS FROM DB", error);
      }
      
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

// const getEducationByEducationId = (req, res, userEducationId) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "user") {
//       let education = educationsData.find(
//         (education) => education.userEducationId === userEducationId
//       );
//       if (education) {
//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(education));
//         res.end();
//       } else {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             title: "education not found",
//             message: "education you're trying to find does not exist.",
//           })
//         );
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

// const addEducation = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, async () => {
//     if (req.user.userRole === "user") {
//       if (!users.find((u) => u.userId === userId)) {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             title: "User not found",
//             message: "User for which you are adding education does not exist.",
//           })
//         );
//       } else {
//         try {
//           let body = await requestBodyParser(req);
//           body.userEducationId = generateEducationId();
//           body.userId = userId;
//           educationsData.push(body);
//           res.writeHead(201, { "Content-Type": "application/json" });
//           res.end(JSON.stringify(body));
//         } catch (err) {
//           console.log(err);
//           res.writeHead(400, { "Content-Type": "application/json" });
//           res.end(
//             JSON.stringify({
//               title: "Validation Failed",
//               message: "Request body is not valid",
//             })
//           );
//         }
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

const addEducation = (req, res) => {
  middlewares.authenticateToken(req, res, async () => {
    
    if (req.user.userRole === "user") {
      // console.log("users data in edussss", users);
      // if (!users.find((u) => u.userId === req.user.userId)) {
      //   res.writeHead(404, { "Content-Type": "application/json" });
      //   res.end(
      //     JSON.stringify({
      //       title: "User not found",
      //       message: "User for which you are adding education does not exist.",
      //     })
      //   );
      // } else {
        try {
          let body = await requestBodyParser(req);
          body.userEducationId = generateEducationId();
          body.userId = req.user.userId;
          let addEducationRes = await educationsServices.addEducation(body);
          if(addEducationRes) {
            res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(body));  
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "User not found",
              message: "User not found for which you are entering education.",
            })
          );
          }
          // educationsData.push(body);
          // res.writeHead(201, { "Content-Type": "application/json" });
          // res.end(JSON.stringify(body));
        } catch (err) {
          console.log(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "Validation Failed",
              message: "Request body is not valid",
            })
          );
        }
      // }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

const deleteEducations = async (req, res, id) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "admin") {
      // res.setHeader("Content-Type", "application/json");

      // let removedEducations = educationsData.filter(
      //   (education) => education.userId === id
      // );
      // if (removedEducations.length > 0) {
      //   for (let i = 0; i < educationsData.length; i++) {
      //     if (educationsData[i].userId === id) {
      //       educationsData.splice(i, 1);
      //       i--;
      //     }
      //   }

      //   res.writeHead(200, { "Content-Type": "application/json" });
      //   res.write(JSON.stringify(removedEducations));
      //   res.end();
      // } else {
      //   middlewares.returnError(
      //     req,
      //     res,
      //     404,
      //     "Educations not found",
      //     "User's Educations not found in database"
      //   );
      //   res.end();
      // }

      try {
        let removedEducations = await educationsServices.deleteEducationByUserId(id);
        if(removedEducations) {
      //     res.writeHead(200, { "Content-Type": "application/json" });
      // res.write(JSON.stringify(removedEducations));
      // res.end();
      res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({"title": "Removed successfully", "message": "Education has successfully been removed"}));
          res.end();
    } else {
        middlewares.returnError(
      req,
      res,
      404,
      "Not found.",
      "educations not found in database to delete."
    );
    }
      } catch (error) {
        console.log("COULDN'T remove educations for some reason", error);
        middlewares.returnError(req, res, 400, "Couldn't remove.", "Couldn't remove educations from backend.")
      }
    } else if (req.user.userRole === "user") {
      // let removedEducation = educationsData.find(
      //   (education) => education.userEducationId === id
      // );
      // if (removedEducation) {
      //   if (removedEducation.userId === req.user.userId) {
      //     for (let i = 0; i < educationsData.length; i++) {
      //       if (educationsData[i].userEducationId === id) {
      //         educationsData.splice(i, 1);
      //         break;
      //       }
      //     }

      //     res.writeHead(200, { "Content-Type": "application/json" });
      //     res.write(JSON.stringify(removedEducation));
      //     res.end();
      //     console.log("removedEducation", removedEducation);
      //   } else {
      //     middlewares.returnError(
      //       req,
      //       res,
      //       401,
      //       "User's unauthorized.",
      //       "User is unauthorized to delete this education."
      //     );
      //   }
      // } else {
      //   middlewares.returnError(
      //     req,
      //     res,
      //     404,
      //     "Not found.",
      //     "education not found in database."
      //   );

      //   res.end();
      // }

      try {
        let removedEducation = await educationsServices.deleteEducationByEducationId(id, req.user.userId);
        if(removedEducation) {
              res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({"title": "Removed successfully", "message": "Education has successfully been removed"}));
          res.end();
        } else {
            middlewares.returnError(
          req,
          res,
          404,
          "Not found.",
          "education not found in database or it's not logged in user's education."
        );
        }
      } catch (error) {
        console.log("ERROR DELETING", error);
        middlewares.returnError(
          req,
          res,
          400,
          "Couldn't delete.",
          "Unable to delete education from db."
        );
      }
    }
  });
};

// const deleteEducationByUserId = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, async () => {
//     if (req.user.userRole === "admin") {
//       res.setHeader("Content-Type", "application/json");

//       let removedEducations = educationsData.filter(
//         (education) => education.userId === userId
//       );
//       if (removedEducations.length > 0) {
//         // educationsData = educationsData.filter(
//         //   (education) => education.userId !== userId
//         // );
//         for (let i = 0; i < educationsData.length; i++) {
//           if (educationsData[i].userId === userId) {
//             educationsData.splice(i, 1);
//             i--;
//           }
//         }

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(removedEducations));
//         res.end();
//       } else {
//         res.statusCode = 404;
//         res.write(
//           JSON.stringify({
//             title: "Not Found",
//             message: "User's educations not found in database",
//           })
//         );
//         res.end();
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "user unauthorized",
//         "user not authorized to acces this api"
//       );
//     }
//   });
// };

// const deleteEducationByEducationId = (req, res, userEducationId) => {
//   middlewares.authenticateToken(req, res, async () => {
//     if (req.user.userRole === "user") {
//       res.setHeader("Content-Type", "application/json");

//       let removedEducation = educationsData.find(
//         (education) => education.userEducationId === userEducationId
//       );
//       if (removedEducation) {
//         for (let i = 0; i < educationsData.length; i++) {
//           if (educationsData[i].userEducationId === userEducationId) {
//             educationsData.splice(i, 1);
//             break;
//           }
//         }

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(removedEducation));
//         res.end();
//         console.log("removedEducation", removedEducation);
//       } else {
//         res.statusCode = 404;
//         res.write(
//           JSON.stringify({
//             title: "Not Found",
//             message: "education not found in database",
//           })
//         );
//         res.end();
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

// const updateEducation = (req, res, userEducationId) => {
//   middlewares.authenticateToken(req, res, async () => {
//     if (req.user.userRole === "user") {
//       try {
//         let body = await requestBodyParser(req);
//         let updateEducationIndex = educationsData.findIndex(
//           (u) => u.userEducationId === userEducationId
//         );

//         if (updateEducationIndex === -1) {
//           console.log("NOOO");
//           res.writeHead(404, { "Content-Type": "application/json" });
//           res.end(
//             JSON.stringify({
//               title: "education not found",
//               message: "education you're trying to update does not exist.",
//             })
//           );
//           // res.statusCode = 404;
//           // res.write(
//           //   JSON.stringify({ title: "Not Found", message: "education not found" })
//           // );
//         } else {
//           console.log("YES");
//           body.userEducationId = userEducationId;
//           educationsData[updateEducationIndex] = body;
//           res.writeHead(200, { "Content-Type": "application/json" });
//           res.end(JSON.stringify(educationsData[updateEducationIndex]));
//         }
//       } catch (e) {
//         console.log(e);
//         res.writeHead(400, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             title: "Validation Failed",
//             message: "Request body is not in valid format",
//           })
//         );
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

const updateEducation = (req, res, userEducationId) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      try {
        let body = await requestBodyParser(req);

        try {
          let updateEducationData = await educationsServices.updateEducation(userEducationId, req.user.userId, body);
          if(updateEducationData) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updateEducationData));
          } else {
            console.log("error updating education", error);
            middlewares.returnError(req, res, 404, "Couldn't update.", "Error updating education's data.")
          }
        } catch (error) {
          console.log("error updating education", error);
          middlewares.returnError(req, res, 400, "Couldn't update.", "Error updating education's data.")
        }

        // let updateEducationIndex = educationsData.findIndex(
        //   (u) => u.userEducationId === userEducationId
        // );

        // if (updateEducationIndex === -1) {
        //   console.log("NOOO");
        //   res.writeHead(404, { "Content-Type": "application/json" });
        //   res.end(
        //     JSON.stringify({
        //       title: "education not found",
        //       message: "education you're trying to update does not exist.",
        //     })
        //   );
        // } else {
        //   if (educationsData[updateEducationIndex].userId === req.user.userId) {
        //     console.log("YES");
        //     body.userId = req.user.userId;
        //     body.userEducationId = userEducationId;
        //     educationsData[updateEducationIndex] = body;
        //     res.writeHead(200, { "Content-Type": "application/json" });
        //     res.end(JSON.stringify(educationsData[updateEducationIndex]));
        //   } else {
        //     middlewares.returnError(
        //       req,
        //       res,
        //       401,
        //       "Not authorized",
        //       "education you're accessing doesn't belong to you."
        //     );
        //   }
        // }
      } catch (e) {
        console.log(e);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Validation Failed",
            message: "Request body is not in valid format",
          })
        );
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

// else {
//   middlewares.returnError(
//     req,
//     res,
//     401,
//     "Not authorized",
//     "project you're accessing doesn't belong to you."
//   );
// }

// export default {
//   getAllEducations,
//   getEducationsByUserId,
//   getEducationByEducationId,
//   addEducation,
//   deleteEducationByUserId,
//   deleteEducationByEducationId,
//   updateEducation,
// };

export default {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducations,
};
