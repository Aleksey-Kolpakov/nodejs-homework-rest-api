const express = require("express");
const {
  getlistContacts,
  getContact,
  createContact,
  changeContact,
  deleteContact,
  updateStatusContact,
} = require("../../controlers/contactControler");
const {
  validateContact,
  checkContactId,
} = require("../../middlewares/contactMiddlewares");
const { protect } = require("../../middlewares/authMiddlewares");

const router = express.Router();
router.use(protect);

router.get("/", getlistContacts);

router.get("/:contactId", checkContactId, getContact);

router.post("/", validateContact, createContact);

router.delete("/:contactId", checkContactId, deleteContact);

router.put("/:contactId", checkContactId, changeContact);
router.patch("/:contactId/favorite", checkContactId, updateStatusContact);

module.exports = router;
