;(function (undefined) {
    "use strict"
    var IVMGameInstanceInfo = {
        GetUsername     : function () { return undefined; },
        GetSessionId    : function () { return undefined; },
        GetGameInfo     : function () { return undefined; },
        GetGameData     : function () { return undefined; },
        DoBackLobby     : function () {},
    }

    var IVMGameInfo = {
        protocol        : '',
        id              : '',
        thumbnailUrl    : '',
        commonPathUrl   : ''
    }
    
    var VMBaseGameInstance = (function () {
        var _gameInstance = {};
        var _listenerDictionary = {};
        var _gameCategory = window ['gameCat'] ? window ['gameCat'] : 'default';

        return {
            /// Return this game category.
            GetGameCategory     : function () { return _gameCategory; },
            /// Return this base game instance.
            GetInstance         : function () { return this; },
            /// Every game should have only 1 game instance (aka gamehelper in Unity).
            SetGameInstance     : function ($gameInstance) { _gameInstance = $gameInstance; },
            GetGameInstance     : function () { return _gameInstance; },
            /// All there listener that will react to base game event.
            RegisterListener    : function ($key, $listener) { 
                if (_listenerDictionary [$key] === undefined) 
                    _listenerDictionary [$key] = new Array ();

                var index = _listenerDictionary [$key].indexOf ($listener);
                if (index === -1) _listenerDictionary [$key].push ($listener); 
            },
            RemoveListener      : function ($key, $listener) { 
                if (_listenerDictionary [$key]) {
                    var index = _listenerDictionary [$key].indexOf ($listener);
                    if (index !== -1) _listenerDictionary [$key].splice (index, 1);
                }; 
            },
            RemoveAllListener   : function ($key) { if (_listenerDictionary [$key]) delete _listenerDictionary [$key]; },
            EmitEvent           : function ($key, $data) {
                if (_listenerDictionary [$key] && _listenerDictionary [$key].length > 0) {
                    for (let i = 0; i < _listenerDictionary [$key].length; i ++) {
                        if (_listenerDictionary [$key][i]) _listenerDictionary [$key][i] ($data);
                    }
                }
            }
        }
    })();

    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define ([], function () {
            return { 
                VMBaseGameInstance  : VMBaseGameInstance,
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.VMBaseGameInstance  = VMBaseGameInstance;
        exports.IVMGameInstanceInfo = IVMGameInstanceInfo;
        exports.IVMGameInfo         = IVMGameInfo;
    }

    if (typeof window !== 'undefined') {
        window.VMBaseGameInstance   = VMBaseGameInstance;
        window.IVMGameInstanceInfo  = IVMGameInstanceInfo;
        window.IVMGameInfo          = IVMGameInfo;
    } else if (typeof global !== 'undefined') {
        global.VMBaseGameInstance   = VMBaseGameInstance;
        global.IVMGameInstanceInfo  = IVMGameInstanceInfo;
        global.IVMGameInfo          = IVMGameInfo;
    }
})();