export default class GameLoop {
  private readonly fps: number;
  private readonly frameDuration: number;
  private lastTime: number;
  private accumulatedTime: number;
  private animationFrameId: number | null = null;
  private loopParticipants: GameLoopParticipant[] = [];

  constructor(fps: number) {
    this.fps = fps;
    this.frameDuration = 1000 / fps;
    this.lastTime = 0;
    this.accumulatedTime = 0;
  }

  private update(deltaTime: number): void {
    // Hier kommt die Logik deines Spiels hin (z.B. Bewegung, Kollisionsabfragen)
    // console.log(`Updating game logic with deltaTime: ${deltaTime}ms`);
    this.loopParticipants.forEach((p) => p.update && p.update());
  }

  private render(): void {
    // Alle registrierten Render-Funktionen aufrufen
    this.loopParticipants.forEach((p) => p.render && p.render());
  }

  private loop = (currentTime: number): void => {
    if (!this.lastTime) {
      this.lastTime = currentTime;
    }

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += deltaTime;

    while (this.accumulatedTime >= this.frameDuration) {
      this.update(this.frameDuration);
      this.accumulatedTime -= this.frameDuration;
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public start(): void {
    if (this.animationFrameId === null) {
      this.lastTime = 0;
      this.animationFrameId = requestAnimationFrame(this.loop);
      console.info("Gameloop started");
    }
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.info("Gameloop ended");
    }
  }

  public addLoopParticipant(participant: GameLoopParticipant): void {
    if (!this.loopParticipants.find((p) => p.id === participant.id)) {
      this.loopParticipants.push(participant);
    }
  }

  public removeLoopParticipant(id: string): void {
    this.loopParticipants = this.loopParticipants.filter((p) => p.id !== id);
  }

  // Die isRunning Methode
  public isRunning(): boolean {
    return this.animationFrameId !== null;
  }
}

export type GameLoopParticipant = {
  id: string;
  update?: () => void;
  render?: () => void;
};
