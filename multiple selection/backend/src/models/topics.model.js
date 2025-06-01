import { model, Schema } from "mongoose";

const TopicSchema = new Schema(
  {
    topicsName: { type: String },
  },
  { timestamps: true }
);

const Topics = model("Topic", TopicSchema);

export default Topics;
