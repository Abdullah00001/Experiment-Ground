import { Router } from "express";
import createTopic from "../controllers/topics/createTopic.controllers.js";
import getTopic from "../controllers/topics/getTopic.controllers.js";

const router = Router();

router.route("/topics").post(createTopic).get(getTopic);

export default router;
