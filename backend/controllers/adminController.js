const AppSettings = require("../models/appsettings");

// Get persistence type
exports.getPersistenceType = async (req, res) => {
  try {
    const settings = await AppSettings.findOne();
    res.json(settings || { persistenceType: "local" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch persistence type" });
  }
};

// Update persistence type
exports.updatePersistenceType = async (req, res) => {
  const { persistenceType } = req.body;

  const validTypes = ["local", "session", "none"];
  if (!validTypes.includes(persistenceType)) {
    return res.status(400).json({ error: "Invalid persistence type" });
  }

  try {
    const settings = await AppSettings.findOneAndUpdate(
      {},
      { persistenceType },
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update persistence type" });
  }
};
