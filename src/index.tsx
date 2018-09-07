import * as React from "react";
import * as ReactDOM from "react-dom";
import { TheAngularApp } from "./TheAngularApp.tsx";
import { TheVueApp } from "./TheVueApp.tsx";
import { TheReactApp } from "./TheReactApp.tsx";
import "./styles.css";

class App extends React.Component {
  intervalRef = null;
  state = {
    showVue: true,
    showReact: true,
    showAngular: true,
    counter: 1
  };

  _toggle = prop => {
    this.setState(({ [prop]: value }) => ({
      [prop]: !value
    }));
  };

  _incrementCounter = () => {
    this.setState(({ counter }) => ({
      counter: counter + 1
    }));
  };

  render() {
    const { state } = this;
    return (
      <div className="root">
        <div className="app-container" onClick={() => this._toggle("showVue")}>
          {state.showVue && (
            <TheVueApp appType="Vue" counterVal={state.counter} />
          )}
        </div>
        <div
          className="app-container"
          onClick={() => this._toggle("showReact")}
        >
          {state.showReact && (
            <TheReactApp appType="React" counterVal={state.counter} />
          )}
        </div>
        <div
          className="app-container"
          onClick={() => this._toggle("showAngular")}
        >
          {state.showAngular && (
            <TheAngularApp appType="Angular" counterVal={state.counter} />
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.intervalRef = setInterval(this._incrementCounter, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalRef);
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
