// Simple in-memory rate limiter to replace Arcjet temporarily
const rateLimits = new Map();

const simpleRateLimiter = {
  protect: async (_, { userId, requested = 1, actionType = "default" }) => {
    const now = Date.now();
    const userKey = userId || "anonymous";
    const userLimits = rateLimits.get(userKey) || {
      count: 0,
      reset: now + 86400000, // 24 hours (daily reset)
    };

    // Reset if time expired
    if (now > userLimits.reset) {
      userLimits.count = 0;
      userLimits.reset = now + 86400000; // 24 hours
    }

    // Check if would exceed limit
    const wouldExceed = userLimits.count + requested > 10; // Max 10 transactions per day

    // Update count if not exceeding
    if (!wouldExceed) {
      userLimits.count += requested;
    }

    // Store updated limits
    rateLimits.set(userKey, userLimits);

    // Return proper response object that matches Arcjet API
    return {
      isDenied: () => wouldExceed,
      isRateLimit: () => wouldExceed,
      reason: wouldExceed
        ? {
            remaining: 0,
            reset: Math.ceil((userLimits.reset - now) / 1000), // Seconds until reset
          }
        : null,
    };
  },
};

// Export the simple rate limiter as the default object
export default simpleRateLimiter;
