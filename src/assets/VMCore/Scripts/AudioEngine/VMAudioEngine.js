;(function (undefined) {
    "use strict"
    
    var VMAudioEngine = function () {
        this._isLogging     = false;
        this._isInited      = false;
        this._audioConfig   = {};
        this._channel       = {};
        this._howlerBank    = {};
        this._baseUrl       = '';
    };

    var VMAudioChannelType = {
        BGM         : 'bgm',
        SFX_GAME    : 'sfx-game',
        SFX_UI      : 'sfx-ui',
    }

    VMAudioEngine.prototype = {
        LoadGroup       : function ($groupKey, $remote = false) {
            if (this._audioConfig) {
                let group = Object.keys (this._audioConfig).find (x => x == $groupKey);
                if (group && this._audioConfig [group] && this._audioConfig [group].length > 0) {
                    this._audioConfig [group].forEach ((element) => {
                        this._howlerBank [element.key] = new Howl ({ 
                            src: $remote ? element.nativeUrl : this._baseUrl.concat (element.nativeUrl), 
                            preload: true });
                    });
                }
            }
        },
        UnloadGroup     : function ($groupKey) {
            if (this._audioConfig) {
                let group = Object.keys (this._audioConfig).find (x => x == $groupKey);
                if (group && this._audioConfig [group] && this._audioConfig [group].length > 0) {
                    this._audioConfig [group].forEach ((element) => {
                        this._howlerBank [element.key].unload ();
                        this._howlerBank [element.key] = undefined;
                    });
                }
            }
        },
        GetAudioChannel : function ($on, $audio) {
            this.ResumeHowlerCtx ();
            if (this._channel [$on] == undefined) this.AddAudioChannel ($on);
            return this._channel [$on].SetAudio (this._howlerBank [$audio], $audio);
        },
        AddAudioChannel : function ($channelType) {
            if (Object.keys (this._channel).find (x => x == $channelType)) return;
            this._channel [$channelType] = new VMAudioChannelObject ($channelType);
            this._channel [$channelType].SetEnableLogging (this._isLogging);
        },
        RemoveAudioChannelByType : function ($channelType) {
            let found = Object.keys (this._channel).find (x => this._channel [x].ChannelType === $channelType);
            if (found) this.RemoveAudioChannel (found);
        },
        RemoveAudioChannelByName : function ($name) {
            let found = Object.keys (this._channel).find (x => $name);
            if (found) this.RemoveAudioChannel (found);
        },
        MuteCategory        : function ($channelType) {
            if (this._channel [$channelType]) this._channel [$channelType].Mute ();
        },
        UnMuteCategory      : function ($channelType) {
            if (this._channel [$channelType]) this._channel [$channelType].UnMute ();
        },
        DuckAudioChannel    : function ($channelType, $duckRatio = 0.1) {
            if (this._channel [$channelType]) this._channel [$channelType].DuckChannel ($duckRatio);
        },
        UnDuckAudioChannel  : function ($channelType) {
            if (this._channel [$channelType]) this._channel [$channelType].UnDuckChannel ();
        },
        RemoveAudioChannel  : function ($name) {
            delete this._channel [$name];
        },
        ResumeHowlerCtx     : function () {
            if (Howler.usingWebAudio) {
                /// AudioContextState = "suspended" | "running" | "closed";
                if (Howler.ctx && Howler.ctx.state === 'suspended') {
                    Howler.ctx.resume ();
                }
            }
        }
    }

    var VMAudioEngineInstance = (function () {
        var instance;
     
        function createInstance () {
            var object = new VMAudioEngine ();
            return object;
        }
     
        return {
            get Instance () {
                if (!instance) {
                    instance = createInstance ();
                }
                return instance;
            },

            SetLogging      : function ($logging) {
                this.Instance._isLogging = $logging;
            },
            Initialize      : function ($audioConfig, $baseDir) {
                this.Instance._audioConfig = $audioConfig;
                this.Instance._baseUrl = $baseDir;

                this.Instance.AddAudioChannel (VMAudioChannelType.BGM);
                this.Instance.AddAudioChannel (VMAudioChannelType.SFX_GAME);
                this.Instance.AddAudioChannel (VMAudioChannelType.SFX_UI);

                window.document.addEventListener ("visibilitychange", () => {
                    if (!document.hidden) {
                        /// Resume !!!
                        if (Howler.ctx) Howler.ctx.resume ().then (() => { 
                            this.SetGlobalMute (document.hidden);

                            if (this._isInited == false) {
                                this._isInited = true;
                            }
                        }).catch (() => { });
                    } else {
                        /// Suspend !!!
                        if (Howler.ctx) Howler.ctx.suspend ().then (() => { 
                            this.SetGlobalMute (document.hidden);
                        }).catch (() => { });
                    }
                }, false);
            },
            ReplaceConfig   : function ($audioConfig) { this.Instance._audioConfig = $audioConfig; },
            SetGlobalMute   : function ($value) { Howler.mute ($value); },
            SetGlobalVolume : function ($value) { Howler.volume ($value); },
            UnloadAudio     : function () { Howler.unload (); }
        };
    })();

    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define ([], function () {
            return { 
                VMAudioEngine       : VMAudioEngineInstance,
                VMAudioChannelType  : VMAudioChannelType,
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.VMAudioEngine       = VMAudioEngineInstance;
        exports.VMAudioChannelType  = VMAudioChannelType;
    }

    if (typeof window !== 'undefined') {
        window.VMAudioEngine        = VMAudioEngineInstance;
        window.VMAudioChannelType   = VMAudioChannelType;
    } else if (typeof global !== 'undefined') {
        global.VMAudioEngine        = VMAudioEngineInstance;
        global.VMAudioChannelType   = VMAudioChannelType;
    }
})();