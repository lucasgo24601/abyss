let VMSlotGameModulePrototype = cc.Class ({
    extends     : VMBaseGamePrototype,
    properties  : {},

    ctor: function () {
        this._corePropertiesData = {},
        this._coreStateData      = {},
        this._coreResponseData   = {},
        this._coreEvents         = {},
        this._coreData           = {},
        this.CoreData = function get () {
            return { ...this._corePropertiesData, ...this._coreStateData, ...this._coreResponseData, ...this._coreEvents };
        }
    },

    InitializeBaseObserver: function ($properties, $state, $response, $event) {
        this.UpdateCoreData ($properties, $state, $response, $event);
    },

    UpdateCoreData: function ($properties, $state, $response, $event) {
        this.UpdateCorePropertiesData ($properties);
        this.UpdateCoreStatesData ($state);
        this.UpdateCoreResponseData ($response);
        this.UpdateCoreEvents ($event);
    },

    //#region [PRIVATE METHODS]
    UpdateCoreEvents: function ($events) { this._coreEvents = { ...this._coreEvents, ...$events }; },
    UpdateCoreResponseData: function ($responseData) { this._coreResponseData = { ...this._coreResponseData, ...$responseData }; },
    UpdateCoreStatesData: function ($statesData) { this._coreStateData = { ...this._coreStateData, ...$statesData }; },
    UpdateCorePropertiesData: function ($propertyData) { this._corePropertiesData = { ...this._corePropertiesData, ...$propertyData }; },
    //#endregion
    
    DestroySelf: function () {
        this.UnlistenAll ();      
        this.destroy ();
    },

    UnlistenAll: function () {
    },
});

if (typeof define === 'function' && define.amd) {
    define ([], function () {
        return { 
            VMSlotGameModulePrototype   : VMSlotGameModulePrototype 
        };
    });
}

if (typeof exports !== 'undefined') {
    exports.VMSlotGameModulePrototype   = VMSlotGameModulePrototype;
}
if (typeof window !== 'undefined') { 
    window.VMSlotGameModulePrototype    = VMSlotGameModulePrototype;
} else if (typeof global !== 'undefined') { 
    global.VMSlotGameModulePrototype    = VMSlotGameModulePrototype; 
}