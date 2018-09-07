import * as Vue from "vue";
import { reactComponentAdapter } from "./reactComponentAdapter";

export const TheVueApp = reactComponentAdapter(() => {
  let appRef = null;
  return {
    onMount({ rootElement, props }) {
      appRef = new Vue({
        el: rootElement,
        data: () => ({
          localCounterValue: 1,
          ...props
        }),
        mounted() {
          this.intervalRef = setInterval(() => this.localCounterValue++, 1000);
        },
        beforeDestroy() {
          clearInterval(this.intervalRef);
        },
        render(createElement) {
          return createElement("div", { class: "vue-app app" }, [
            createElement("div", { class: "counter" }, [
              createElement(
                "div",
                { class: "counter-label" },
                "counter from prop"
              ),
              createElement(
                "div",
                { class: "counter-value" },
                `${this.counterVal}`
              )
            ]),
            createElement("div", { class: "counter" }, [
              createElement("div", { class: "counter-label" }, "local counter"),
              createElement(
                "div",
                { class: "counter-value" },
                `${this.localCounterValue}`
              )
            ])
          ]);
        }
      });
    },
    /* For Vue apps, we should update the reactive props we defined on our
     root instance whenever we receive new props */
    onUpdate({ app, props }) {
      appRef.counterVal = props.counterVal;
      appRef.appType = props.appType;
    },
    onUnmount({ app }) {
      appRef.$destroy();
    },
    willReplaceElement: true
  };
});
