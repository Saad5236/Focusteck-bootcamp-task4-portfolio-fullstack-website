import db from "../config.js";

const createDbTables = async () => {
  const userTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        userId INT PRIMARY KEY,
        userRole VARCHAR(255) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userEmail VARCHAR(255) NOT NULL,
        userNumber VARCHAR(15) NOT NULL,
        userPassword VARCHAR(255) NOT NULL,
        userProfession VARCHAR(255),
        userAbout TEXT,
        userImgSrc LONGTEXT
      )
    `;
  const sessionTableQuery = `
    CREATE TABLE IF NOT EXISTS sessions (
        userId INT NOT NULL,
        token varchar(255) PRIMARY KEY,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `;

  const educationsTableQuery = `
    CREATE TABLE IF NOT EXISTS educations (
      userEducationId INT PRIMARY KEY,
      userId INT NOT NULL,
      userEducationDegree VARCHAR(255) NOT NULL,
      userEducationInstitute VARCHAR(255) NOT NULL,
      userEducationProgram VARCHAR(255) NOT NULL,
      userEducationYears VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `;

    const experiencesTableQuery = `
    CREATE TABLE IF NOT EXISTS experiences (
      userExperienceId INT PRIMARY KEY,
      userId INT NOT NULL,
      userExperienceCompany VARCHAR(255) NOT NULL,
      userExperienceSkills VARCHAR(255) NOT NULL,
      userExperienceTitle VARCHAR(255) NOT NULL,
      userExperienceYears VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `;
    
    const skillsTableQuery = `
    CREATE TABLE IF NOT EXISTS skills (
      userSkillId INT PRIMARY KEY,
      userId INT NOT NULL,
      userSkill VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `;

    const projectsTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      projectId INT PRIMARY KEY,
      userId INT NOT NULL,
      projectHeading VARCHAR(255) NOT NULL,
      projectDescription TEXT NOT NULL,
      projectImageLink LONGTEXT,
      projectTags VARCHAR(255) NOT NULL,
      projectLanguages VARCHAR(255) NOT NULL,
      projectFrameworks VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `;

    const uponUpdateUserRole = `
    CREATE TRIGGER after_user_role_update
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
      IF NEW.userRole = 'admin' AND OLD.userRole = 'user' THEN
        DELETE FROM projects WHERE userId = NEW.userId;
        DELETE FROM educations WHERE userId = NEW.userId;
        DELETE FROM experiences WHERE userId = NEW.userId;
        DELETE FROM skills WHERE userId = NEW.userId;
      END IF;
    END;
  `;

  //   db.query(userTableQuery, (error, result, fields) => {
  //     if (error) console.log("ERROR CREATING USER TABLE: ", error);
  //     else {
  //       console.log("USER TABLE SUCCESSFULLY CREATED!", result);
  //     }
  //   });

  try {
    await db.query(userTableQuery);
  } catch (error) {
    console.log("ERROR CREATING USER TABLE", error);
  }

  try {
    await db.query(sessionTableQuery);
  } catch (error) {
    console.log("ERROR CREATING SESSIONS TABLE", error);
  }

  try {
    await db.query(educationsTableQuery);
  } catch (error) {
    console.log("ERROR CREATING EDUCATIONS TABLE", error);
  }

  try {
    await db.query(experiencesTableQuery);
  } catch (error) {
    console.log("ERROR CREATING EXPERIENCES TABLE", error);
  }

  try {
    await db.query(skillsTableQuery);
  } catch (error) {
    console.log("ERROR CREATING SKILLS TABLE", error);
  }

  try {
    await db.query(projectsTableQuery);
  } catch (error) {
    console.log("ERROR CREATING PROJECTS TABLE", error);
  }

  // try {
  //   await db.query(uponUpdateUserRole);
  // } catch (error) {
  //   console.log("ERROR CREATING PROJECTS TABLE", error);
  // }
};

export default createDbTables;
