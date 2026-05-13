import mongoose from "mongoose";

const imageJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    scale: {
      type: Number,
      required: true,
    },

    applyDenoise: {
      type: Boolean,
      default: false,
    },

    applySharpen: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "completed",
    },

    processingTime: {
      type: Number,
    },

    originalSize: {
      type: [Number],
    },

    finalSize: {
      type: [Number],
    },

    psnr: {
      type: Number,
      default: null,
    },

    ssim: {
      type: Number,
      default: null,
    },

    resultUrl: {
      type: String,
    },

    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const ImageJob = mongoose.model("ImageJob", imageJobSchema);

export default ImageJob;