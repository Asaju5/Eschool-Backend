import User from "../Models/auth";
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).send({ msg: "Please enter all fields" });
    if (!validateEmail(email))
      return res.status(400).send({ msg: "Invalid email" });
    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ mgs: "Email exist already" });
    if (password.length < 8)
      return res
        .status(400)
        .send({ msg: "Password must be at least 8 characters" });


  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
