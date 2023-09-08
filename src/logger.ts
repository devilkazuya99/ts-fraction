
const enableDebug = false;

export const logger = {
    debug: (m?, ...o) => {
        return enableDebug ? (o.length > 0 ? console.log(m, o) : console.log(m)) : undefined;
    }
};
