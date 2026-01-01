type NextCodeOptions = {
    lastCode?: string;
    prefix?: string;
    start?: number;
    padLength?: number;
};

type ContinuousOptions = NextCodeOptions & {
    count: number;
};

/**
 * Parse a code like "USR-1000" into { prefix: "USR-", num: 1000, numLength: 4 }
 * Returns null if there is no trailing number.
 */
function parseCode(code: string) {
    const m = code.match(/^(.*?)(\d+)$/);
    if (!m) return null;
    return {
        prefix: m[1],
        num: parseInt(m[2], 10),
        numLength: m[2].length,
    };
}

export function generateNextCode(opts: NextCodeOptions): string {
    const { lastCode, prefix: overridePrefix, start = 1, padLength: overridePad } = opts;

    if (lastCode) {
        const parsed = parseCode(lastCode);
        if (parsed) {
            const nextNum = parsed.num + 1;
            const pad = overridePad ?? parsed.numLength;
            const prefix = overridePrefix ?? parsed.prefix;
            return prefix + String(nextNum).padStart(pad, '0');
        }
        // lastCode has no trailing number - treat as prefix
        const prefix = overridePrefix ?? lastCode;
        const pad = overridePad ?? String(start).length;
        return prefix + String(start).padStart(pad, '0');
    }

    // No lastCode: use provided prefix/start
    const prefix = overridePrefix ?? '';
    const pad = overridePad ?? String(start).length;
    return prefix + String(start).padStart(pad, '0');
}

export function generateContinuousCodes(opts: ContinuousOptions): string[] {
    const { lastCode, prefix: overridePrefix, start = 1, count, padLength: overridePad } = opts;
    if (count <= 0) return [];

    let currentNum: number;
    let prefix: string;
    let pad: number;

    if (lastCode) {
        const parsed = parseCode(lastCode);
        if (parsed) {
            currentNum = parsed.num + 1;
            prefix = overridePrefix ?? parsed.prefix;
            pad = overridePad ?? parsed.numLength;
        } else {
            // lastCode has no numeric part -> treat as prefix and start from `start`
            prefix = overridePrefix ?? lastCode;
            currentNum = start;
            pad = overridePad ?? String(start).length;
        }
    } else {
        prefix = overridePrefix ?? '';
        currentNum = start;
        pad = overridePad ?? String(start).length;
    }

    const results: string[] = [];
    for (let i = 0; i < count; i++) {
        results.push(prefix + String(currentNum + i).padStart(pad, '0'));
    }
    return results;
}
