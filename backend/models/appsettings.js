const mongoose = require("mongoose");

const appSettingsSchema = new mongoose.Schema({
  persistenceType: {
    type: String,
    enum: ["local", "session", "none"],
    default: "local",
  },
});

const AppSettings = mongoose.model("AppSettings", appSettingsSchema);

module.exports = AppSettings;