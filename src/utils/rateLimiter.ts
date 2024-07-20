class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly limit: number;
  private readonly interval: number;

  constructor(limit: number, interval: number) {
    this.limit = limit;
    this.interval = interval;
    this.tokens = limit;
    this.lastRefill = Date.now();
  }

  public async getToken(): Promise<boolean> {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refillAmount = Math.floor(timePassed / this.interval) * this.limit;

    this.tokens = Math.min(this.limit, this.tokens + refillAmount);
    this.lastRefill = now;

    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }

    const waitTime = this.interval - (timePassed % this.interval);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.getToken();
  }
}

export const apiLimiter = new RateLimiter(10, 60000); // 10 requests per minute
