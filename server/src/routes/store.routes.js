const express = require("express");
const router = express.Router();
const storeCtrl = require("../controller/store.controller");
const auth = require("../middleware/auth");

router.get("/", storeCtrl.listStores);
router.get("/:id", storeCtrl.getStore);
router.post("/:id/contact", storeCtrl.contactStore);
// create store (owner) - requires authentication
router.post("/", auth, storeCtrl.createStore);
router.patch("/:id", auth, storeCtrl.updateStore);
router.get("/:id/leads", auth, storeCtrl.listLeadsForStore);

module.exports = router;
