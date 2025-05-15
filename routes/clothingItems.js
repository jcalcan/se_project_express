const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateIds,
  validateQuery,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", validateQuery, getItems);
router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validateIds, deleteItem);
router.put("/:itemId/likes", auth, validateIds, likeItem);
router.delete("/:itemId/likes", auth, validateIds, unlikeItem);

module.exports = router;
