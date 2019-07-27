// @flow
export type Action<Payload> = {
  +type: string,
  payload?: Payload,
};

export type Reducer<State, Payload> = (
  state: State,
  action: Action<Payload>
) => State;

export type ReducerMap<State, Payload> =
  | { next: Reducer<State, Payload> }
  | { throw: Reducer<State, Payload> }
  | { next: Reducer<State, Payload>, throw: Reducer<State, Payload> };

export type GetState<State> = () => State;

export type ThunkAction<Payload, State> = (
  dispatch: Dispatch<Payload>,
  getState: GetState<State>
) => any;

export type PromiseAction<Payload> = Promise<Action<Payload>>;

export type DispatchAction<Payload> = Action<Payload> | PromiseAction<Payload>;

export type Dispatch<Payload> = (
  action: DispatchAction<Payload> | ((Dispatch<Payload>) => mixed)
) => DispatchAction<Payload>;

export type ActionCreator<State, Payload> = (
  dispatch: Dispatch<Payload>,
  getState: GetState<State>
) => any;
