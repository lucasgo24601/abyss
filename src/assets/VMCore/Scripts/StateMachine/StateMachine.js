;(function (undefined) {
    "use strict"
    var ITransition = {
        fromState   : undefined,
        event       : undefined,
        toState     : undefined,
        listener    : undefined,
    }

    var StateTransitionFrom = function ($fromState, $event, $toState, $listener = undefined) {
        return { fromState: $fromState, event: $event, toState: $toState, listener: $listener };
    }

    /// State machine base prototype.
    var StateMachine = function ($initialState, $transitions = []) {
        this._currentState = $initialState;
        this._transitionSet = $transitions;
    };

    StateMachine.prototype = {
        AddTransitions  : function ($transitions) { $transitions.forEach ((tran) => this._transitionSet.push (tran)); },
        GetCurrentState : function () { return this._currentState; },
        IsValidEvent    : function ($event) { 
            for (let i = 0; i < this._transitionSet.length; i ++) {
                if (this._transitionSet [i].fromState === this._currentState && this._transitionSet [i].event === $event) return true;
            }
            return false;
        },
        IsFinalState    : function () {
            for (let i = 0; i < this._transitionSet.length; i ++) {
                if (this._transitionSet [i].fromState === this._currentState) return false;
            }
            return true;
        },
        Dispatch        : function ($event, ...$args) {
            return new Promise ((resolve, reject) => {    
                // delay execution to make it async
                setTimeout ((me) => {
                    let found = false;
    
                    // find transition
                    for (let i = 0; i < me._transitionSet.length; i ++) {
                        if (me._transitionSet [i].fromState === me._currentState && me._transitionSet [i].event === $event) {    
                            me._currentState = me._transitionSet [i].toState;
                            found = true;
                            if (me._transitionSet [i].listener) {
                                try {
                                    me._transitionSet [i].listener ($args);
                                    resolve ();
                                } catch (e) {
                                    reject ("Exception caught in callback" + e);
                                }
                            } else {
                                resolve ();
                            }
                            break;
                        }
                    }
    
                    // no such transition
                    if (!found) reject (`no such transition: from ${me._currentState.toString ()} event ${$event.toString ()}`);
                }, 1, this);
            });
        }
    }

    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define ([], function () {
            return { 
                ITransition         : ITransition,
                StateTransitionFrom : StateTransitionFrom,
                StateMachine        : StateMachine
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.ITransition         = ITransition;
        exports.StateTransitionFrom = StateTransitionFrom;
        exports.StateMachine        = StateMachine;
    }

    if (typeof window !== 'undefined') {
        window.ITransition          = ITransition;
        window.StateTransitionFrom  = StateTransitionFrom;
        window.StateMachine         = StateMachine;
    } else if (typeof global !== 'undefined') {
        global.ITransition          = ITransition;
        global.StateTransitionFrom  = StateTransitionFrom;
        global.StateMachine         = StateMachine;
    }
})();