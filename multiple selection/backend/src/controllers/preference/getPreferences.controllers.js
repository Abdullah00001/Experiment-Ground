import Preferences from "../../models/preference.models.js";

const getPreferences = async (req, res) => {
  try {
    const data = await Preferences.find({});
    return res.status(200).json({
      success: true,
      message: "Preferences retrieved successful",
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default getPreferences;
