import en from './en.json' with { type: 'json' };
import hi from './hi.json' with { type: 'json' };
export const dictionaries = {
    hi,
    en,
};
export function t(key, lang = 'hi', params) {
    const keys = key.split('.');
    let current = dictionaries[lang] || dictionaries.hi;
    for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
            current = current[k];
        }
        else {
            // Fallback to Hindi or English
            current = dictionaries.en;
            for (const fallbackK of keys) {
                if (current && typeof current === 'object' && fallbackK in current) {
                    current = current[fallbackK];
                }
                else {
                    return key;
                }
            }
            break;
        }
    }
    if (typeof current !== 'string') {
        return key;
    }
    let result = current;
    if (params) {
        for (const [pKey, pVal] of Object.entries(params)) {
            result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        }
    }
    return result;
}
export const transliteratedAliases = {
    electrician: [
        'bijli',
        'bijli mistri',
        'wireman',
        'switch kharab',
        'wiring',
        'fan fitting',
        'inverter',
        'fuse',
        'mcb',
        'short circuit'
    ],
    plumber: [
        'nal',
        'nal mistri',
        'pipe leak',
        'paani tapak raha',
        'tanki',
        'motor',
        'tap change',
        'basin fitting',
        'sewer'
    ],
    appliance_repair: [
        'fridge',
        'washing machine',
        'geyser',
        'cooler',
        'microwave',
        'motor kharab',
        'thanda nahi kar raha'
    ]
};
//# sourceMappingURL=index.js.map