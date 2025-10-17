class RemoteResourceHandler {
    constructor() {
        this._shareResourceKeys = new Array();
        this._shareResources = new Array();

        this._hasDownloadStarted = false;
        this._templateConfigs = ["assets/templates.json"];
        this._currentCompletedResourceCount = 0;
    }

    AddResourceConfig($configPath) {
        this._templateConfigs.push($configPath);
    }

    InitializeResourceKey($keys) {
        this._shareResourceKeys = [...this._shareResourceKeys, ...$keys];
    }

    InitializeResourceData($basePath, $template, $cb) {
        // this.InitiateDownload ($basePath, 'assets/templates.json', $template, $cb);
        let basePath = $basePath;
        let template = $template;
        let cacheBuster = $cb;

        this._currentCompletedResourceCount = 0;
        for (let con = 0; con < this._templateConfigs.length; con++) {
            cc.assetManager.loadRemote(basePath.concat(this._templateConfigs[con], `?v=${cacheBuster}`), ($error, $data) => {
                if (!$error) {
                    let startIndex = $data.json.paths.length - ($data.json.paths.length - this._shareResources.length);
                    let version = $data.json.version;
                    this._shareResources = [...this._shareResources, ...$data.json.paths];

                    for (let i = startIndex; i < this._shareResources.length; i++) {
                        /// Ignore resources doesn't required by this game.
                        if (this._shareResourceKeys && this._shareResourceKeys.length > 0 && this._shareResourceKeys.indexOf(this._shareResources[i].key) < 0) {
                            this._currentCompletedResourceCount += 1;
                            continue;
                        }

                        this._shareResources[i].path = this._shareResources[i].path.replace("%s", template);

                        cc.assetManager.loadRemote(basePath.concat(this._shareResources[i].path, `?v=${version}`), ($error, $data) => {
                            if (!$error) {
                                //#region [base64 encoded images]
                                if ($data instanceof cc.TextAsset && $data.text.includes("data:image") && $data.text.includes(";base64")) {
                                    // Create an HTML image element
                                    let image = new Image();
                                    // Set the image source to the base64 string
                                    image.src = $data.text;

                                    // When the image is loaded
                                    image.onload = () => {
                                        // Create a canvas element
                                        let canvas = document.createElement("canvas");
                                        let ctx = canvas.getContext("2d");

                                        // Set canvas dimensions to image dimensions
                                        canvas.width = image.width;
                                        canvas.height = image.height;

                                        // Draw the image onto the canvas
                                        ctx.drawImage(image, 0, 0);

                                        // Convert canvas to cc.Texture2D
                                        let texture = new cc.Texture2D();
                                        texture.initWithElement(canvas);

                                        // Now you can use the texture as needed
                                        this._shareResources[i].resource = texture;
                                        this._currentCompletedResourceCount += 1;
                                    };
                                }
                                //#endregion
                                else {
                                    this._shareResources[i].resource = $data;
                                    this._currentCompletedResourceCount += 1;
                                }
                            } else {
                                console.error($error);
                            }
                        });
                    }
                } else {
                }
            });
        }
    }

    InitiateDownload($basePath, $template, $cb) {}

    GetResourceCount() {
        return this._shareResources.length;
    }

    GetCompletedResourceCount() {
        return this._currentCompletedResourceCount;
    }

    GetDownloadProgress() {
        return this._currentCompletedResourceCount / this._shareResources.length;
    }

    GetDownloadCompleted() {
        return this._currentCompletedResourceCount >= this._shareResources.length;
    }

    GetResource($key) {
        for (let i = 0; i < this._shareResources.length; i++) {
            if (this._shareResources[i].key === $key) {
                return this._shareResources[i].resource;
            }
        }

        return undefined;
    }

    GetPath($key) {
        for (let i = 0; i < this._shareResources.length; i++) {
            if (this._shareResources[i].key === $key) return this._shareResources[i].path;
        }

        return undefined;
    }
}

var remoteResourceHandler = new RemoteResourceHandler();
var remoteResourceHandlerDeferred = new RemoteResourceHandler();
