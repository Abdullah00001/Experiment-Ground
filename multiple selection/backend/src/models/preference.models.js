import { model, Schema } from "mongoose";

const PreferencesSchema = new Schema(
  {
    chosenTopics: [{ type: Schema.Types.ObjectId, ref: "Topics" }],
  },
  { timestamps: true }
);

const Preferences = model("Preference", PreferencesSchema);

export default Preferences;
