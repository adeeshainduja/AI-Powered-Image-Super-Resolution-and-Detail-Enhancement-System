import express from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

function parseBoolean(value) {
  return value === true || value === "true" || value === "1" || value === "yes";
}

function validateScale(scale) {
  const numericScale = Number(scale);

  if (![1, 2, 3, 4, 5].includes(numericScale)) {
    throw new Error("Invalid scale. Use 1, 2, 3, 4, or 5.");
  }

  return numericScale;
}

function getBooleanBodyValue(req, modernName, legacyName) {
  return parseBoolean(req.body[modernName] ?? req.body[legacyName]);
}

router.post(
  "/enhance",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    let uploadedFilePath = null;

    try {
      const uploadedImage = req.files?.file?.[0] ?? req.files?.image?.[0];

      if (!uploadedImage) {
        return res.status(400).json({
          message: "Image file is required.",
        });
      }

      uploadedFilePath = uploadedImage.path;

      const scale = validateScale(req.body.scale || 4);
      const applyDenoise = getBooleanBodyValue(req, "denoise", "applyDenoise");
      const applySharpen = getBooleanBodyValue(req, "sharpen", "applySharpen");

      const formData = new FormData();

      formData.append(
        "file",
        fs.readFileSync(uploadedFilePath),
        uploadedImage.originalname
      );

      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/enhance`,
        formData,
        {
          headers: formData.getHeaders(),
          params: {
            scale,
            denoise: applyDenoise,
            sharpen: applySharpen,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 1000 * 60 * 10,
        }
      );

      const data = mlResponse.data;

      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(202).json({
        ...data,
        message: "Image enhancement job queued.",
        job: { jobId: data.job_id },
        resultUrl: data.result_url || `/result/${data.job_id}`,
      });
    } catch (error) {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(500).json({
        message: "Image enhancement failed.",
        error: error.response?.data?.detail || error.message,
      });
    }
  }
);

router.get("/status/:jobId", async (req, res) => {
  try {
    const mlResponse = await axios.get(
      `${ML_SERVICE_URL}/status/${req.params.jobId}`,
      { timeout: 1000 * 30 }
    );

    return res.status(mlResponse.status).json(mlResponse.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch job status.",
      error: error.response?.data?.detail || error.message,
    });
  }
});

router.get("/result/:jobId", async (req, res) => {
  try {
    const mlResponse = await axios.get(
      `${ML_SERVICE_URL}/result/${req.params.jobId}`,
      {
        responseType: "stream",
        timeout: 1000 * 60 * 10,
        validateStatus: () => true,
      }
    );

    if (mlResponse.status >= 400) {
      return res.status(mlResponse.status).json({
        message: "Failed to fetch result.",
      });
    }

    res.status(mlResponse.status);
    res.setHeader(
      "content-type",
      mlResponse.headers["content-type"] || "image/png"
    );

    if (mlResponse.headers["content-disposition"]) {
      res.setHeader(
        "content-disposition",
        mlResponse.headers["content-disposition"]
      );
    }

    return mlResponse.data.pipe(res);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch result.",
      error: error.response?.data?.detail || error.message,
    });
  }
});

router.get("/history", async (req, res) => {
  return res.status(200).json([]);
});

router.get("/history/:jobId", async (req, res) => {
  return res.status(404).json({
    message: "Job history is not persisted by this gateway.",
  });
});

export default router;
