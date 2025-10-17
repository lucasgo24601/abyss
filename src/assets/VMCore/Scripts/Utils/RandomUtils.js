;(function (undefined) {
    "use strict"
    
    var WeightedRandomUtils = function ($array, $weight) {
        this._values = $array;
        this._weights = $weight;
        return this;
    };

    var RandomUtils = function () {};
    RandomUtils._seed = Math.floor (new Date ().getTime () / 1000.0);
    RandomUtils.SetSeed = ($value) => { RandomUtils._seed = $value; };
    RandomUtils.GetSeed = () => { return RandomUtils._seed; };
    RandomUtils.Random = () => { 
        var x = Math.sin (RandomUtils._seed ++) * 10000;
        return x - Math.floor (x);
    };
    RandomUtils.RandomNumber = ($min, $max) => { return (RandomUtils.Random () * ($max - $min)) + $min; };
    RandomUtils.RandomNumberInt = ($min, $max) => { return Math.floor (RandomUtils.RandomNumber ($min, $max)); };

    WeightedRandomUtils.prototype = {
        GetWeightedArray : function ($count = 100) {
            let output = [];
            for (var i = 0; i < this._weights.length; i++) {
                var multiples = this._weights [i] * $count;
                for (var j = 0; j < multiples; j++) {
                    output.push (this._values [i]);
                }
            }
    
            return output;
        }
    }

    // var VMWeightedRandom = new WeightedRandomUtils ();

    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define ([], function () {
            return { 
                VMRandom            : RandomUtils,
                VMWeightedRandom    : WeightedRandomUtils
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.VMRandom            = RandomUtils;
        exports.VMWeightedRandom    = WeightedRandomUtils;
    }

    if (typeof window !== 'undefined') {
        window.VMRandom         = RandomUtils;
        window.VMWeightedRandom = WeightedRandomUtils;
    } else if (typeof global !== 'undefined') {
        global.VMRandom         = RandomUtils;
        global.VMWeightedRandom = WeightedRandomUtils;
    }
})();