import User from "../Models/auth";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send({ mgs: "Email exist already" });
    if (!name || !email || !password)
      return res.status(400).send({ msg: "Please enter all fields" });
    if (!validateEmail(email))
      return res.status(400).send({ msg: "Invalid email" });
    if (password.length < 8)
      return res
        .status(400)
        .send({ msg: "Password must be at least 8 characters" });

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ validateEmail }).exec();
    if (!user) return res.status(400).send("No user found");
    const match = await comparePassword(password, user.password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try Again");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout Success" });
  } catch (err) {
    console.log(err);
  }
};
