import skillControllers from "../controllers/skills.js";
import middlewares from "../utils/middleware.js";

// export default async (req, res) => {
//   if (req.url.split("/")[5] === undefined) {
//     if (req.url.split("/")[3] === "user")
//       var userId = Number(req.url.split("/")[4]);
//     if (req.url.split("/")[3] === "skill")
//       var userSkillId = Number(req.url.split("/")[4]);

//     if (userId && req.method === "GET") {
//       skillControllers.getSkillsByUserId(req, res, userId);
//     } else if (userId && req.method === "POST") {
//       skillControllers.addSkill(req, res, userId);
//     } else if (userSkillId && req.method === "DELETE") {
//       skillControllers.deleteSkillBySkillId(req, res, userSkillId);
//     } else if (userId && req.method === "DELETE") {
//       skillControllers.deleteSkillsByUserId(req, res, userId);
//     } else if (
//       (!userId &&
//         !userSkillId &&
//         req.url === `/api/skills/user/${req.url.split("/")[4]}`) ||
//       req.url === `/api/skills/skill/${req.url.split("/")[4]}`
//     ) {
//     middlewares.returnError(req, res, 400, "Validation failed!", "ID is not valid, so can't find user/skill based on id");
        
//     //   res.writeHead(400, { "Content-Type": "application/json" });
//     //   res.end(
//     //     JSON.stringify({
//     //       title: "Validation Failed",
//     //       message: "ID is not valid, so can't find user/skill based on id",
//     //     })
//     //   );
//     } else {
//     middlewares.returnError(req, res, 404, "No route!", "Route not found!");

//     //   res.writeHead(404, { "Content-type": "application/json" });
//     //   res.end(
//     //     JSON.stringify({ title: "No route!", message: "Route not found!" })
//     //   );
//     }
//   } else {
//     middlewares.returnError(req, res, 404, "Invalid route!", "Route not found!");
//     // res.writeHead(404, { "Content-type": "application/json" });
//     // res.end(
//     //   JSON.stringify({ title: "Invalid route!", message: "Route not found!" })
//     // );
//   }
// };

export default async (req, res) => {
  let pathSegements = req.url.split("/");
  console.log("SEGMENTS", pathSegements);

  if (pathSegements[4] === undefined) {
    if (pathSegements[3] === undefined) {
      if (req.method === "GET") {
        skillControllers.getSkills(req, res);
      } else if (req.method === "POST") {
        skillControllers.addSkill(req, res);
      } else {
        console.log("path", pathSegements);
        middlewares.returnError(req, res, 404, "not found", "Route not found");
      }
    } else {
      let id = Number(pathSegements[3]);
      if (id) {
        if (req.method === "DELETE") {
          skillControllers.deleteSkills(req, res, id);
        } else {
          console.log("path", pathSegements);
        middlewares.returnError(req, res, 404, "not found", "Route not found");
        }
      } else {
        console.log("path", pathSegements);
        middlewares.returnError(
          req,
          res,
          400,
          "Invalid ID",
          "Invalid skill/user Id"
        );
      }
    }
  } else {
    console.log("path", pathSegements);
    middlewares.returnError(req, res, 404, "not found", "Route not found");
  }
};
