// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import sessions from "../data/sessions.json" assert { type: "json" };
import usersServices from "../services/users.js"

const secretKey = "my-secret-key"; // Replace with your secret key

function authenticateToken(req, res, next) {
  // Get the token from the request headers
  let token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    // return res.status(401).json({ message: 'Unauthorized: No token provided' });
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized: No token provided" }));
  } else {
    // Verify the token
    jwt.verify(token, secretKey, async (err, decodedUser) => {
      if (err) {
        //   return res.status(403).json({ message: 'Forbidden: Invalid token' });
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Forbidden: Invalid token" }));
        // let indexToDelete = sessions.findIndex((s) => s.token === token);
        // if (indexToDelete !== -1) {
        //   sessions.splice(indexToDelete, 1);
        //   console.log("REMAINING SESSIONS:", sessions);
        // }

        try {
          await usersServices.logoutUser(token);         
          console.log("Token was invalid but deleted from db"); 
        } catch (error) {
          console.log("Not valid token and couldn't delete from db");
        }
        console.log("YOUR TOKEN IS NOT VALID");
      } else {
        // if (
        //   sessions.some(
        //     (s) => s.token === token && s.userId === decodedUser.userId
        //   )
        // )
        if (
          await usersServices.userTokenExists(token, decodedUser.userId)
        ) 
        {
          console.log("YOURE IN", token);
          req.user = decodedUser;
          req.token = token;
          console.log("user", req.user);
          next();
        } else {
          console.log("YOURE NOT IN");
          returnError(
            req,
            res,
            401,
            "Session not valid",
            "This token is not allowed to use any more to access any api."
          );
        }
        // req.user = decodedUser;
        // console.log("user", req.user);
        // next();
      }
    });
  }
}

const returnError = (req, res, statusCode, title, message) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      title: title,
      message: message,
    })
  );
};

export default { authenticateToken, returnError };
