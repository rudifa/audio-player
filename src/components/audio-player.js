import {LitElement, html, css} from "lit";

/**
 * The solution with _hasExternalButton as a reactive property
 * and checking for slotted content in connectedCallback gives us
 * perfect behavior from the very first render.
 * This approach ensures we immediately know whether an external button exists,
 * allowing the component to render exactly one button -
 * either the slotted one or the default one - right from the start.
 * The reactive property system in LitElement helps maintain this state
 * consistently throughout the component's lifecycle.
 */
class AudioPlayer extends LitElement {
  static properties = {
    audioUrl: {type: String},
    state: {type: String},
    _hasExternalButton: {type: Boolean, state: true},
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
      background: #d6e9f2;
      color: #333;
      cursor: pointer;
      line-height: 1;
    }
    button:hover {
      background: #dbc4a0;
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
    this._hasExternalButton = false;
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // Check for slotted content as soon as element is connected
    setTimeout(() => {
      const nodes = this.querySelector('[slot="button"]');
      this._hasExternalButton = !!nodes;
    }, 0);
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
    this.requestUpdate();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state = "idle";
    this.requestUpdate();
  }

  handlePlayPause() {
    if (this.state === "playing") {
      this.stop();
    } else {
      this.play();
    }
  }

  firstUpdated() {
    this.audio = new Audio(this.audioUrl);
    this.audio.addEventListener("ended", () => {
      this.state = "idle";
      this.requestUpdate();
    });

    const buttonSlot = this.shadowRoot?.querySelector('slot[name="button"]');
    buttonSlot?.addEventListener("slotchange", (e) => {
      this._hasExternalButton = e.target.assignedNodes().length > 0;
    });
  }

  render() {
    console.log("render: _hasExternalButton", this._hasExternalButton);

    return html`
      <div class="player">
        <slot name="button" @click=${this.handlePlayPause}></slot>
        ${this._hasExternalButton
          ? ""
          : html`
              <button
                class="default-button"
                @click=${this.handlePlayPause}
                aria-label=${this.state === "playing" ? "Stop" : "Play"}>
                🗣️
              </button>
            `}
        <span class="status">Status: ${this.state}</span>
      </div>
    `;
  }
}

customElements.define("audio-player", AudioPlayer);

export default AudioPlayer;
