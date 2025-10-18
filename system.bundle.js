(function () {
    "use strict";

    var baseUrl = location.href.split("#")[0].split("?")[0];

    function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
        // protocol-relative URL: //cdn.com/...
        if (relUrl.startsWith("//")) {
            return parentUrl.slice(0, parentUrl.indexOf(":") + 1) + relUrl;
        }

        // relative or root path
        if (relUrl.startsWith("./") || relUrl.startsWith("../") || relUrl.startsWith("/") || relUrl === "." || relUrl === "..") {
            const protocolEnd = parentUrl.indexOf(":") + 1;
            const hasHost = parentUrl[protocolEnd + 1] === "/";
            let pathname = parentUrl.slice(protocolEnd + (hasHost ? 2 : 0));
            pathname = pathname.slice(pathname.indexOf("/") + 1);
            const basePath = pathname.slice(0, pathname.lastIndexOf("/") + 1);
            const fullPath = basePath + (relUrl.endsWith("/") ? relUrl : relUrl + "/").replace(/\/$/, "");

            const segments = [];
            for (const part of fullPath.split("/")) {
                if (part === "..") {
                    segments.pop();
                } else if (part !== "." && part !== "") {
                    segments.push(part);
                }
            }

            return parentUrl.slice(0, parentUrl.length - pathname.length) + segments.join("/");
        }

        // return undefined if it's a bare specifier (e.g., "react")
    }

    function resolveAndComposePackages(packages, outPackages, baseUrl, parentMap, parentUrl) {
        for (const key in packages) {
            const lhs = resolveIfNotPlainOrUrl(key, baseUrl) || key;
            const rhs = packages[key];
            if (typeof rhs !== "string") continue;
            const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(rhs, baseUrl) || rhs, parentUrl);
            outPackages[lhs] = mapped;
        }
    }

    function resolveAndComposeImportMap(json, baseUrl, outMap) {
        resolveAndComposePackages(json.imports || {}, outMap.imports, baseUrl, outMap, null);
    }

    function getMatch(path, matchObj) {
        if (matchObj[path]) return path;
        let i = path.length;
        while ((i = path.lastIndexOf("/", i - 1)) !== -1) {
            const segment = path.slice(0, i + 1);
            if (segment in matchObj) return segment;
        }
    }

    function applyPackages(id, packages) {
        const pkgName = getMatch(id, packages);
        return pkgName ? packages[pkgName] + id.slice(pkgName.length) : undefined;
    }

    function resolveImportMap(importMap, id, parentUrl) {
        let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);

        while (scopeUrl) {
            const resolved = applyPackages(id, importMap.scopes[scopeUrl]);
            if (resolved) return resolved;
            scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf("/")), importMap.scopes);
        }

        return applyPackages(id, importMap.imports) || (id.includes(":") && id);
    }

    var REGISTRY = Symbol();

    function SystemJS() {
        this[REGISTRY] = {};
    }

    var systemJSPrototype$1 = SystemJS.prototype;

    systemJSPrototype$1.import = function (id, parentUrl) {
        return Promise.resolve(this.prepareImport())
            .then(() => this.resolve(id, parentUrl))
            .then((resolvedId) => {
                const load = getOrCreateLoad(this, resolvedId);
                return load.C || topLevelLoad(this, load);
            });
    };

    systemJSPrototype$1.createContext = function (parentId) {
        return {
            url: parentId,
            resolve: (id, parentUrl) => Promise.resolve(this.resolve(id, parentUrl || parentId)),
        };
    };

    var lastRegister;
    systemJSPrototype$1.register = function (deps, declare) {
        lastRegister = [deps, declare];
    };

    systemJSPrototype$1.getRegister = function () {
        return lastRegister;
    };

    function getOrCreateLoad(loader, id, firstParentUrl) {
        if (loader[REGISTRY][id]) return loader[REGISTRY][id];

        const importSetters = [];
        const ns = Object.create(null);

        const instantiatePromise = Promise.resolve()
            .then(() => loader.instantiate(id, firstParentUrl))
            .then(([deps, declare]) => {
                function _export(name, value) {
                    load.h = true;
                    let changed = false;

                    if (typeof name === "string") {
                        if (ns[name] !== value) {
                            ns[name] = value;
                            changed = true;
                        }
                    } else {
                        for (const key in name) {
                            const val = name[key];
                            if (ns[key] !== val) {
                                ns[key] = val;
                                changed = true;
                            }
                        }
                    }

                    if (changed) {
                        for (const setter of importSetters) {
                            if (setter) setter(ns);
                        }
                    }

                    return value;
                }

                const declared =
                    declare.length === 2
                        ? declare(_export, {
                              import: (importId) => loader.import(importId, id),
                              meta: loader.createContext(id),
                          })
                        : declare(_export);

                load.e = declared.execute || (() => {});
                return [deps, declared.setters || []];
            });

        const linkPromise = instantiatePromise.then(([deps, setters]) =>
            Promise.all(
                deps.map((dep, i) =>
                    Promise.resolve(loader.resolve(dep, id)).then((depId) => {
                        const depLoad = getOrCreateLoad(loader, depId, id);
                        return Promise.resolve(depLoad.I).then(() => {
                            const setter = setters[i];
                            if (setter) {
                                depLoad.i.push(setter);
                                if (depLoad.h || !depLoad.I) setter(depLoad.n);
                            }
                            return depLoad;
                        });
                    }),
                ),
            ).then((depLoads) => {
                load.d = depLoads;
            }),
        );

        const load = (loader[REGISTRY][id] = {
            id,
            i: importSetters,
            n: ns,
            I: instantiatePromise,
            L: linkPromise,
        });

        return load;
    }

    function instantiateAll(loader, load, parent, loaded) {
        if (loaded[load.id]) return Promise.resolve();
        loaded[load.id] = true;
        return Promise.resolve(load.L);
    }

    function topLevelLoad(loader, load) {
        return (load.C ||= instantiateAll(loader, load, load, {})
            .then(() => postOrderExec(loader, load, {}))
            .then(() => load.n));
    }

    function postOrderExec(loader, load, seen) {
        if (!load.e) {
            if (load.er) throw load.er;
            return load.E;
        }

        const exec = load.e;
        load.e = null;

        for (const dep of load.d) {
            postOrderExec(loader, dep, seen);
        }

        exec.call(Object.freeze(Object.create(null)));
    }

    self.System = new SystemJS();

    var importMapPromise = Promise.resolve();
    var importMap = { imports: {}, scopes: {}, depcache: {}, integrity: {} };
    var processFirst = true;

    systemJSPrototype$1.prepareImport = function (doProcessScripts) {
        if (processFirst || doProcessScripts) {
            processScripts();
            processFirst = false;
        }
        return importMapPromise;
    };

    function processScripts() {
        [].forEach.call(document.querySelectorAll("script"), function (script) {
            if (script.type === "systemjs-importmap") {
                script.sp = true;
                var fetchPromise = script.innerHTML;
                importMapPromise = extendImportMap(importMap, fetchPromise, script.src || baseUrl);
            }
        });
    }

    function extendImportMap(importMap, newMapText, newMapUrl) {
        resolveAndComposeImportMap(JSON.parse(newMapText), newMapUrl, importMap);
    }

    systemJSPrototype$1.instantiate = function (url, parent) {
        var loader = this;
        return window
            .fetch(url, {
                credentials: "same-origin",
                integrity: importMap.integrity[url],
            })
            .then(function (res) {
                return res.text().then(function (source) {
                    if (source.indexOf("//# sourceURL=") < 0) source += "\n//# sourceURL=" + url;
                    (0, eval)(source);
                    return loader.getRegister();
                });
            });
    };

    systemJSPrototype$1.resolve = function (id, parentUrl) {
        parentUrl = parentUrl || !true || baseUrl;
        return resolveImportMap(importMap, resolveIfNotPlainOrUrl(id, parentUrl) || id, parentUrl);
    };

    (function () {
        const System = self.System;
        const systemJSPrototype = System.constructor.prototype;
        System.registerRegistry = Object.create(null);

        const originalRegister = systemJSPrototype.register;
        systemJSPrototype.register = function (name, deps, declare) {
            if (typeof name !== "string") {
                return originalRegister.apply(this, arguments);
            }

            const define = [deps, declare];
            this.registerRegistry[name] = define;

            return originalRegister.apply(this, arguments);
        };

        const originalInstantiate = systemJSPrototype.instantiate;
        systemJSPrototype.instantiate = function (url, firstParentUrl) {
            const entry = this.registerRegistry[url];
            if (entry) {
                this.registerRegistry[url] = null;
                return entry;
            }
            return originalInstantiate.call(this, url, firstParentUrl);
        };
    })();
})();
