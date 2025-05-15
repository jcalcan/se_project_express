const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserInfo,
  validateAuthentication,
} = require("../middlewares/validation");

router.get("/me", auth, validateAuthentication, getCurrentUser);
router.patch("/me", auth, validateUserInfo, updateUser);

module.exports = router;
