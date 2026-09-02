declare module '*.glb' {
  // otherwise .glb files in constants.ts raise an error
  const src: string;
  export default src;
}
