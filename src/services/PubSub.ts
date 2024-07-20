// services/PubSub.ts
type Callback = (data: any) => void;

class PubSub {
  private subscribers: { [event: string]: Callback[] };

  constructor() {
    this.subscribers = {};
  }

  subscribe(event: string, callback: Callback): () => void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    const index = this.subscribers[event].push(callback) - 1;
    return () => {
      this.subscribers[event].splice(index, 1);
    };
  }

  publish(event: string, data: any): void {
    if (!this.subscribers[event]) {
      return;
    }
    this.subscribers[event].forEach(callback => callback(data));
  }
}

export default new PubSub();
