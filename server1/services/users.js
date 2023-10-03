import db from "../config.js";

const generateUserId = async () => {
  let id, col;
  try {
    col = await getUsersColumn("userId");

    console.log("FHKBEK", col);
  } catch (error) {
    console.log("UFEBFBE", error);
  }
  while (true) {
    id = Math.floor(Math.random() * (99999999 - 10) + 10);

    if (col.length > 0 && col.find((i) => i === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

const getUsers = async () => {
  const getUsersQuery = `SELECT * FROM users`;

  try {
    let [users] = await db.query(getUsersQuery);
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].userImgSrc)
          users[i].userImgSrc = users[i].userImgSrc.toString("base64");
      }
    }
    console.log("USERS DATA", users);
    return users;
  } catch (error) {
    console.log("error", error);
  }
};

const filterAllUsers = async (searchQuery) => {
  const getUsersQuery = `SELECT * FROM users WHERE userName LIKE ? OR userNumber LIKE ? OR userEmail LIKE ?`;
  let searchQueryString = `%${searchQuery}%`;
  try {
    let [users] = await db.query(getUsersQuery, [searchQueryString, searchQueryString, searchQueryString]);
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].userImgSrc)
          users[i].userImgSrc = users[i].userImgSrc.toString("base64");
      }
      console.log("users DATA YAHAN HA", users);
      return users;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const getUser = async (credentials) => {
  const getUserQuery = `SELECT * FROM users where userEmail = ? AND userPassword = ?`;

  try {
    let [user] = await db.query(getUserQuery, [
      credentials.userEmail,
      credentials.userPassword,
    ]);
    if (user[0].userImgSrc) {
      user[0].userImgSrc = `data:image/png;base64,${Buffer.from(
        user[0].userImgSrc
      ).toString("base64")}`;
    }
    console.log("USER TO BE LOGGED IN DATA", user[0]);
    return user[0];
  } catch (error) {
    console.log("error", error);
  }
};

const loginUser = async (userSession) => {
  const loginUser = `INSERT INTO sessions (userId, token) values (?, ?);`;

  try {
    let [session] = await db.query(loginUser, [
      userSession.userId,
      userSession.token,
    ]);

    console.log("SESSION CREATED", session);
    return session;
  } catch (error) {
    console.log("error creating session", error);
  }
};

const logoutUser = async (token) => {
  const deleteSessionQuery = "DELETE FROM sessions WHERE token = ?";

  try {
    const [result] = await db.query(deleteSessionQuery, [token]);

    if (result.affectedRows > 0) {
      console.log("Session removed successfully.");
      return true; // Session removed
    } else {
      console.log("Session not found for the provided token.");
      return false; // Session not found
    }
  } catch (error) {
    console.log("error deleting session", error);
  }
};

const userTokenExists = async (token, userId) => {
  const selectTokenQuery =
    "SELECT token FROM sessions WHERE token = ? AND userId = ?";

  try {
    const [rows] = await db.query(selectTokenQuery, [token, userId]);

    return rows.length > 0; // if true then token exists; if false then it doesn't
  } catch (error) {
    console.log("FAILED TO FIND TOKEN", error);
  }
};

const getUsersColumn = async (column) => {
  const getUsersQuery = `SELECT ?? FROM users`;

  try {
    let [usersCol] = await db.query(getUsersQuery, [column]);
    console.log("USERS DATA", usersCol);
    return usersCol;
  } catch (error) {
    console.log("error", error);
  }
};

const addUser = async (userData) => {
  let allUsers = await getUsers();

  if (
    allUsers.length > 0 &&
    allUsers.some((u) => u.userEmail === userData.userEmail)
  ) {
    console.log("NO ITS A DUPLICATE EMAIL YOU CANT DIE");
  } else {
    const addUserQuery = `INSERT INTO users (userId, userRole, userName, userEmail, userNumber, userPassword) values (?, ?, ?, ?, ?, ?);`;
    // const userId = await generateUserId();
    // console.log("USERID", userId);
    const values = [
      // userId,
      userData.userId,
      userData.userRole,
      userData.userName,
      userData.userEmail,
      userData.userNumber,
      userData.userPassword,
    ];
    try {
      let [addedUser] = await db.query(addUserQuery, values);
      console.log("user DATA", addedUser);
      return addedUser;
    } catch (error) {
      console.log("error", error);
    }
  }
};

const updateUser = async (userId, userData) => {
  let binaryImgSrc;
  if (userData.userImgSrc) {
    console.log("IMG SRC",userData.userImgSrc)
    binaryImgSrc = Buffer.from(
      userData.userImgSrc.split(",")[1] || userData.userImgSrc,
      "base64"
    );
  }

  let allUsers = await getUsers();

  if (
    allUsers.length > 0 &&
    allUsers.some((u) => {
      if (u.userId !== userId) return u.userEmail === userData.userEmail;
      else return false;
    })
  ) {
    console.log("NO ITS A DUPLICATE EMAIL YOU CANT ADD");
  } else {
    const updateUserQuery = `
    UPDATE users
    SET userRole = ?, userName = ?, userEmail = ?, userNumber = ?, userPassword = ?, userImgSrc = ?, userAbout = ?, userProfession = ?
    WHERE userId = ?
  `;
    const values = [
      userData.userRole,
      userData.userName,
      userData.userEmail,
      userData.userNumber,
      userData.userPassword,
      // userData.userImgSrc,
      binaryImgSrc,
      userData.userAbout,
      userData.userProfession,
      userId,
    ];

    try {
      const [result] = await db.query(updateUserQuery, values);

      if (result.affectedRows === 1) {
        console.log("User data updated successfully");
        return true;
      } else {
        console.log("User data not updated");
        return false;
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  }
};

const deleteUser = async (userId) => {
  const deleteUserQuery = `DELETE FROM users WHERE userId = ?`;
  try {
    let [result] = await db.query(deleteUserQuery, [userId]);

    if (result.affectedRows === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

export default {
  getUsers,
  filterAllUsers,
  getUsersColumn,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  userTokenExists,
};
