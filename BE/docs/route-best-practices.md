# Express Route Best Practices

## Common Issues and How to Fix Them

### The "Route requires callback function" Error

This error occurs when Express tries to register a route without a valid callback function:

```javascript
// ❌ INCORRECT - Missing callback function
router.get("/some-path");

// ❌ INCORRECT - Undefined handler
const someHandler = undefined;
router.get("/some-path", someHandler);
```

### Correct Route Definition

```javascript
// ✅ CORRECT - With inline callback
router.get("/some-path", (req, res) => {
  res.send("This is correct");
});

// ✅ CORRECT - With named function
function handleSomePath(req, res) {
  res.send("This is correct");
}
router.get("/some-path", handleSomePath);

// ✅ CORRECT - With controller reference
const controller = require("../controllers/someController");
router.get("/some-path", controller.someMethod);
```

### Using Middleware

```javascript
// With middleware and controller
const { authenticate } = require("../middleware/auth");
const controller = require("../controllers/userController");

// Make sure all handlers are defined
router.get("/users", authenticate, controller.getUsers);
```

### Safe Import Pattern

To avoid undefined controllers/handlers:

```javascript
const controller = require("../controllers/someController");

// Check if controller methods exist
if (!controller.someMethod) {
  throw new Error("Missing controller method: someMethod");
}

// Now use the controller
router.get("/some-path", controller.someMethod);
```

## Using the Route Validator

We've added a route validator utility that can help catch these issues at startup:

```javascript
const express = require("express");
const { validateRouterHandlers } = require("../utils/routeValidator");

const router = express.Router();
const validatedRouter = validateRouterHandlers(router);

// Use validatedRouter instead of router
validatedRouter.get("/safe-route", (req, res) => {
  res.send("This route is validated");
});

module.exports = router;
```
