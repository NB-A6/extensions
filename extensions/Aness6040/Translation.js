// Name: Translation (i18n)
// ID: anessi18n
// Description: Translate texts with i18n.
// By: Aness6040 <https://scratch.mit.edu/users/AnessScratched/>
// License: MPL-2.0
(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("\"Translation (i18n)\" must run unsandboxed");
    }
    const Cast = Scratch.Cast;

    const catalogs = Object.create(null);

    let activeLocale = (navigator.language || navigator.userLanguage || "en").toString();
    let fallbackLocale = "en";
    let missingKeyTemplate = "{key}";

    function ensureLocale(locale) {
        if (!Object.hasOwn(catalogs, locale)) {
            catalogs[locale] = Object.create(null);
        }
        return catalogs[locale];
    }

    function lookupRaw(key) {
        const active = catalogs[activeLocale];
        if (active && Object.hasOwn(active, key)) return active[key];

        if (fallbackLocale && fallbackLocale !== activeLocale) {
            const fb = catalogs[fallbackLocale];
            if (fb && Object.hasOwn(fb, key)) return fb[key];
        }
        return null;
    }

    function missingKeyText(key) {
        return missingKeyTemplate.split("{key}").join(key);
    }

    function formatPositional(template, values) {
        let autoIndex = 0;
        return template.replace(/\{(\d*)\}/g, (match, indexStr) => {
            const idx = indexStr === "" ? autoIndex++ : parseInt(indexStr, 10);
            return idx < values.length ? String(values[idx]) : match;
        });
    }

    function formatNamed(template, names, values) {
        const map = Object.create(null);
        for (let i = 0; i < names.length; i++) map[names[i]] = values[i];
        return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) => {
            return Object.hasOwn(map, name) ? String(map[name]) : match;
        });
    }

    class AnessI18n {
        getInfo() {
            return {
                id: "anessi18n",
                name: "Translation (i18n)",
                color1: "#5b3cc4",
                color2: "#4b2fa3",
                color3: "#2e1c6b",
                blocks: [
                    {
                        opcode: "detectedBrowserLocale",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "device language",
                        duplicateOnDrag: true
                    },
                    {
                        opcode: "activeLocaleTag",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current language",
                        duplicateOnDrag: true
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Language Settings" },
                    {
                        opcode: "setActiveLocale",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "switch language to [LOCALE]",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            }
                        },
                        switches: ["setFallbackLocale"]
                    },
                    {
                        opcode: "setFallbackLocale",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "use [LOCALE] as backup language",
                        arguments: {
                            LOCALE: { type: Scratch.ArgumentType.STRING, defaultValue: "en" }
                        },
                        switches: ["setActiveLocale"]
                    },
                    {
                        opcode: "setMissingKeyTemplate",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "if a translation is missing, show [TEMPLATE]",
                        arguments: {
                            TEMPLATE: { type: Scratch.ArgumentType.STRING, defaultValue: "{key}" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Reset" },
                    {
                        opcode: "clearLocale",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "forget every translation for [LOCALE]",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            }
                        },
                        switches: [{ id: "clearAllCatalogs", splitInputs: ["LOCALE"] }]
                    },
                    {
                        opcode: "clearAllCatalogs",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "forget every translation, for every language",
                        switches: ["clearLocale"]
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Edit Strings" },
                    {
                        opcode: "setString",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "in [LOCALE] make [KEY] mean [VALUE]",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hello" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello!" }
                        },
                        switches: [{ id: "deleteString", splitInputs: ["VALUE"] }]
                    },
                    {
                        opcode: "deleteString",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "in [LOCALE] forget [KEY]",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hello" }
                        },
                        switches: ["setString"]
                    },
                    {
                        opcode: "hasString",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "does [LOCALE] know [KEY]?",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hello" }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Examples"
                    },
                    {
                        opcode: "exampleCatalogGreetings",
                        blockType: Scratch.BlockType.OBJECT,
                        text: "example for: greetings",
                        disableMonitor: true
                    },
                    {
                        opcode: "exampleCatalogItems",
                        blockType: Scratch.BlockType.OBJECT,
                        text: "example for: items",
                        disableMonitor: true
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Translate" },
                    {
                        opcode: "translate",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY]",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hello" }
                        }
                    },
                    {
                        opcode: "translateOrDefault",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY] or use [FALLBACK_TEXT] if missing",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hello" },
                            FALLBACK_TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello!" }
                        }
                    },
                    {
                        opcode: "translatePlural",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY] for a count of [COUNT]",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "cart.items" },
                            COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: "translateFormattedSimple",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY] filling in [ARGS]",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.bye" },
                            ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: "Alex" }
                        }
                    },
                    "---",
                    {
                        opcode: "getCatalogJson",
                        blockType: Scratch.BlockType.OBJECT,
                        text: "every translation for [LOCALE]",
                        disableMonitor: true,
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            }
                        }
                    },
                    {
                        opcode: "getAllCatalogsJson",
                        blockType: Scratch.BlockType.OBJECT,
                        text: "every translation, for every language",
                        disableMonitor: true
                    },
                    {
                        opcode: "loadCatalogJson",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "load translations for [LOCALE] from [CATALOG_JSON]",
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            },
                            CATALOG_JSON: {
                                type: Scratch.ArgumentType.OBJECT,
                                defaultValue: { "greeting.hello": "Hello!", "greeting.bye": "Goodbye, {0}!" }
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "getCatalogKeys",
                        blockType: Scratch.BlockType.ARRAY,
                        text: "translation keys in [LOCALE]",
                        disableMonitor: true,
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            }
                        }
                    },
                    {
                        opcode: "getCatalogValues",
                        blockType: Scratch.BlockType.ARRAY,
                        text: "translated texts in [LOCALE]",
                        disableMonitor: true,
                        arguments: {
                            LOCALE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "en"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "translateFormatted",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY], filling in [ARGS]",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.bye" },
                            ARGS: {
                                type: Scratch.ArgumentType.EXTENDABLE,
                                text: "[VALUE]",
                                arguments: {
                                    VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                                },
                                defaultInputs: 1,
                                minInputs: 0,
                                maxInputs: 20,
                                separator: ", "
                            }
                        }
                    },
                    {
                        opcode: "translateNamed",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "translate [KEY], filling in named values [PAIRS]",
                        disableMonitor: true,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "greeting.hey" },
                            PAIRS: {
                                type: Scratch.ArgumentType.EXTENDABLE,
                                text: "[NAME] = [VALUE]",
                                arguments: {
                                    NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "name" },
                                    VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                                },
                                defaultInputs: 1,
                                minInputs: 0,
                                maxInputs: 20,
                                separator: ", "
                            }
                        }
                    }
                ]
            };
        }

        detectedBrowserLocale() {
            return (navigator.language || navigator.userLanguage || "en").toString();
        }

        activeLocaleTag() {
            return activeLocale;
        }

        setActiveLocale(args) {
            activeLocale = Cast.toString(args.LOCALE);
            ensureLocale(activeLocale);
        }

        setFallbackLocale(args) {
            fallbackLocale = Cast.toString(args.LOCALE);
            ensureLocale(fallbackLocale);
        }

        setMissingKeyTemplate(args) {
            missingKeyTemplate = Cast.toString(args.TEMPLATE);
        }

        getCatalogJson(args) {
            const locale = Cast.toString(args.LOCALE);
            return catalogs[locale] || {};
        }

        getAllCatalogsJson() {
            return catalogs;
        }

        loadCatalogJson(args) {
            const locale = Cast.toString(args.LOCALE);
            const parsed = args.CATALOG_JSON;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                catalogs[locale] = parsed;
            }
        }

        getCatalogKeys(args) {
            const locale = Cast.toString(args.LOCALE);
            return Object.keys(catalogs[locale] || {});
        }

        getCatalogValues(args) {
            const locale = Cast.toString(args.LOCALE);
            return Object.values(catalogs[locale] || {});
        }

        clearLocale(args) {
            const locale = Cast.toString(args.LOCALE);
            catalogs[locale] = Object.create(null);
        }

        clearAllCatalogs() {
            for (const key of Object.keys(catalogs)) delete catalogs[key];
        }

        setString(args) {
            const locale = Cast.toString(args.LOCALE);
            const catalog = ensureLocale(locale);
            catalog[Cast.toString(args.KEY)] = Cast.toString(args.VALUE);
        }

        deleteString(args) {
            const locale = Cast.toString(args.LOCALE);
            if (catalogs[locale]) delete catalogs[locale][Cast.toString(args.KEY)];
        }

        hasString(args) {
            const locale = Cast.toString(args.LOCALE);
            const catalog = catalogs[locale];
            return !!(catalog && Object.hasOwn(catalog, Cast.toString(args.KEY)));
        }

        translate(args) {
            const key = Cast.toString(args.KEY);
            const found = lookupRaw(key);
            return found === null ? missingKeyText(key) : found;
        }

        translateFormatted(args, util) {
            const key = Cast.toString(args.KEY);
            const found = lookupRaw(key);
            const template = found === null ? missingKeyText(key) : found;
            const values = util.extendableToArray(args, "ARGS", "VALUE");
            return formatPositional(template, values);
        }

        translateNamed(args, util) {
            const key = Cast.toString(args.KEY);
            const found = lookupRaw(key);
            const template = found === null ? missingKeyText(key) : found;
            const names = util.extendableToArray(args, "PAIRS", "NAME");
            const values = util.extendableToArray(args, "PAIRS", "VALUE");
            return formatNamed(template, names, values);
        }

        translateOrDefault(args) {
            const key = Cast.toString(args.KEY);
            const found = lookupRaw(key);
            return found === null ? Cast.toString(args.FALLBACK_TEXT) : found;
        }

        translatePlural(args) {
            const key = Cast.toString(args.KEY);
            const count = Cast.toNumber(args.COUNT);
            const suffix = count === 1 ? "one" : "other";
            const pluralKey = key + "." + suffix;

            let found = lookupRaw(pluralKey);
            if (found === null) found = lookupRaw(key);
            if (found === null) return missingKeyText(key);

            return formatPositional(found, [count]);
        }

        translateFormattedSimple(args) {
            const key = Cast.toString(args.KEY);
            const found = lookupRaw(key);
            const template = found === null ? missingKeyText(key) : found;

            let values;
            try {
                const parsed = JSON.parse(args.ARGS);
                values = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                values = [Cast.toString(args.ARGS)];
            }
            return formatPositional(template, values);
        }

        exampleCatalogGreetings() {
            return {
                "greeting.hello": "Hello!",
                "greeting.bye": "Goodbye, {0}!",
                "greeting.hey": "Hey, {name}!"
            };
        }

        exampleCatalogItems() {
            return {
                "cart.items.one": "{0} item in cart",
                "cart.items.other": "{0} items in cart"
            };
        }

        serialize() {
            return {
                flowlang: {
                    catalogs: catalogs,
                    activeLocale: activeLocale,
                    fallbackLocale: fallbackLocale,
                    missingKeyTemplate: missingKeyTemplate
                }
            };
        }

        deserialize(data) {
            if (!data || !data.flowlang) return;
            const saved = data.flowlang;
            for (const key of Object.keys(catalogs)) delete catalogs[key];
            if (saved.catalogs) {
                for (const locale of Object.keys(saved.catalogs)) {
                    catalogs[locale] = saved.catalogs[locale];
                }
            }
            if (saved.activeLocale) activeLocale = saved.activeLocale;
            if (saved.fallbackLocale) fallbackLocale = saved.fallbackLocale;
            if (saved.missingKeyTemplate) missingKeyTemplate = saved.missingKeyTemplate;
        }
    }

    Scratch.extensions.register(new AnessI18n());
})(Scratch);
