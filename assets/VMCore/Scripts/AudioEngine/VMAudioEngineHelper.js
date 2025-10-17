(function (undefined) {
    "use strict";
    var VMAudioGroupType = {
        BASE: "base",
        FREESPIN: "freespin",
        PREFREESPIN: "prefreespin",
        JACKPOT: "jackpot",
        BONUS: "bonus",
        UI: "ui",
        BIGTEXT: "bigtext",
        RESPIN: "respin",
    };

    var VMAudioPlaybackProperties = {
        howl: undefined,
        audioKey: undefined,
        volume: undefined,
        loop: undefined,
        rate: undefined,
        currVolume: undefined,
        fadeFrom: undefined,
        fadeTo: undefined,
        fadeDuration: undefined,
        onCompleteFade: undefined,
        onCompletePlay: undefined,
        onCompleteStop: undefined,
        onEnd: undefined,
        singleton: undefined,
        startTime: undefined,
    };

    var VMAudioChannelObject = function ($channelType = VMAudioChannelType.BGM) {
        /// Channel master properties
        this._channelType = $channelType;
        this._channelRate = 1;
        this._channelVolume = 1;
        /// Audio clips properties
        this._currentHowl = undefined;
        this._currentAudioKey = "";
        this._playingAudioList = {};
        /// Flag
        this._mute = false;
        this._hasLogging = false;
        /// Function Bind

        this._defaultPlaybackProperties = {
            volume: this._channelVolume,
            rate: this._channelRate,
            loop: false,
            currVolume: 0,
            fadeFrom: 0,
            fadeTo: 1,
            fadeDuration: 0.25,
            onCompleteFade: () => {},
            onCompletePlay: () => {},
            onCompleteStop: () => {},
            onEnd: undefined,
            singleton: false,
            startTime: 0,
        };

        setInterval(() => {
            this.CollectGarbage();
        }, 10 * 1000);
    };

    VMAudioChannelObject.prototype = {
        ChannelType: function () {
            return this._channelType;
        },
        ChannelVolume: function () {
            return this._channelVolume;
        },
        ChannelRate: function () {
            return this._channelRate;
        },
        SetAudio: function ($howl, $key) {
            if ($howl !== undefined && $howl !== null) {
                this._currentHowl = $howl;
                this._currentAudioKey = $key;
            } else {
                this._currentHowl = undefined;
                if (this._hasLogging) console.log(`Attempt to play undefined ${$key} sound id...`);
            }

            return this;
        },
        SetEnableLogging: function ($value) {
            this._hasLogging = $value;
        },
        PlaySound: function ($inbound = {}) {
            let properties = { ...this._defaultPlaybackProperties, ...$inbound };
            if (this._currentHowl) {
                properties.audioKey = this._currentAudioKey;
                properties.howl = this._currentHowl;
                properties.howl.volume(this._mute ? 0 : properties.volume);
                properties.howl.rate(properties.rate);
                properties.howl.loop(properties.loop);

                if (properties.onEnd) {
                    properties.howl.off("end", properties.onEnd);
                    properties.howl.on("end", properties.onEnd);
                }

                if (properties.singleton && properties.howl.playing()) {
                    properties.howl.stop();
                }

                if ($inbound.startTime != undefined && $inbound.startTime != null) {
                    properties.howl.seek(properties.startTime);
                }

                var soundId = properties.howl.play();

                this._playingAudioList[properties.audioKey] = properties;

                if (TweenMax.isTweening(this._playingAudioList[properties.audioKey])) TweenMax.killTweensOf(this._playingAudioList[properties.audioKey]);

                TweenMax.fromTo(
                    properties,
                    0,
                    { currVolume: 0 },
                    {
                        currVolume: properties.volume,
                        onUpdate: () => {
                            properties.howl.volume(this._mute ? 0 : properties.currVolume);
                        },
                        onComplete: () => {
                            if (properties.onCompletePlay) properties.onCompletePlay();
                        },
                    }
                );

                return soundId;
            } else {
                if (properties.onCompletePlay) properties.onCompletePlay();
            }
        },
        StopSound: function ($inbound = {}) {
            let properties = { ...this._defaultPlaybackProperties, ...$inbound };
            if (this._currentHowl && this._currentHowl.playing()) {
                properties.currVolume = 0;
                properties.howl = this._currentHowl;
                properties.howl.stop().once("stop", properties.onCompleteStop);

                if (properties.onEnd) {
                    properties.howl.off("end", properties.onEnd);
                }
            } else {
                if (properties.onCompleteStop) properties.onCompleteStop();
            }
        },
        Fade: function ($inbound = {}) {
            let properties = { ...this._defaultPlaybackProperties, ...$inbound };
            if (this._currentHowl) {
                /// Fade in alway start from 0 unless specified, target volume will defaultly set to channel volume.
                properties.audioKey = this._currentAudioKey;
                properties.volume = this._channelVolume;
                properties.howl = this._currentHowl;

                if (this._playingAudioList[properties.audioKey] === undefined && properties.howl.state() == "loaded") {
                    properties.howl.rate(properties.rate);
                    properties.howl.loop(properties.loop);
                    properties.howl.play();

                    if (properties.onEnd) {
                        properties.howl.off("end", properties.onEnd);
                        properties.howl.on("end", properties.onEnd);
                    }
                } else {
                    if (!properties.howl.playing() && properties.howl.state() == "loaded") {
                        properties.howl.rate(properties.rate);
                        properties.howl.loop(properties.loop);
                        properties.howl.play();

                        if (properties.onEnd) {
                            properties.howl.off("end", properties.onEnd);
                            properties.howl.on("end", properties.onEnd);
                        }
                    }
                }

                if ($inbound.startTime != undefined && $inbound.startTime != null) {
                    properties.howl.seek(properties.startTime);
                }

                if (TweenMax.isTweening(this._playingAudioList[properties.audioKey])) TweenMax.killTweensOf(this._playingAudioList[properties.audioKey]);

                this._playingAudioList[properties.audioKey] = properties;
                TweenMax.fromTo(
                    properties,
                    properties.fadeDuration,
                    { currVolume: properties.fadeFrom },
                    {
                        currVolume: properties.fadeTo,
                        onUpdate: () => {
                            properties.howl.volume(this._mute ? 0 : properties.currVolume);
                        },
                        onComplete: () => {
                            if (properties.onCompleteFade) properties.onCompleteFade();
                        },
                    }
                );
            } else {
                if (properties.onCompleteFade) properties.onCompleteFade();
            }
        },
        //** Number of sound playing */
        IsPlaying: function () {
            let properties = this._defaultPlaybackProperties;
            if (this._currentHowl) {
                /// Fade in alway start from 0 unless specified, target volume will defaultly set to channel volume.
                properties.audioKey = this._currentAudioKey;
                properties.howl = this._currentHowl;

                return properties.howl.playing();
            } else {
                return false;
            }
        },
        Mute: function () {
            this.Logging(`Iterating audio data count ${Object.keys(this._playingAudioList).length} to mute.`);
            Object.keys(this._playingAudioList).forEach((x) => {
                this._playingAudioList[x].volume = this._playingAudioList[x].howl.volume();
                this._playingAudioList[x].howl.volume(0);
            });
            this._mute = true;
        },
        UnMute: function () {
            this.Logging(`Iterating audio data count ${Object.keys(this._playingAudioList).length} to unmute.`);
            Object.keys(this._playingAudioList).forEach((x) => {
                this._playingAudioList[x].howl.volume(this._playingAudioList[x].volume);
            });
            this._mute = false;
        },
        DuckChannel: function ($duckRatio = 0.1) {
            let keys = Object.keys(this._playingAudioList);
            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    TweenMax.killTweensOf(this._playingAudioList[keys[i]]);
                    this.SetAudio(this._playingAudioList[keys[i]].howl, this._playingAudioList[keys[i]].audioKey).Fade({
                        fadeFrom: this._playingAudioList[keys[i]].currVolume,
                        fadeTo: this._playingAudioList[keys[i]].volume * $duckRatio,
                        fadeDuration: 0.25,
                    });
                }
            }
        },
        UnDuckChannel: function () {
            let keys = Object.keys(this._playingAudioList);
            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    TweenMax.killTweensOf(this._playingAudioList[keys[i]]);
                    this.SetAudio(this._playingAudioList[keys[i]].howl, this._playingAudioList[keys[i]].audioKey).Fade({
                        fadeFrom: this._playingAudioList[keys[i]].currVolume,
                        fadeTo: 1,
                        fadeDuration: 0.25,
                    });
                }
            }
        },
        CollectGarbage: function () {
            if (Howler.ctx && Howler.ctx.state === "suspended") return;

            let keys = Object.keys(this._playingAudioList);
            let garbage = new Array();
            for (let i = 0; i < keys.length; i++) {
                if (!this._playingAudioList[keys[i]].howl.playing()) garbage.push(keys[i]);
            }

            if (garbage.length > 0) {
                this.Logging(`Channel ${this._channelType} clearing audio cache ${garbage.length} item(s).`);
                for (let i = 0; i < garbage.length; i++) {
                    delete this._playingAudioList[garbage[i]];
                }
            }
        },
        Logging: function ($log) {
            if (this._hasLogging) console.log($log);
        },
    };

    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return {
                VMAudioChannelObject: VMAudioChannelObject,
                VMAudioGroupType: VMAudioGroupType,
                VMAudioPlaybackProperties: VMAudioPlaybackProperties,
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== "undefined") {
        exports.VMAudioChannelObject = VMAudioChannelObject;
        exports.VMAudioGroupType = VMAudioGroupType;
        exports.VMAudioPlaybackProperties = VMAudioPlaybackProperties;
    }

    if (typeof window !== "undefined") {
        window.VMAudioChannelObject = VMAudioChannelObject;
        window.VMAudioGroupType = VMAudioGroupType;
        window.VMAudioPlaybackProperties = VMAudioPlaybackProperties;
    } else if (typeof global !== "undefined") {
        global.VMAudioChannelObject = VMAudioChannelObject;
        global.VMAudioGroupType = VMAudioGroupType;
        global.VMAudioPlaybackProperties = VMAudioPlaybackProperties;
    }
})();
