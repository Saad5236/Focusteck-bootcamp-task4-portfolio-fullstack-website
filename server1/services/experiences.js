import db from "../config.js";
import usersServices from "./users.js";

const getExperiences = async (userId) => {
  const getExperiencesQuery = `SELECT * FROM experiences WHERE userId = ?`;

  try {
    let [experiences] = await db.query(getExperiencesQuery, [userId]);
    if (experiences.length > 0) {
      console.log("experiences DATA", experiences);
      return experiences;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const getExperience = async (userExperienceId) => {
  const getExperienceQuery = `SELECT * FROM experiences WHERE userExperienceId = ?`;

  try {
    let [experience] = await db.query(getExperienceQuery, [userExperienceId]);
    if (experience.length > 0) {
      console.log("experience DATA", experience[0]);
      return experience[0];
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const addExperience = async (userExperience) => {
  let usersData;
  try {
    usersData = await usersServices.getUsersColumn("userId");
  } catch (error) {
    console.log("COULDN'T GET USERS DATA");
  }

  if (
    usersData.length > 0 &&
    usersData.find((u) => u.userId === userExperience.userId)
  ) {
    const addExperienceQuery = `INSERT INTO experiences (userExperienceId, userId, userExperienceTitle, userExperienceCompany, userExperienceSkills, userExperienceYears) values (?, ?, ?, ?, ?, ?);`;

    const values = [
      userExperience.userExperienceId,
      userExperience.userId,
      userExperience.userExperienceTitle,
      userExperience.userExperienceCompany,
      userExperience.userExperienceSkills,
      userExperience.userExperienceYears,
    ];

    try {
      let [addedExperience] = await db.query(addExperienceQuery, values);
      console.log("experience DATA", addedExperience);
      return addedExperience;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  } else {
    console.log(
      "CANNOT ADD Experience SINCE USER DOESN'T EXIST FOR WHICH YOU ARE ADDING Experience."
    );
    return false;
  }
};

const deleteExperienceByExperienceId = async (userExperienceId, userId) => {
  // const findExperienceQuery = `SELECT * FROM experiences WHERE userExperienceId = ?`;
  let foundExperience;
  try {
    foundExperience = await getExperience(userExperienceId);
    console.log("FOUND Experience", foundExperience);
  } catch (error) {
    console.log("COULDN'T FIND Experience", error);
    return false;
  }

  if (foundExperience && foundExperience.userId === userId) {
    const deleteExperienceQuery = `DELETE FROM experiences WHERE userExperienceId = ?`;
    try {
      let [result] = await db.query(deleteExperienceQuery, [userExperienceId]);

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

const deleteExperiencesByUserId = async (userId) => {
  const deleteExperienceQuery = `DELETE FROM experiences WHERE userId = ?`;
  try {
    let [result] = await db.query(deleteExperienceQuery, [userId]);

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

const updateExperience = async (userExperienceId, userId, userExperience) => {
  let foundExperience;
  try {
    foundExperience = await getExperience(userExperienceId);
    console.log("FOUND Experience", foundExperience);
  } catch (error) {
    console.log("COULDN'T FIND Experience", error);
    return false;
  }

  if (foundExperience && foundExperience.userId === userId) {
    const updateUserQuery = `
      UPDATE experiences
      SET userExperienceTitle = ?, userExperienceCompany = ?, userExperienceSkills = ?, userExperienceYears = ?
      WHERE userExperienceId = ?
    `;
    const values = [
      userExperience.userExperienceTitle,
      userExperience.userExperienceCompany,
      userExperience.userExperienceSkills,
      userExperience.userExperienceYears,
      userExperienceId,
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
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperienceByExperienceId,
  deleteExperiencesByUserId,
};
