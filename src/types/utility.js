// @flow
type ExtractReturnType = <R>((...any[]) => R) => R;
export type ReturnType<F> = $Call<ExtractReturnType, F>;
