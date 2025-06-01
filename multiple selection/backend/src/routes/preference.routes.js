import { Router } from "express";
import choseTopics from "../controllers/preference/choseTopics.controllers.js";
import getPreferences from "../controllers/preference/getPreferences.controllers.js";

const router = Router();

router.route("/preference").post(choseTopics).get(getPreferences);

export default router;
