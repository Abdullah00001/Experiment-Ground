import Topics from "../../models/topics.model.js";

const createTopic = async (req, res) => {
  try {
    const newTopic = new Topics(req.body);
    await newTopic.save();
    return res.status(201).json({
      success: true,
      message: "Topics Created Successful",
      data: newTopic,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default createTopic;
