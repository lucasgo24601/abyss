let VMBaseGameResponder = {
    OnResponseGameEventMessage : undefined 
};

let VMBaseGamePrototype = cc.Class ({
    extends     : cc.Component,
    properties  : {
        _responder  : undefined,
        _gameData   : undefined,
        GameData    : {
            visible : false,
            get     : function () { return this._gameData; }
        }
    },

    InitializeResponder: function ($responder) {
        this._responder = $responder;
    },

    InitializeBaseObserver: function ($data, ...$optionalParams) {
        this.UpdateCoreData ($data, ...$optionalParams);
        this.OnInitializeBaseObserver ();
    },

    UpdateCoreData: function (...$optionalParams) {
        this._gameData = { ...this._gameData, ...$optionalParams }
    },

    SendMessage: function ($eventId, $data) {
        this._responder.OnResponseGameEventMessage ({ ...{ eventId: $eventId }, ...$data });
    },

    OnInitializeBaseObserver: function () {}
});

if (typeof define === 'function' && define.amd) {
    define ([], function () {
        return { VMBaseGamePrototype  : VMBaseGamePrototype };
    });
}

if (typeof exports !== 'undefined') exports = VMBaseGamePrototype;
if (typeof window !== 'undefined') { window.VMBaseGamePrototype = VMBaseGamePrototype;
} else if (typeof global !== 'undefined') { global.VMBaseGamePrototype = VMBaseGamePrototype; }