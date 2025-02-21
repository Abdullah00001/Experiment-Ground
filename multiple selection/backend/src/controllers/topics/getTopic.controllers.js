import Topics from "../../models/topics.model.js";

const getTopic = async (req, res) => {
  try {
    const data = await Topics.find({});
    return res.status(200).json({
      success: true,
      message: "Topics retrieved successful",
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default getTopic;
