
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../Model/User"); // import your user model
const router = express.Router();

router.get("/github/callback", async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Step 2: Fetch GitHub user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userRes.data;

    // Step 3: Check if user exists in DB
    let user = await User.findOne({ githubId: githubUser.id.toString() });

    console.log(githubUser);
    

    // Step 4: Create user if not exists
    if (!user) {
     user = await User.create({
  githubId: githubUser.id.toString(),
  name: githubUser.login,
  email: githubUser.email || `${githubUser.login}@github.local`,
});
    }

    // Step 5: Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const redirectUrl = `${process.env.FRONTENDURL}/github-success?token=${token}`;

res.redirect(redirectUrl);

    // Step 6: Redirect or respond
    // res.json({
    //   message: "GitHub login successful",
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //   },
    //   token,
    // });

  } catch (err) {
    console.error("GitHub OAuth error:", err.response?.data || err.message);
    res.status(500).json({ error: "GitHub login failed" });
  }
});

module.exports = router;
