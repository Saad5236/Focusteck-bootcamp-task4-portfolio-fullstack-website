import db from "../config.js";
import usersServices from "./users.js";

const getSkills = async (userId) => {
  const getSkillsQuery = `SELECT * FROM skills WHERE userId = ?`;

  try {
    let [skills] = await db.query(getSkillsQuery, [userId]);
    if (skills.length > 0) {
      console.log("skills DATA", skills);
      return skills;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const getSkill = async (userSkillId) => {
    const getSkillQuery = `SELECT * FROM skills WHERE userSkillId = ?`;
  
    try {
      let [skill] = await db.query(getSkillQuery, [userSkillId]);
      if (skill.length > 0) {
        console.log("skill DATA", skill[0]);
        return skill[0];
      }
      return [];
    } catch (error) {
      console.log("error", error);
    }
  };

const addSkill = async (userSkill) => {
    let usersData;
    try {
      usersData = await usersServices.getUsersColumn("userId");
    } catch (error) {
      console.log("COULDN'T GET USERS DATA");
    }
  
    if (
      usersData.length > 0 &&
      usersData.find((u) => u.userId === userSkill.userId)
    ) {
      const addSkillQuery = `INSERT INTO skills (userSkillId, userId, userSkill) values (?, ?, ?);`;
  
      const values = [
        userSkill.userSkillId,
        userSkill.userId,
        userSkill.userSkill
      ];
  
      try {
        let [addedSkill] = await db.query(addSkillQuery, values);
        console.log("skill DATA", addedSkill);
        return addedSkill;
      } catch (error) {
        console.log("error", error);
        return false;
      }
    } else {
      console.log(
        "CANNOT ADD Skill SINCE USER DOESN'T EXIST FOR WHICH YOU ARE ADDING Skill."
      );
      return false;
    }
  };

  const deleteSkillBySkillId = async (userSkillId, userId) => {
    // const findExperienceQuery = `SELECT * FROM experiences WHERE userExperienceId = ?`;
    let foundSkill;
    try {
      foundSkill = await getSkill(userSkillId);
      console.log("FOUND Skill", foundSkill);
    } catch (error) {
      console.log("COULDN'T FIND Skill", error);
      return false;
    }
  
    if (foundSkill && foundSkill.userId === userId) {
      const deleteSkillQuery = `DELETE FROM skills WHERE userSkillId = ?`;
      try {
        let [result] = await db.query(deleteSkillQuery, [userSkillId]);
  
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

  const deleteSkillsByUserId = async (userId) => {
    const deleteSkillsQuery = `DELETE FROM skills WHERE userId = ?`;
    try {
      let [result] = await db.query(deleteSkillsQuery, [userId]);
  
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
    getSkills,
    addSkill,
    deleteSkillBySkillId,
    deleteSkillsByUserId,
  };