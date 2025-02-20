const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Medic = require("../models/medic");
const Patient = require("../models/patient");

const SECRET_KEY = "secret";
const REFRESH_TOKENS = [];
const EXPIRE_IN = "60s";
const REFRESH_EXPIRE_IN = "1d";

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.registerMedic = async (req, res) => {
  const { email, password, role, name, surname, type } = req.body;

  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    if (role === "medic") {
      const medic = new Medic({
        _id: user._id,
        name,
        surname,
        type,
      });

      await medic.save();
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.registerPatient = async (req, res) => {
  const { email, password, role, name, surname, ban, birthdate, gender } =
    req.body;

    console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    if (role === "patient") {
      const patient = new Patient({
        _id: user._id,
        name,
        surname,
        ban,
        birthdate,
        gender,
      });

      await patient.save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        error: "User not found",
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: EXPIRE_IN }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: REFRESH_EXPIRE_IN }
    );

    REFRESH_TOKENS.push(refreshToken);

    res.status(200).json({
      token,
      refreshToken,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({
      error: "Login failed",
    });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  const index = REFRESH_TOKENS.indexOf(refreshToken);
  if (index === -1) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  REFRESH_TOKENS.splice(index, 1);

  res.status(200).json({ message: "Logout successful" });
};

exports.token = async (req, res) => {
  console.log("token controller called");

  const { refreshToken } = req.body;

  if (!refreshToken || !REFRESH_TOKENS.includes(refreshToken)) {
    return res.status(403).json({
      error: "Invalid refresh token",
    });
  }

  console.log("refreshToken", refreshToken);

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalid" });

    const newToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: EXPIRE_IN,
      }
    );

    console.log("newToken", newToken);
    res.status(200).json({
      token: newToken,
    });
  });
};
