import { Router } from "express";
import {
  createUrlRecord,
  getAllUrlRecord,
  deleteUrlRecord,
  updateUrlRecord,
} from "../controllers/urlRecordController.js";

const urlRecordRouter = Router();

urlRecordRouter.route("/urlRecord").post(createUrlRecord).get(getAllUrlRecord);
urlRecordRouter
  .route("/urlRecord/:id")
  .delete(deleteUrlRecord)
  .put(updateUrlRecord);

export default urlRecordRouter;
