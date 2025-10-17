;(function (undefined) {
    "use strict"

    const _decoder = {
        decode : function ($input) {
            let key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        
            let output = "";
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;
        
            $input = $input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
            while (i < $input.length) {        
                enc1 = key.indexOf ($input.charAt (i++));
                enc2 = key.indexOf ($input.charAt (i++));
                enc3 = key.indexOf ($input.charAt (i++));
                enc4 = key.indexOf ($input.charAt (i++));
        
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
        
                output = output + String.fromCharCode (chr1);        
                if (enc3 != 64) output = output + String.fromCharCode (chr2);        
                if (enc4 != 64) output = output + String.fromCharCode (chr3);        
            }
        
            output = _decoder._utf8_decode (output);
            return output;
        },
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;
        
            while (i < utftext.length) {        
                c = utftext.charCodeAt (i);
        
                if (c < 128) {
                    string += String.fromCharCode (c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt (i + 1);
                    string += String.fromCharCode (((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt (i + 1);
                    var c3 = utftext.charCodeAt (i + 2);
                    string += String.fromCharCode (((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            
            return string;
        }
    }

    const DEFAULT_INTERVAL = 50;
    const DEFAULT_TIMEOUT = 500000;
    const _promise = {
        WaitForSeconds      : ($t) => { return new Promise (resolve => setTimeout (resolve, $t * 1000)) },
        WaitForCondition    : function ($predicate, $timeout, $interval) {
            var timerInterval = $interval || DEFAULT_INTERVAL;
            var timerTimeout = $timeout * 1000 || DEFAULT_TIMEOUT;

            return new Promise ((resolve, reject) => {
                var clearTimers = () => {
                    clearTimeout (timeoutTimer);
                    clearInterval (timer);
                };

                var doStep = () => {
                    var result;

                    try {
                        result = $predicate ();
                        if (result) {
                            clearTimers ();
                            resolve (result);
                        } else {
                            timer = setTimeout (doStep, timerInterval);
                        }
                    } catch (e) {
                        clearTimers ();
                        reject (e);
                    }
                };

                var timer = setTimeout (doStep, timerInterval);
                var timeoutTimer = setTimeout (function onTimeout () {
                    clearTimers ();
                    reject (new Error ('Timed out after waiting for ' + timerTimeout + ' ms'));
                }, timerTimeout);
            })
        }
    }

    var CommonUtils = function () {};
    var ArrayUtils = function () {};
    var AtlasUtils = function () {};

    CommonUtils.prototype = {
        Decode              : _decoder.decode,
        NumberWithCommas    : (x) => { return x.toString ().replace (/\B(?=(\d{3})+(?!\d))/g, ","); },
        ConvertDeg2Rad      : ($degree) => { return $degree * (Math.PI / 180); },        
        ConvertRad2Deg      : ($radian) => { return $radian * (180 / Math.PI); },        
        Clamp               : ($number, $min, $max) => { return Math.min (Math.max ($number, $min), $max); },        
        ShuffleArray        : ($array) => {
            for (let i = $array.length - 1; i > 0; i--) {
                const j = Math.floor (Math.random () * (i + 1));
                [$array [i], $array [j]] = [$array [j], $array [i]];
            }
        },
        GetQueryString      : ($value) => {
            var href = window.location.href;
            var reg = new RegExp ('[?&]' + $value + '=([^&#]*)', 'i');
            var output = reg.exec (href);
            return output ? output [1]: undefined;
        },
        IsObject                        : ($target) => { return $target instanceof Object; },
        GetNumberFormat                 : ($num) => { return $num.toString ().replace (/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); },
        // GetNumberFormatWithoutDecimal   : ($num, $decimal = 0) => { return (Math.trunc((Math.round($num * 1000) / 1000) * 10 ** $decimal) / 10 ** $decimal).toFixed($decimal).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); },        
        //** Updated on 17th April 2025, add Number.EPSILON (very small floating number) to fix rounding offset */
        GetNumberFormatWithoutDecimal: (t, e = 0) => (Math.round((Number(t) + Number.EPSILON) * 10 ** e) / 10 ** e).toFixed(e).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
        GetNumberWithoutDecimal         : ($num, $decimal = 0) => { return (Math.trunc((Math.round($num * 1000) / 1000) * 10 ** $decimal) / 10 ** $decimal).toFixed($decimal); },        
        GetCurrencyFormat               : ($currency, $num) => { return $currency + $num.toFixed (2).replace (/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); },
        GetFormatedDateTime             : ($timestamp, $format) => { return moment.unix ($timestamp).format ($format); },
        ParseIntArray                   : ($target, $firstSplit = ",") => {
            let final = [];
            let set = $target.split ($firstSplit);
            for (let i = 0; i < set.length; i ++) {
                final.push (parseInt (set [i]));
            }

            return final;
        },
        ParseInt2DArray                 : ($target, $firstSplit = "|", $secondSplit = ",") => {
            let final = [];
            let set = $target.split ($firstSplit);
            let id = [];
            let pArray = []
            for (let i = 0; i < set.length; i ++) {
                pArray = set [i].split ($secondSplit);
                id = [];
                for (let j = 0; j < pArray.length; j ++) {
                    if (pArray [j] != "") id.push (parseInt (pArray [j]));
                }
                if (id.length > 0) final.push (id);
            }

            return final;
        },

        ParseIntWaysArray($target, $firstSplit = "]", $secondSplit = "[") 
        {
            // this to split every win symbol
            let set = $target.split ($firstSplit);
            let pArray = []
            let wArray = [];
            let posArray = [];
            let allPosArray = [];
            let final = [];
            for (let i = 0; i < set.length; i ++) {
                if(set[i]!="")
                { 
                    pArray = [];
                    posArray = [];
                    wArray = [];
                    allPosArray = [];
                    // this to split between coins win,symbol and positions
                    pArray = set [i].split ($secondSplit);
                    
                    wArray = pArray[0].split(",");
                    for(let j=0;j<wArray.length;j++)
                    {
                        if(wArray[j]=="")
                        {
                            wArray.splice(j,1);
                            j-=1;
                        }
                        else
                        {
                            wArray[j] = parseInt(wArray[j]);
                        }
                    }

                    posArray = pArray [1].split("|");
                    allPosArray = new Array(posArray.length);
                    for(let j=0;j<posArray.length;j++)
                    {
                        allPosArray[j] = posArray[j].split(",");

                        for(let k=0;k<allPosArray[j].length;k++)
                        {
                            allPosArray[j][k] = parseInt(allPosArray[j][k]);
                        }
                    }
                    final.push([wArray,allPosArray]);
                }
            }
            return final;
        },
        ParseFloatArray                   : ($target, $firstSplit = ",") => {
            let final = [];
            let set = $target.split ($firstSplit);
            for (let i = 0; i < set.length; i ++) {
                final.push (parseFloat (set [i]));
            }

            return final;
        },
        ParseFloat2DArray                 : ($target, $firstSplit = "|", $secondSplit = ",") => {
            let final = [];
            let set = $target.split ($firstSplit);
            let id = [];
            let pArray = []
            for (let i = 0; i < set.length; i ++) {
                pArray = set [i].split ($secondSplit);
                id = [];
                for (let j = 0; j < pArray.length; j ++) {
                    if (pArray [j] != "") id.push (parseFloat (pArray [j]));
                }
                if (id.length > 0) final.push (id);
            }

            return final;
        },

        ParseFloatWaysArray($target, $firstSplit = "]", $secondSplit = "[") 
        {
            // this to split every win symbol
            let set = $target.split ($firstSplit);
            let pArray = []
            let wArray = [];
            let posArray = [];
            let allPosArray = [];
            let final = [];
            for (let i = 0; i < set.length; i ++) {
                if(set[i]!="")
                { 
                    pArray = [];
                    posArray = [];
                    wArray = [];
                    allPosArray = [];
                    // this to split between coins win,symbol and positions
                    pArray = set [i].split ($secondSplit);
                    
                    wArray = pArray[0].split(",");
                    for(let j=0;j<wArray.length;j++)
                    {
                        if(wArray[j]=="")
                        {
                            wArray.splice(j,1);
                            j-=1;
                        }
                        else
                        {
                            wArray[j] = parseFloat(wArray[j]);
                        }
                    }

                    posArray = pArray [1].split("|");
                    allPosArray = new Array(posArray.length);
                    for(let j=0;j<posArray.length;j++)
                    {
                        allPosArray[j] = posArray[j].split(",");

                        for(let k=0;k<allPosArray[j].length;k++)
                        {
                            allPosArray[j][k] = parseFloat(allPosArray[j][k]);
                        }
                    }
                    final.push([wArray,allPosArray]);
                }
            }
            return final;
        },
        CreateQuadData                  : (width, height) => {
            let data = new Uint8Array (width * height * 4);
            for (let i = 0; i < width; i ++) {
                for (let n = 0; n < height; n ++) {                    
                    data [i * width * 4 + n * 4 + 0] = 255; //R                    
                    data [i * width * 4 + n * 4 + 1] = 255; //G                    
                    data [i * width * 4 + n * 4 + 2] = 255; //B                    
                    data [i * width * 4 + n * 4 + 3] = 255; //A
                }
            }
            return data;
        },
        CreateCircleData                : (radius) => {
            
        },
        GetSimplifiedString             : (target, maxChar) => {
			return target.Length < maxChar ? target : target.substring (0, maxChar).concat ('...');
        },
        IsEquivalent                    : (a, b) => {
            var aProps = Object.getOwnPropertyNames (a);
            var bProps = Object.getOwnPropertyNames (b);

            if (aProps.length != bProps.length) {
                return false;
            }
        
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps [i];
                if (a [propName] !== b [propName]) {
                    return false;
                }
            }
        
            return true;
        }
    }

    ArrayUtils.prototype = {
        GetRandomElementFromArrays  : ($array) => {
            return $array [Math.floor (Math.random () * $array.length)];
        },
        GetArrayFromExcludes        : ($array, $exclude) => {
            let outputArray = [...$array];
            for (let i = 0; i < $exclude.length; i++) {
                let index = outputArray.indexOf ($exclude [i]);
                if (index > -1) outputArray.splice (index, 1);
            }
        
            return outputArray;
        },
        GetArrayWithoutDuplicates   : ($array) => {
            var output = $array.concat ();
            for (var i = 0; i < output.length; ++i) {
                for (var j = i + 1; j < output.length; ++j) {
                    if (output [i] === output [j]) output.splice (j--, 1);
                }
            }
        
            return output;
        }
    }

    AtlasUtils.prototype = {
        ResolveAtlasRect    : function ($data) {
            let numbers = $data.match (/\d+/g).map (Number);
            return cc.rect (numbers [0], numbers [1], numbers [2],numbers [3])
        },
        
        ResolveAtlasV2      : function ($data) {
            let numbers = $data.match (/\d+/g).map (Number);
            return cc.v2 (numbers [0], numbers [1])
        },
        
        ResolveAtlasSize    : function ($data) {
            let numbers = $data.match (/\d+/g).map (Number);
            return cc.size (numbers [0], numbers [1])
        },
    
        ResolveSpriteFromAtlas: function ($atlasTex, $atlasData, $spriteKey) {
            let atlasData = $atlasData ['frames'][$spriteKey];
            let atlasSprite = new cc.SpriteFrame ($atlasTex, this.ResolveAtlasRect (atlasData.frame), atlasData.rotated, this.ResolveAtlasV2 (atlasData.offset), this.ResolveAtlasSize (atlasData.sourceSize));       
            return atlasSprite;
        },
    }

    var VMCommonUtils = new CommonUtils ();
    var VMArrayUtils = new ArrayUtils ();
    var VMAtlasUtils = new AtlasUtils ();
    
    // _global = (function () { return this || (0, eval)('this'); } ());
    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define ([], function () {
            return { 
                VMCommonUtils       : VMCommonUtils,
                VMArrayUtils        : VMArrayUtils,
                VMAtlasUtils        : VMAtlasUtils,
                WaitForSeconds      : _promise.WaitForSeconds,
                WaitForCondition    : _promise.WaitForCondition
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.VMCommonUtils       = VMCommonUtils;
        exports.VMArrayUtils        = VMArrayUtils;
        exports.VMAtlasUtils        = VMAtlasUtils;
        exports.WaitForSeconds      = _promise.WaitForSeconds;
        exports.WaitForCondition    = _promise.WaitForCondition;
    }

    if (typeof window !== 'undefined') {
        window.VMCommonUtils    = VMCommonUtils;
        window.VMArrayUtils     = VMArrayUtils;
        window.VMAtlasUtils     = VMAtlasUtils;
        window.WaitForSeconds   = _promise.WaitForSeconds;
        window.WaitForCondition = _promise.WaitForCondition;
    } else if (typeof global !== 'undefined') {
        global.VMCommonUtils    = VMCommonUtils;
        global.VMArrayUtils     = VMArrayUtils,
        global.WaitForSeconds   = _promise.WaitForSeconds;
        global.WaitForCondition = _promise.WaitForCondition;
    }
})();