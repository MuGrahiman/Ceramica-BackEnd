const userModel = require("./user.model");

exports.Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ username });
    if (!existingUser) {
      return res.status(404).send({ message: "User not found!" });
    }

    const Password = await bcrypt.compare(password, admin.password);
    if (!Password) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token: token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin", error);
    res.status(401).send({ message: "Failed to login as admin" });
  }
};
