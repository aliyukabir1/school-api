const express = require("express")
const router = express.Router()
const prefectsController = require("../controllers/prefects")


router.get("/",prefectsController.get_prefects)

module.exports = router
