//@flow
import React, { Component } from "react";
import { isFunction } from "lodash/fp";

const defaultStyle = {
  width: "100%",
  height: "100%",
  display: "block"
};

export const reactComponentAdapter = (config: {
  ...CreateAdapter,
  style?: Object
}) =>
  class ReactComponentAdapter extends Component<Object, State> {
    rootElement: ?HTMLElement;
    appElement: ?HTMLElement;
    appRef: ?Object;

    constructor(props: Object) {
      super(props);
      this.rootElement = null;
      this.appRef = null;

      this.config = isFunction(config) ? config() : config;
    }

    _updateRef = (ref: ?HTMLElement) => {
      this.rootElement = ref;
    };

    _renderApp = (props: Object) => {
      if (!this.rootElement) {
        return console.error(
          `No rootElement was available for rendering the application:`,
          this.config
        );
      }

      this.appRef = this.config.onMount({
        props,
        rootElement: this.config.willReplaceElement
          ? this.appElement
          : this.rootElement
      });
    };

    _updateApp = (props: Object) => {
      this.config.onUpdate({
        props,
        app: this.appRef,
        rootElement: this.config.willReplaceElement
          ? this.appElement
          : this.rootElement
      });
    };

    componentWillUnmount() {
      if (!this.appRef && !this.rootElement) {
        return console.error(`No adapter references available: `, {
          rootRef: this.rootElement
        });
      }

      /* Call the onUnmount interface function so that the application will perform any necessary
     cleanup */
      this.config.onUnmount({
        rootElement: this.config.willReplaceElement
          ? this.appElement
          : this.rootElement
      });
    }

    /* Call render app after initial mounting an updates in order to prevent any unnecessary updates.
   This additionally prevents the application from being rendered before the root reference is ready */
    componentDidMount() {
      this.appElement = document.createElement("div");
      this.rootElement.appendChild(this.appElement);
      this._renderApp(this.props);
    }

    componentDidUpdate() {
      this._updateApp(this.props);
    }

    render() {
      return (
        <div
          style={{ ...defaultStyle, ...this.config.wrapperStyle }}
          ref={this._updateRef}
        />
      );
    }
  };
