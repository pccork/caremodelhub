import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },
    
    // patient identifier (backend only)
    mrn: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    // laboratory specimen identifier
    specimenNo: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },



    inputs: {
      type: Object,
      required: true,
    },

    outputs: {
      type: Object,
      required: true,
    },

    model: {
      type: String,
      default: "KFRE",
    },

    modelVersion: {
      type: String,
      default: "v1",
    },
  },
  { timestamps: true }
);

/* ===============================
   SUPPORTING INDEXES (NEW)
   =============================== */

/**
 * Speed up “same specimen recently” checks
 * Used by existsRecent(mrn, specimenNo, months)
 */
resultSchema.index({ specimenNo: 1, createdAt: -1 });

/**
 * Speed up MRN + specimen + time-window queries
 * Clinical duplicate-prevention logic
 */
resultSchema.index({ mrn: 1, specimenNo: 1, createdAt: -1 });


export const ResultMongoose = mongoose.model("Result", resultSchema);
