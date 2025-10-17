(function (undefined) {
    "use strict";
    var _global;
    const HttpMethods = {
        Post: "POST",
        Get: "GET",
    };

    const HttpMethodsGet = function () {
        return HttpMethods.Get;
    };
    const HttpMethodsPost = function () {
        return HttpMethods.Post;
    };

    const AppendHttpProtocol = function ($url) {
        let prefix = "http";
        var resultUrl = $url;
        if (resultUrl.search(prefix) == -1) {
            var resultUrl = "http://".concat(resultUrl);
        }

        return resultUrl;
    };

    const Get = function ($url, $log = false, $skipLocalStatusCodeChecking = false) {
        // var request = cc.loader.getXMLHttpRequest ();
        var request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            request.startPerformance = performance.now();
            request.onreadystatechange = () => {
                ResolveRequest(request, resolve, reject, $log, $skipLocalStatusCodeChecking);
            };

            request.ontimeout = () => {
                EmitUpdateLatencyEvent(request, -1);
            }

            request.onerror = () => {
                console.log(request);
                EmitUpdateLatencyEvent(request, -1);
            };

            request.open("GET", $url, true);
            request.send();
        });
    };

    const Post = function ($url, params, $ticket = null, $log = false, $skipLocalStatusCodeChecking = false) {
        var request = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            request.startPerformance = performance.now();
            request.onreadystatechange = () => {
                ResolveRequest(request, resolve, reject, $log, $skipLocalStatusCodeChecking);
            };

            request.ontimeout = () => {
                EmitUpdateLatencyEvent(request, -1);
            }

            request.onerror = () => {
                console.log(request);
                EmitUpdateLatencyEvent(request, -1);
            };

            request.timeout = 120000;
            request.open("POST", $url, true);
            request.setRequestHeader("Accept", "*/*");
            request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            request.setRequestHeader("Datatype", "json");
            if($ticket) request.setRequestHeader ("Authorization","Bearer " + $ticket);
            request.send(params);
        });
    };

    const ResolveRequest = function ($request, $resolve, $reject, $log = false, $skipLocalStatusCodeChecking = false) {
        switch ($request.readyState) {
            case 4:
                let jsonObject = undefined;
                let statusCode = undefined;

                try {
                    jsonObject = JSON.parse($request.responseText);
                } catch (err) {
                    $reject({
                        httpStatus: $request.status,
                        response: jsonObject,
                    });
                }

                if ($log) {
                    console.log(`Request url : ${$request.responseURL}`);
                    console.log(`Request status : ${$request.status}`);
                    console.log(`Request response : ${$request.responseText}`);
                }

                if ($request.status >= 200 && $request.status < 300) {
                    if ($skipLocalStatusCodeChecking) {
                        $resolve({
                            httpStatus: statusCode,
                            response: jsonObject,
                        });
                        
                        EmitUpdateLatencyEvent($request);
                        return;
                    } else {
                        let statusKey = Object.keys(jsonObject).find((x) => x.toLowerCase() === "status");
                        if (statusKey !== undefined) {
                            statusCode = jsonObject[statusKey];
                            if (statusCode >= 200 && statusCode < 300) {
                                $resolve({
                                    httpStatus: statusCode,
                                    response: jsonObject,
                                });

                                EmitUpdateLatencyEvent($request);
                                return;
                            }
                        }
                    }
                }

                $reject({
                    httpStatus: statusCode !== undefined ? statusCode : $request.status ? $request.status : -1,
                    response: jsonObject,
                });

                EmitUpdateLatencyEvent($request, -1);
                break;
        }
    };

    const EmitUpdateLatencyEvent = function ($xmlHttpRequest, $ms = null) {
        if (!$xmlHttpRequest) return;
        if (!$xmlHttpRequest.startPerformance) return;

        try {
            let ms = $ms;
            if ($ms == null) {
                $xmlHttpRequest.endPerformance = performance.now();
                ms = $xmlHttpRequest.endPerformance - $xmlHttpRequest.startPerformance;
            }
            const event = new CustomEvent('network-LatencyUpdate', {
                detail: {
                    url: $xmlHttpRequest.responseURL,
                    latency: ms,
                }
            });
            dispatchEvent(event);
        }
        catch (err) {
            console.error("Failed to update latency");
        }
    }

    var BaseConnectorPrototype = function ($baseUrl) {
        this._baseUrl = $baseUrl;
    };
    BaseConnectorPrototype.prototype = {
        HttpMethodsGet: HttpMethodsGet,
        HttpMethodsPost: HttpMethodsPost,
        GetUrl: function () {
            return "";
        },
        GetRequestType: function () {
            return this.HttpMethodsPost();
        },
        CreatePostRequestParameters: function () {
            return "";
        },
        AppendUrlQuerries: function () {
            return "";
        },
        GetIsSkipLocalStatusCode: function () {
            return false;
        },
        Connect: function ($ticket = null, $hasLog = false) {
            let requestUrl = AppendHttpProtocol(this._baseUrl.concat(this.GetUrl()));
            let requestType = this.GetRequestType();

            if (this.AppendUrlQuerries() && this.AppendUrlQuerries() !== "") {
                // Append url querries into request url
                requestUrl.concat(this.AppendUrlQuerries());
            }

            if (requestType === HttpMethods.Get) {
                // Perform GET request
                return Get(requestUrl, $hasLog, this.GetIsSkipLocalStatusCode());
            } else if (requestType === HttpMethods.Post) {
                // Perform POST request
                return Post(requestUrl, this.CreatePostRequestParameters(), $ticket, $hasLog, this.GetIsSkipLocalStatusCode());
            } else {
                // Invalid request type
            }
        },
    };

    _global = (function () {
        return this || (0, eval)("this");
    })();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = BaseConnectorPrototype;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return BaseConnectorPrototype;
        });
    } else {
        !("BaseConnectorPrototype" in _global) && (_global.BaseConnectorPrototype = BaseConnectorPrototype);
    }
})();
