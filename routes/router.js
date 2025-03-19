const express = require("express");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");
const userController = require("../controllers/userController");
const documentController = require("../controllers/documentController");
const router = express.Router();

// ===================
//  user routes
// ===================

// Add user
router.post("/register", userController.registerController);

// user login
router.post("/login", userController.loginController);

// edit user
router.put(
  "/edit-profile",
  jwtMiddleware,
  multerMiddleware.single("profilePic"),
  userController.editUserinfoController
);

//change-password
router.put(
  "/change-password",
  jwtMiddleware,
  userController.changePasswordController
);

//getAllUsers
router.get("/allusers", userController.getAllUsers);

// ===================
//  doc routes
// ===================

//Create doc
router.post("/documents", documentController.createDocument);

//get Doc Title
router.get("/documents/title/:id", documentController.getDocumentTitle);

//update Doc Title
router.put(
  "/documents/title-update/:id",
  documentController.updateDocumentTitle
);

// Get all documents where the user is the creator or a collaborator
router.get("/documents/user/:userId", documentController.getUserDocuments);

// add shared users
router.put("/documents/add-collaborator", documentController.addCollaborator);

// remove users
router.put("/documents/:id/remove-user", documentController.removeSharedUser);

// get doc SharedUsers
router.get("/documents/sharedusers/:id", documentController.getdocSharedUsers);

// save doc
router.post("/documents/:docId", documentController.saveDocument);

// load doc
router.get("/documents/:docId", documentController.loadDocument);

// remove doc
router.delete("/projects/:id/remove", documentController.removeDocController);

module.exports = router;
