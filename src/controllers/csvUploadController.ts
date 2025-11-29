import { Request, Response } from "express";
import { csvUploadService } from "../services/csvUploadService";

interface MulterRequest extends Request {
  file: any;
}

export const csvUploadController = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const result = await csvUploadService(req.file.buffer);

    return res.json({
      message: "Batch upload completed",
      result,
    });
  } catch (err) {
    console.error("CSV Upload Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
