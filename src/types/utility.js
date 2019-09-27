// @flow
type ExtractReturnType = <R>((...any[]) => R) => R;
export type ReturnType<F> = $Call<ExtractReturnType, F>;

declare function arguments<A>((A) => any): [A];
// eslint-disable-next-line no-redeclare
declare function arguments<A, B>((A, B) => any): [A, B];
// eslint-disable-next-line no-redeclare
declare function arguments<A, B, C>((A, B, C) => any): [A, B, C];

export type Arguments<T> = $Call<typeof arguments, T>;
