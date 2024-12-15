/* eslint-disable @typescript-eslint/no-explicit-any */
export type Serializer = {
  parse: (
    text: string,
    reviver?: ((this: any, key: string, value: any) => any) | undefined
  ) => any;
  stringify: (
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined
  ) => string;
};
