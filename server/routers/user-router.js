"use strict";
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const mysql = require("mysql2/promise");

const models = require("../models");
const sequelize = models.sequelize;

mysql
  .createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  })
  .then(async connection => {
    await connection.query("CREATE DATABASE IF NOT EXISTS bug_tracker_db");
  })
  .catch(err => {
    console.warn(err.stack);
  });

router.get("/sync", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: "tables created" });
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

// USERS
router.post("/users/login", async (req, res) => {
  // autentificare cu jwt
  const { email, password } = req.body;
  try {
    let user = await models.User.findOne({ where: { email: email } });
    if (!user) {
      res.status(400).json({ errors: [{ message: "Invalid credentials" }] });
    } else {
      // const isMatch = await bcrypt.compare(password, user.password);
      if (password !== user.password) {
        res.status(400).json({ errors: [{ message: "Invalid credentials" }] });
      } else {
        //generare token (jsonwebtoken)
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          "mysecrettoken",
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
          }
        );
      }
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/allusers", async (req, res) => {
  //toti userii aplicatiei
  try {
    let users;
    users = await models.User.findAll();
    res.status(200).json(users);
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/users", auth, async (req, res) => {
  //ruta care returneaza userul conectat si proiectele din care face parte
  try {
    let user = await models.User.findByPk(req.user.id, {
      include: [models.Project]
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/users/register", async (req, res) => {
  //inregistrare
  try {
    const { firstName, lastName, email, password } = req.body;
    let user = await models.User.findOne({ where: { email: email } });
    if (user) {
      res.status(400).json({ message: "User existent" });
    } else {
      user = { firstName, lastName, email, password };

      //criptare parola
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(password, salt);

      //salvare in baza de date
      await models.User.create(user);

      //generare token (jsonwebtoken)
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "mysecrettoken",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    }
  } catch (e) {
    console.warn(e);
    res.status(500).json({ message: "server error" });
  }
});

// router.put("/users", auth, async (req, res) => {
//   //doar user-ul logat poate modifica date despre el //NEIMPLEMENTAT PE FRONT
//   try {
//     let user = await models.User.findByPk(req.user.id);
//     if (user) {
//       await user.update(req.body);
//       res.status(202).json({ message: "updated" });
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (e) {
//     console.warn(e);
//     res.status(500).json({ message: "server error" });
//   }
// });

// router.delete("/users", auth, async (req, res) => {
//   //NEIMPLEMENTAT PE FRONT
//   //doar user-ul logat se poate sterge pe sine
//   try {
//     let user = await models.User.findByPk(req.user.id);
//     if (user) {
//       await user.destroy();
//       res.status(202).json({ message: "deleted" });
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (e) {
//     console.warn(e);
//     res.status(500).json({ message: "server error" });
//   }
// });

// PROJECTS
router.get("/allprojects", async (req, res) => {
  try {
    let projects = await models.Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

// router.get("/users/projects", auth, async (req, res) => {
//   //returneaza toate proiectele din care face parte user-ul logat
//   try {
//     let user = await models.User.findByPk(req.user.id);
//     if (user) {
//       let projects = await user.getProjects();
//       res.status(200).json(projects);
//     } else {
//       res.status(404).json({ message: "not found" });
//     }
//   } catch (err) {
//     console.warn(err);
//     res.status(500).json({ message: "server error" });
//   }
// });

router.post("/users/projects", auth, async (req, res) => {
  //adaugare de proiect doar de catre un user logat
  try {
    let user = await models.User.findByPk(req.user.id);
    let project = await models.Project.create(req.body);
    if (user) {
      user.addProject(project, { through: { accessType: "MP" } });
      res.status(201).json({ message: "project added" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

//get project members
router.get("/projects/:pid/members", async (req, res) => {
  try {
    let project = await models.Project.findByPk(req.params.pid);
    if (req.query.access) {
      var access = req.query.access;
    } else {
      res.status(500).json({ message: "accessType required" });
    }

    if (project) {
      let members = await project.getUsers();
      if (members) {
        members = members.filter(
          member => member.project_access.accessType == access.toUpperCase()
        );
        res.status(200).json(members);
      } else {
        res.status(404).json({ message: "error getting members" });
      }
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

//adding tester
router.get("/users/projects/:pid/add-tester", auth, async (req, res) => {
  //adaugare ca tester
  try {
    let tester = await models.User.findByPk(req.user.id);
    if (tester) {
      let project = await models.Project.findByPk(req.params.pid);
      if (project) {
        tester.addProject(project, { through: { accessType: "TST" } });
        res.status(201).json({ message: "tester added" });
      } else {
        res.status(404).json({ message: "project not found" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});
//removing tester
router.get("/users/projects/:pid/remove-tester", auth, async (req, res) => {
  //remove ca tester
  try {
    let tester = await models.User.findByPk(req.user.id);
    if (tester) {
      let project = await models.Project.findByPk(req.params.pid);
      if (project) {
        project.removeUser(tester, { through: { accessType: "TST" } });
        res.status(201).json({ message: "tester removed" });
      } else {
        res.status(404).json({ message: "project not found" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/users/projects/:pid", auth, async (req, res) => {
  //date despre un proiect
  try {
    let project = await models.Project.findOne({
      where: { id: req.params.pid }
    });
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

// router.put("/users/projects/:pid", auth, async (req, res) => {
//   //NEIMPLEMENTAT PE FRONT
//   //modificare proiect de catre membru
//   try {
//     let user = await models.User.findByPk(req.user.id);
//     if (user) {
//       let projects = await user.getProjects({ where: { id: req.params.pid } });
//       let project = projects.shift();
//       if (project) {
//         let role = project.project_access.dataValues.accessType;
//         if (role === "MP") {
//           await project.update(req.body);
//           res.status(202).json({ message: "project updated" });
//         } else {
//           res
//             .status(202)
//             .json({ message: "you can't update project as a tester" });
//         }
//       } else {
//         res.status(404).json({ message: "project not found" });
//       }
//     } else {
//       res.status(404).json({ message: "user not found" });
//     }
//   } catch (err) {
//     console.warn(err);
//     res.status(err);
//   }
// });

router.delete("/users/projects/:pid", auth, async (req, res) => {
  //stergere proiect doar de catre membru
  try {
    let user = await models.User.findByPk(req.user.id);
    if (user) {
      let projects = await user.getProjects({ where: { id: req.params.pid } });
      let project = projects.shift();
      if (project) {
        let role = project.project_access.dataValues.accessType;
        if (role === "MP") {
          await project.destroy();
          res.status(202).json({ message: "project deleted" });
        } else {
          res
            .status(202)
            .json({ message: "you can't delete project as a tester" });
        }
      } else {
        res.status(404).json({ message: "project not found" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

//BUGS
//get
router.get("/projects/:pid/bugs", async (req, res) => {
  try {
    let project = await models.Project.findByPk(req.params.pid, {
      include: [models.Bug]
    });
    if (project) {
      // let bugs = await project.getBugs()
      res.status(200).json(project.bugs);
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "server error" });
  }
});

//post
router.post("/projects/:pid/bugs", async (req, res) => {
  try {
    let project = await models.Project.findByPk(req.params.pid);
    if (project) {
      let bug = req.body;
      bug.projectId = project.id;
      await models.Bug.create(bug);
      res.status(201).json({ message: "bug added" });
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

//get by id
// router.get("/projects/:pid/bugs/:bid", async (req, res) => { //NEIMPLEMENTAT PE FRONT
//   try {
//     let project = await models.Project.findByPk(req.params.pid);
//     if (project) {
//       let bugs = await project.getBugs({
//         where: {
//           id: req.params.bid
//         }
//       });
//       let bug = bugs.shift();
//       if (bug) {
//         res.status(200).json(bug);
//       } else {
//         res.status(404).json({ message: "bug not found" });
//       }
//     } else {
//       res.status(404).json("project not found");
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "server error" });
//   }
// });

//put
router.put("/projects/:pid/bugs/:bid", async (req, res) => {
  try {
    let project = await models.Project.findByPk(req.params.pid);
    if (project) {
      let bugs = await project.getBugs({
        where: {
          id: req.params.bid
        }
      });
      let bug = bugs.shift();
      if (bug) {
        await bug.update(req.body);
        res.status(202).json({ message: "bug updated" });
      } else {
        res.status(404).json({ message: "bug not found" });
      }
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

//delete
router.delete("/projects/:pid/bugs/:bid", async (req, res) => {
  try {
    let project = await models.Project.findByPk(req.params.pid);
    if (project) {
      let bugs = await project.getBugs({
        where: {
          id: req.params.bid
        }
      });
      let bug = bugs.shift();
      if (bug) {
        await bug.destroy();
        res.status(202).json({ message: "bug deleted" });
      } else {
        res.status(404).json({ message: "bug not found" });
      }
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

//TODO
// adding multiple MP to a single project
//testing everything

module.exports = router;
