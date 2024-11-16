import {LitElement, html, css} from "lit";

class AudioPlayer extends LitElement {
  static properties = {
    audioUrl: {type: String},
    state: {type: String},
  };

  static styles = css`
    :host {
      display: inline-block;
    }
    .player {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      font-size: 20px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: #edeff0;
      color: #333;
      cursor: pointer;

      line-height: 1;
    }
    button:hover {
      background: #357abd;
    }
    .status {
      font-size: 0.875rem;
      color: #666;
    }
  `;

  constructor() {
    super();
    this.state = "idle";
    this.audio = null;
    this.handlePlayPause = this.handlePlayPause.bind(this);
    console.log("AudioPlayer constructor called");
  }

  firstUpdated() {
    console.log("firstUpdated called");
    this.audio = new Audio(this.audioUrl);
    this.audio.addEventListener("ended", () => {
      this.state = "idle";
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.audio) {
      this.audio.removeEventListener("ended", () => {});
      this.audio = null;
    }
  }

  play() {
    if (this.state === "idle") {
      this.audio.currentTime = 0;
    }
    this.audio.play();
    this.state = "playing";
    console.log(`Playing ${this.state}`);
  }

  pause() {
    this.audio.pause();
    this.state = "idle";
    console.log(`Paused ${this.state}`);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state = "idle";
    console.log(`Stopped ${this.state}`);
  }

  handlePlayPause() {
    console.log("handlePlayPause called");
    if (this.state === "playing") {
      this.pause();
    } else {
      this.play();
    }
  }

  render() {
    console.log("render called, state:", this.state);
    return html`
      <div class="player">
        <button
          @click=${this.handlePlayPause}
          aria-label=${this.state === "playing" ? "Pause" : "Play"}>
          🗣️
        </button>
        <span class="status">Status: ${this.state}</span>
      </div>
    `;
  }
}

customElements.define("audio-player", AudioPlayer);

export default AudioPlayer;

console.log("AudioPlayer defined");
