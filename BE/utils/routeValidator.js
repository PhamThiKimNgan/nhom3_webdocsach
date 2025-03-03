/**
 * Utility to validate route handlers and ensure they're properly defined
 */

/**
 * Wraps route handlers to validate they exist before registering
 * @param {object} router - Express router object
 * @returns {object} - Wrapped router with validation
 */
function validateRouterHandlers(router) {
  const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];
  
  // Create a proxy for the router to intercept method calls
  const wrappedRouter = {};
  
  httpMethods.forEach(method => {
    wrappedRouter[method] = function(path, ...handlers) {
      // Check if any handler is undefined
      const invalidHandlerIndex = handlers.findIndex(h => h === undefined);
      
      if (invalidHandlerIndex !== -1) {
        console.error(`ERROR: Route "${method.toUpperCase()} ${path}" has undefined handler at position ${invalidHandlerIndex}`);
        throw new Error(`Route handler for ${method.toUpperCase()} ${path} is undefined at position ${invalidHandlerIndex}`);
      }
      
      // If all handlers are valid, register the route
      return router[method](path, ...handlers);
    };
  });
  
  return wrappedRouter;
}

module.exports = { validateRouterHandlers };
