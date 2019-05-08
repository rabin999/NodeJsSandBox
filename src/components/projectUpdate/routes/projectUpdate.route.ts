import { Router } from "express"
import * as projectController from "../controllers"

const route = Router()

route.get("/", projectController.projects)

export default route