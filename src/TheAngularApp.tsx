import "core-js/es7/reflect";
import "zone.js/dist/zone";
import * as uuid from "uuid/v4";
import { reactComponentAdapter } from "./reactComponentAdapter";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Component, NgModuleRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import {
  StoreModule,
  Store,
  select,
  createSelector,
  Action
} from "@ngrx/store";
import { Observable, Subject } from "rxjs";

const createAppModule = (props, propSubject, componentName) => {
  interface PropsState {
    appType: string;
    counterVal: number;
    localCounterVal: number;
  }
  interface AppState {
    props: PropsState;
  }

  const propsReducer = (
    state: PropsState = { localCounterVal: 1, ...props },
    { type, payload }: Action
  ) => {
    switch (type) {
      case "UPDATE":
        return {
          ...state,
          ...payload
        };
      case "INCREMENT_LOCAL_COUNTER":
        return {
          ...state,
          localCounterVal: state.localCounterVal + 1
        };
      case "RESET":
        return { localCounterVal: 1, ...props };
    }
    return state;
  };

  const selectProps = (state: AppState) => state.props;
  const selectAppType = createSelector(selectProps, ({ appType }) => appType);
  const selectCounterVal = createSelector(
    selectProps,
    ({ counterVal }) => counterVal
  );
  const selectLocalCounterVal = createSelector(
    selectProps,
    ({ localCounterVal }) => localCounterVal
  );

  @Component({
    selector: componentName,
    template: `
      <div class="app angular-app">
        <div class="counter">
          <div class="counter-label"> Counter from prop </div>
          <div class="counter-value"> {{counterVal$ | async}}</div>
        </div>
        <div class="counter">
          <div class="counter-label"> Local counter </div>
          <div class="counter-value"> {{localCounterVal$ | async}}</div>
        </div>
      </div>`
  })
  class AppComponent {
    intervalRef: number;
    appType$: Observable<string>;
    counterVal$: Observable<number>;
    localCounterVal$: Observable<number>;
    subscription: Subject<any>;

    constructor(private store: Store<AppState>) {
      this.appType$ = store.pipe(select(selectAppType));
      this.counterVal$ = store.pipe(select(selectCounterVal));
      this.localCounterVal$ = store.pipe(select(selectLocalCounterVal));
      this.subscription = propSubject.subscribe(
        props =>
          store.dispatch({
            type: "UPDATE",
            payload: props
          }),
        e => console.error(e),
        () => console.info("completed")
      );
    }

    ngOnInit() {
      this.intervalRef = window.setInterval(() => {
        this.store.dispatch({
          type: "INCREMENT_LOCAL_COUNTER"
        });
      }, 1000);
    }

    ngOnDestroy() {
      window.clearInterval(this.intervalRef);
      this.subscription.unsubscribe();
    }
  }

  const store = StoreModule.forRoot({ props: propsReducer });

  @NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, store],
    providers: [],
    bootstrap: [AppComponent]
  })
  class AppModule {}

  return AppModule;
};

export const TheAngularApp = reactComponentAdapter(() => {
  let AppModule: NgModuleRef<any> | null = null;
  let propSubject: Subject<any> | null = null;

  return {
    onMount: async ({ rootElement, props }) => {
      const componentName = `app-root-${uuid()}`;
      const appRoot = document.createElement(componentName);
      propSubject = new Subject();
      rootElement.replaceWith(appRoot);
      AppModule = await platformBrowserDynamic().bootstrapModule(
        createAppModule(props, propSubject, componentName)
      );
    },
    onUpdate({ props }) {
      propSubject.next(props);
    },
    onUnmount() {
      AppModule.destroy();
    },
    willReplaceElement: true
  };
});
