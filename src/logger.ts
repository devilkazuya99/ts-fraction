
const enableDebug = true;

export const logger = { debug: (m?, ...o) => enableDebug ? console.log(m, o) : undefined };
