import db from "../config.js";
import usersServices from "./users.js";

const getEducations = async (userId) => {
  const getEducationsQuery = `SELECT * FROM educations WHERE userId = ?`;

  try {
    let [educations] = await db.query(getEducationsQuery, [userId]);
    if (educations.length > 0) {
      console.log("educations DATA", educations);
      return educations;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const getEducation = async (userEducationId) => {
  const getEducationQuery = `SELECT * FROM educations WHERE userEducationId = ?`;

  try {
    let [education] = await db.query(getEducationQuery, [userEducationId]);
    if (education.length > 0) {
      console.log("education DATA", education[0]);
      return education[0];
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const addEducation = async (userEducation) => {
  let usersData;
  try {
    usersData = await usersServices.getUsersColumn("userId");
  } catch (error) {
    console.log("COULDN'T GET USERS DATA");
  }

  if (
    usersData.length > 0 &&
    usersData.find((u) => u.userId === userEducation.userId)
  ) {
    const addEducationQuery = `INSERT INTO educations (userEducationId, userId, userEducationDegree, userEducationInstitute, userEducationYears, userEducationProgram) values (?, ?, ?, ?, ?, ?);`;

    const values = [
      userEducation.userEducationId,
      userEducation.userId,
      userEducation.userEducationDegree,
      userEducation.userEducationInstitute,
      userEducation.userEducationYears,
      userEducation.userEducationProgram,
    ];

    try {
      let [addedEducation] = await db.query(addEducationQuery, values);
      console.log("education DATA", addedEducation);
      return addedEducation;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  } else {
    console.log(
      "CANNOT ADD EDUCATION SINCE USER DOESN'T EXIST FOR WHICH YOU ARE ADDING EDUCATION."
    );
    return false;
  }
};

const deleteEducationByEducationId = async (userEducationId, userId) => {
  // const findEducationQuery = `SELECT * FROM educations WHERE userEducationId = ?`;
  let foundEducation;
  try {
    foundEducation = await getEducation(userEducationId);
    console.log("FOUND EDUCATION", foundEducation);
  } catch (error) {
    console.log("COULDN'T FIND EDUCATION", error);
    return false;
  }

  if (foundEducation && foundEducation.userId === userId) {
    const deleteEducationQuery = `DELETE FROM educations WHERE userEducationId = ?`;
    try {
      let [result] = await db.query(deleteEducationQuery, [userEducationId]);

      if (result.affectedRows === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log("error", error);
      return false;
    }
  } else {
    return false;
  }
};

const deleteEducationByUserId = async (userId) => {
  const deleteEducationQuery = `DELETE FROM educations WHERE userId = ?`;
  try {
    let [result] = await db.query(deleteEducationQuery, [userId]);

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

const updateEducation = async (userEducationId, userId, userEducation) => {
  let foundEducation;
  try {
    foundEducation = await getEducation(userEducationId);
    console.log("FOUND EDUCATION", foundEducation);
  } catch (error) {
    console.log("COULDN'T FIND EDUCATION", error);
    return false;
  }

  if (foundEducation && foundEducation.userId === userId) {
  const updateUserQuery = `
      UPDATE educations
      SET userEducationDegree = ?, userEducationInstitute = ?, userEducationProgram = ?, userEducationYears = ?
      WHERE userEducationId = ?
    `;
  const values = [
    userEducation.userEducationDegree,
    userEducation.userEducationInstitute,
    userEducation.userEducationProgram,
    userEducation.userEducationYears,
    userEducationId,
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
} else {
  return false;
}
};

export default {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducationByEducationId,
  deleteEducationByUserId,
};
