const enableDebug = false;

export const logger = {
    debug: (m?: unknown, ...o: unknown[]) => {
        return enableDebug ? (o.length > 0 ? console.log(m, o) : console.log(m)) : undefined;
    }
};

