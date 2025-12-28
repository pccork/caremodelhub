import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
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

export const ResultMongoose = mongoose.model("Result", resultSchema);
