import { ResultMongoose } from "./result.js";

export const resultStore = {
  async create(userId: string, inputs: any, outputs: any) {
    return ResultMongoose.create({
      userId,
      inputs,
      outputs,
    });
  },

  async findByUser(userId: string) {
    return ResultMongoose.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  async findAll() {
    return ResultMongoose.find().sort({ createdAt: -1 }).lean();
  },

  async deleteById(id: string) {
    return ResultMongoose.findByIdAndDelete(id);
  },
};
