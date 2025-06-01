import Preferences from "../../models/preference.models.js";

const choseTopics = async (req, res) => {
  try {
    const newChoseTopics = new Preferences(req.body);
    await newChoseTopics.save();
    return res.status(201).json({
      success: true,
      message: "User preference added Successful",
      data: newChoseTopics,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default choseTopics;
