type Callback = () => void;

export class DelayTimer {
  private callback: Callback;
  private delay: number;
  private timerId: NodeJS.Timeout | null;

  constructor(callback: Callback, delay: number) {
    this.callback = callback;
    this.delay = delay;
    this.timerId = null;
  }

  start(): NodeJS.Timeout | null {
    if (this.timerId === null) {
      this.timerId = setTimeout(() => {
        this.callback();
        this.timerId = null;
      }, this.delay);
    }
    return this.timerId;
  }

  stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}