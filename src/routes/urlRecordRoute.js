import { Router } from "express"
import {
  createUrlRecord,
  getAllUrlRecord,
} from "../controllers/urlRecordController.js"

const urlRecordRouter = new Router()

urlRecordRouter.route("/urlRecord").post(createUrlRecord).get(getAllUrlRecord)

export default urlRecordRouter
