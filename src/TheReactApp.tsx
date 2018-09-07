import * as React from "react";
import * as ReactDOM from "react-dom";
import { TheReactApp } from "./TheReactApp.tsx";
import { reactComponentAdapter } from "./reactComponentAdapter";

class AppRoot extends React.Component {
  state = {
    counter: 1
  };

  _incrementCounter = () => {
    this.setState(({ counter }) => ({
      counter: counter + 1
    }));
  };

  render() {
    const { props, state } = this;
    return (
      <div className="react-app app">
        <div className="counter">
          <div className="counter-label">counter from prop</div>
          <div className="counter-value">{props.counterVal}</div>
        </div>
        <div className="counter">
          <div className="counter-label">local counter</div>
          <div className="counter-value">{state.counter}</div>
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

export const TheReactApp = reactComponentAdapter({
  onMount({ rootElement, props }) {
    ReactDOM.render(<AppRoot {...props} />, rootElement);
  },
  onUpdate({ rootElement, props }) {
    ReactDOM.render(<AppRoot {...props} />, rootElement);
  },
  onUnmount({ rootElement }) {
    ReactDOM.unmountComponentAtNode(rootElement);
  }
});
