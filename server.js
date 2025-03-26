const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.defaults();
const bodyParser = require("body-parser");

// ✅ Enable CORS for both local & deployed frontend
server.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"], // Replace with deployed frontend
    credentials: true,
  })
);

server.use(middlewares);
server.use(bodyParser.json()); // ✅ Properly parse JSON body

// ✅ Custom Login Route
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value(); // Fetch users from db.json

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});

// ✅ Custom Logout Route (Mock)
server.post("/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Ensure all other routes work
server.use(router);

// ✅ Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server is running at http://localhost:${PORT}`);
});
