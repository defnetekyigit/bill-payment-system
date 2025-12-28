/**
 * @swagger
 * tags:
 *   name: Bill
 *   description: Endpoints for Mobile Provider, Banking App, and Admin operations
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Bill:
 *       type: object
 *       properties:
 *         subscriber_no:
 *           type: string
 *           example: "123456"
 *         month:
 *           type: string
 *           example: "2024-10"
 *         bill_total:
 *           type: number
 *           example: 150
 *         paid_amount:
 *           type: number
 *           example: 50
 *         remaining_amount:
 *           type: number
 *           example: 100
 *         status:
 *           type: string
 *           example: "unpaid"
 *
 * /bill:
 *   get:
 *     summary: Query Bill (Mobile Provider App)
 *     tags: [Bill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subscriber_no
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bill information
 *
 * /bill/detailed:
 *   get:
 *     summary: Query Bill Detailed (paging)
 *     tags: [Bill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subscriber_no
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Detailed bill info
 *
 * /bank/bill:
 *   get:
 *     summary: Query Unpaid Bills (Banking App)
 *     tags: [Bill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subscriber_no
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unpaid bills list
 *
 * /pay:
 *   post:
 *     summary: Pay Bill (Web Site)
 *     tags: [Bill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriber_no: { type: string }
 *               month: { type: string }
 *               amount: { type: number }
 *     responses:
 *       200:
 *         description: Payment response
 *
 * /admin/bill:
 *   post:
 *     summary: Add Bill (Admin)
 *     tags: [Bill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Bill"
 *     responses:
 *       200:
 *         description: Bill added
 *
 * /admin/bill/batch:
 *   post:
 *     summary: Upload CSV for batch bill insert (Admin)
 *     tags: [Bill]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Batch upload result
 */

import { Router } from "express";
import { addBillController, listBillsController } from "../controllers/billController";
import { queryBillController } from "../controllers/queryBillController";
import { authMiddleware } from "../middleware/authMiddleware";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware";
import { queryBillDetailedController } from "../controllers/billDetailedController";
import { bankingQueryController } from "../controllers/bankingQueryController";
import { payBillController } from "../controllers/payBillController";
import { upload } from "../middleware/uploadMiddleware";
import { csvUploadController } from "../controllers/csvUploadController";

const router = Router();

// Admin
router.post("/admin/bill", addBillController);
router.get("/admin/bill/list", listBillsController);

// Mobile Provider → Query Bill (Auth + RateLimit)
router.get(
  "/bill",
  authMiddleware,
  queryBillController
);
// Mobile Provider → Query Bill Detailed (Auth)
router.get(
  "/bill/detailed",
  authMiddleware,
  queryBillDetailedController
);
// Banking System → Query Unpaid Bills (Auth)
router.get(
  "/bank/bill",
  authMiddleware,
  bankingQueryController
);
// Banking System → Pay Bill (Auth)
router.post("/pay", payBillController);

// Admin → Batch Upload Bills via CSV
router.post(
  "/admin/bill/batch",
  upload.single("file"),
  csvUploadController
);
export default router;


