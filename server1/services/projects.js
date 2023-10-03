import db from "../config.js";
import usersServices from "./users.js";

const getProjects = async (userId) => {
  const getProjectsQuery = `SELECT * FROM projects WHERE userId = ?`;

  try {
    let [projects] = await db.query(getProjectsQuery, [userId]);
    if (projects.length > 0) {
      // let b = a.map((i) => ({...i, projectTags: i.projectTags.split(","), projectLanguages: i.projectLanguages.split(","), projectFrameworks: i.projectFrameworks.split(",")}))
      projects = projects.map((project) => ({
        ...project,
        projectTags: project.projectTags.split(","),
        projectLanguages: project.projectLanguages.split(","),
        projectFrameworks: project.projectFrameworks.split(","),
        // projectImageLink: `data:image/png;base64,${Buffer.from(
        //   project.projectImageLink
        // ).toString("base64")}`,
      }));
      // if (user[0].userImgSrc) {
      //   user[0].userImgSrc = `data:image/png;base64,${Buffer.from(
      //     user[0].userImgSrc
      //   ).toString("base64")}`;
      // }
      console.log("projects DATA", projects);
      return projects;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const filterAllProjects = async (searchQuery) => {
  const getProjectsQuery = `SELECT * FROM projects WHERE projectTags LIKE ? OR projectLanguages LIKE ? OR projectFrameworks LIKE ?`;
  let searchQueryString = `%${searchQuery}%`;
  try {
    let [projects] = await db.query(getProjectsQuery, [searchQueryString, searchQueryString, searchQueryString]);
    if (projects.length > 0) {
      // let b = a.map((i) => ({...i, projectTags: i.projectTags.split(","), projectLanguages: i.projectLanguages.split(","), projectFrameworks: i.projectFrameworks.split(",")}))
      projects = projects.map((project) => ({
        ...project,
        projectTags: project.projectTags.split(","),
        projectLanguages: project.projectLanguages.split(","),
        projectFrameworks: project.projectFrameworks.split(","),
        // projectImageLink: `data:image/png;base64,${Buffer.from(
        //   project.projectImageLink
        // ).toString("base64")}`,
      }));
      // if (user[0].userImgSrc) {
      //   user[0].userImgSrc = `data:image/png;base64,${Buffer.from(
      //     user[0].userImgSrc
      //   ).toString("base64")}`;
      // }
      console.log("projects DATA YAHAN HA", projects);
      return projects;
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const getProject = async (projectId) => {
  const getProjectQuery = `SELECT * FROM projects WHERE projectId = ?`;

  try {
    let [project] = await db.query(getProjectQuery, [projectId]);
    if (project.length > 0) {
      project[0].projectTags = project[0].projectTags.split(",");
      project[0].projectLanguages = project[0].projectLanguages.split(",");
      project[0].projectFrameworks = project[0].projectFrameworks.split(",");
      console.log("project DATA", project[0]);
      return project[0];
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

const addProject = async (userProject) => {
  let usersData;
  try {
    usersData = await usersServices.getUsersColumn("userId");
  } catch (error) {
    console.log("COULDN'T GET USERS DATA");
  }

  // let binaryImgSrc;
  // if (userProject.projectImageLink) {
  //   binaryImgSrc = Buffer.from(
  //     userProject.projectImageLink.split(",")[1] ||
  //       userProject.projectImageLink,
  //     "base64"
  //   );
  // }

  if (
    usersData.length > 0 &&
    usersData.find((u) => u.userId === userProject.userId)
  ) {
    const addProjectQuery = `INSERT INTO projects (projectId, userId, projectHeading, projectDescription, projectImageLink, projectTags, projectLanguages, projectFrameworks) values (?, ?, ?, ?, ?, ?, ?, ?);`;

    const values = [
      userProject.projectId,
      userProject.userId,
      userProject.projectHeading,
      userProject.projectDescription,
      userProject.projectImageLink,
      // binaryImgSrc,
      userProject.projectTags.join(","),
      userProject.projectLanguages.join(","),
      userProject.projectFrameworks.join(","),
    ];

    try {
      let [addedProject] = await db.query(addProjectQuery, values);
      console.log("project DATA", addedProject);
      return addedProject;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  } else {
    console.log(
      "CANNOT ADD Project SINCE USER DOESN'T EXIST FOR WHICH YOU ARE ADDING Project."
    );
    return false;
  }
};

const updateProject = async (projectId, userId, userProject) => {
  let foundProject;
  try {
    foundProject = await getProject(projectId);
    console.log("FOUND Project", foundProject);
  } catch (error) {
    console.log("COULDN'T FIND Project", error);
    return false;
  }

  // let binaryImgSrc;
  // if (userProject.projectImageLink) {
  //   binaryImgSrc = Buffer.from(
  //     userProject.projectImageLink.split(",")[1] ||
  //       userProject.projectImageLink,
  //     "base64"
  //   );
  // }

  if (foundProject && foundProject.userId === userId) {
    const updateUserQuery = `
        UPDATE projects
        SET projectHeading = ?, projectDescription = ?, projectImageLink = ?, projectTags = ?, projectLanguages = ?, projectFrameworks = ?
        WHERE projectId = ?
      `;
    const values = [
      userProject.projectHeading,
      userProject.projectDescription,
      userProject.projectImageLink,
      // binaryImgSrc,
      userProject.projectTags.join(","),
      userProject.projectLanguages.join(","),
      userProject.projectFrameworks.join(","),
      projectId,
    ];

    try {
      const [result] = await db.query(updateUserQuery, values);

      if (result.affectedRows === 1) {
        console.log("project data updated successfully");
        return true;
      } else {
        console.log("project data not updated");
        return false;
      }
    } catch (error) {
      console.error("Error updating project data:", error);
      return false;
    }
  } else {
    return false;
  }
};

const deleteProjectByProjectId = async (projectId, userId) => {
  // const findExperienceQuery = `SELECT * FROM experiences WHERE projectId = ?`;
  let foundProject;
  try {
    foundProject = await getProject(projectId);
    console.log("FOUND Project", foundProject);
  } catch (error) {
    console.log("COULDN'T FIND Project", error);
    return false;
  }

  if (foundProject && foundProject.userId === userId) {
    const deleteProjectQuery = `DELETE FROM projects WHERE projectId = ?`;
    try {
      let [result] = await db.query(deleteProjectQuery, [projectId]);

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

const deleteProjectsByUserId = async (userId) => {
  const deleteProjectQuery = `DELETE FROM projects WHERE userId = ?`;
  try {
    let [result] = await db.query(deleteProjectQuery, [userId]);

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
  getProjects,
  filterAllProjects,
  getProject,
  addProject,
  deleteProjectByProjectId,
  deleteProjectsByUserId,
  updateProject,
};
