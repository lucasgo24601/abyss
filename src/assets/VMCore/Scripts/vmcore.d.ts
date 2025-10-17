declare class BaseConnectorPrototype {
    constructor($baseUrl: string): BaseConnectorPrototype;
    protected GetUrl(): string;
    protected GetRequestType(): string;
    protected CreatePostRequestParameters(): string;
    protected AppendUrlQuerries(): string;
    public Connect($ticket: string = null, $hasLog: boolean = false): Promise<any>;

    protected HttpMethodsGet(): string;
    protected HttpMethodsPost(): string;
}

interface VMCommonUtils {
    Decode($input: any): string;
    NumberWithCommas($x: number): string;
    ConvertDeg2Rad($degree: number): number;
    ConvertRad2Deg($radian: number): number;
    Clamp($number: number, $min: number, $max: number): number;
    ShuffleArray($array: any);
    GetQueryString($value: string): string;

    GetNumberFormat($num: number): string;
    GetNumberFormatWithoutDecimal($num: number, $decimal: number = 0): string;
    GetNumberWithoutDecimal($num: number, $decimal: number = 0): string;
    GetCurrencyFormat($currency: string, $num: number): string;
    GetFormatedDateTime($timestamp: number, $format: string): string;

    ParseIntArray($target: string, $firstSplit: string = ","): number[];
    ParseInt2DArray($target: string, $firstSplit: string = "|", $secondSplit: string = ","): number[][];
    ParseIntWaysArray($target: string, $firstSplit: string = "]", $secondSplit: string = "["): any[];
    ParseFloatArray($target: string, $firstSplit: string = ","): number[];
    ParseFloat2DArray($target: string, $firstSplit: string = "|", $secondSplit: string = ","): number[][];
    ParseFloatWaysArray($target: string, $firstSplit: string = "]", $secondSplit: string = "["): any[];
    IsObject($target): boolean;


    CreateQuadData($width: number, $height: number): any;
    GetSimplifiedString($target: string, $maxChar: number): string;
    IsEquivalent($a: any, $b: any): boolean;
}

interface VMArrayUtils {
    GetRandomElementFromArrays<T>($array: T[]): T;
    GetArrayFromExcludes<T>($array: T[], $exclude: T[]): T[];
    GetArrayWithoutDuplicates<T>($array: T[]): T[];
}

interface VMAtlasUtils {
    public static ResolveAtlasRect(): cc.Rect,
    public static ResolveAtlasV2(): cc.Vec2,
    public static ResolveAtlasSize(): cc.Size,
    public static ResolveSpriteFromAtlas($atlasTex: any, $atlasData: any, $spriteKey: string): cc.SpriteFrame,
}

declare let VMCommonUtils: VMCommonUtils;
declare let VMArrayUtils: VMArrayUtils;
declare let VMAtlasUtils: VMAtlasUtils;
declare let WaitForSeconds: ($t: number) => Promise<any>;
declare let WaitForCondition: <T>($predicate: () => T, $timeout?: number, $interval?: number) => Promise<any>;

declare class VMRandom {
    public static SetSeed($value: number);
    public static GetSeed(): number;
    public static Random = () => number;
    public static RandomNumber = ($min: number, $max: number) => number;
    public static RandomNumberInt = ($min: number, $max: number) => number;
}

declare class VMWeightedRandom<T = any[]> {
    constructor($array: T[], $weight: number[]): VMWeightedRandom;
    public GetWeightedArray($count: number = 100): T[];
}

declare interface ITransition<STATE, EVENT> {
    fromState: STATE;
    event: EVENT;
    toState: STATE;
    listener?: (...args: any[]) => void | Promise<void>;
}

declare function StateTransitionFrom<STATE, EVENT>(fromState: STATE, event: EVENT, toState: STATE, listener?: (...args: any[]) => void | Promise<void>)
    : ITransition<STATE, EVENT>;

declare class StateMachine<STATE, EVENT> {
    constructor($initialState: STATE, $transitions: Array<ITransition<STATE, EVENT>> = []);
    public AddTransitions($transitions: Array<ITransition<STATE, EVENT>>): void;
    public GetCurrentState(): STATE;
    public IsValidEvent($event: EVENT): boolean;
    public IsFinalState(): boolean;
    public Dispatch(event: EVENT, ...args: any[]): Promise<void>;
    public HardSetState(state: STATE): void;
}

declare class VMBaseGameInstance {
    public static GetGameCategory(): string;
    public static GetInstance(): VMBaseGameInstance;
    public SetGameInstance($gameListener: IVMUserInfo): void;
    public GetGameInstance(): IVMUserInfo;

    public RegisterListener($key: string, $gameListener: () => void): void;
    public RemoveListener($key: string, $gameListener: () => void): void;
    public RemoveAllListener($key: string): void;
    public EmitEvent($key, $data = undefined): void;
}

declare interface IVMGameInstanceInfo {
    GetUsername(): string,
    GetSessionId(): string,
    GetGameInfo?(): IVMGameInfo,
    GetGameData?(): any,
    SetGameData?($parameter: any): void,
    DoBackLobby?(): void,
}

declare interface IVMGameInfo {
    protocol: string,
    id: string,
    thumbnailUrl: string,
    commonPathUrl: string,
}

declare interface IVMGameResponder {
    OnResponseGameEventMessage($data: any): void;
}

declare abstract class VMBaseGamePrototype extends cc.Component {
    public readonly InitializeResponder: ($responder: IVMGameResponder) => void;
    public readonly InitializeBaseObserver: ($data: any, ...$optionalParams: any[]) => void;
    public readonly UpdateCoreData: (...$optionalParams: any[]) => void;
    protected readonly SendMessage: ($eventId: any, $data?: {}) => void;
}

declare abstract class VMSlotGameModulePrototype extends VMBaseGamePrototype {
    protected _corePropertiesData: any;
    protected _coreStateData: any;
    protected _coreResponseData: any;
    protected _coreEvents: any;
    protected _coreData: any;
    protected get CoreData(): any;

    public readonly InitializeBaseObserver: ($properties: any, $state: any, $response: any, $event: any) => void;
    public readonly UpdateCoreData: ($properties: any, $state: any, $response: any, $event: any) => void;
    private UpdateCoreEvents: ($events: any) => void;
    private UpdateCoreResponseData: ($responseData: any) => void;
    private UpdateCoreStatesData: ($statesData: any) => void;
    private UpdateCorePropertiesData: ($propertyData: any) => void;

    protected readonly DestroySelf: () => void;
    protected readonly UnlistenAll: () => void;
}

declare enum VMAudioGroupType {
    BASE, FREESPIN, PREFREESPIN, JACKPOT, BONUS, UI, BIGTEXT, RESPIN
}

declare enum VMAudioChannelType {
    BGM, SFX_GAME, SFX_UI
}

declare interface VMAudioPlaybackProperties {
    howl?: Howl,
    audioKey?: string,
    volume?: number,
    loop?: boolean,
    rate?: number,
    currVolume?: number,
    fadeFrom?: number,
    fadeTo?: number,
    fadeDuration?: number,
    onCompleteFade?: () => void;
    onCompletePlay?: () => void;
    onCompleteStop?: () => void;
    /** Please becareful with callback function as duplicate sound are same howler, thus it will attach to same howler */
    onEnd?: ($SoundId?: number) => void;
    /** Set to true if want one instance of audio exist, only affect playsound function */
    singleton?: boolean,
    /** Seek Time */
    startTime?: number,
}

declare class VMAudioChannelObject {
    constructor($channelType: VMAudioChannelType | string): VMAudioChannelObject;

    public get ChannelType(): VMAudioChannelType;
    public get ChannelVolume(): number;
    public get ChannelRate(): number;

    public SetAudio($howl: Howl, $key: string): VMAudioChannelObject;
    public SetEnableLogging($value: boolean): void;
    public PlaySound($inbound?: VMAudioPlaybackProperties): number;
    public StopSound($inbound?: VMAudioPlaybackProperties): void;
    public Fade($inbound?: VMAudioPlaybackProperties): number;

    public readonly IsPlaying: () => boolean;

    public readonly Mute: () => void;
    public readonly UnMute: () => void;
    public readonly DuckChannel: ($duckRatio: number = 0.1) => void;
    public readonly UnDuckChannel: () => void;

    private readonly CollectGarbage: () => void;
    private readonly Logging: ($log: string) => void;
}

declare class VMAudioEngine {
    public static Instance: VMAudioEngine;
    public static SetLogging($logging: boolean): void;
    public static Initialize($audioConfig: any, $baseDir: string): void;
    public static ReplaceConfig($audioConfig: any): void;
    public static SetGlobalMute($value: boolean): void;
    public static SetGlobalVolume($value: number): void;
    public static UnloadAudio(): void;

    public LoadGroup($groupKey: VMAudioGroupType | string, $groupKey: boolean = false): void;
    public UnloadGroup($groupKey: VMAudioGroupType | string): void;
    public GetAudioChannel($on: VMAudioChannelType | string, $audio: string): VMAudioChannelObject;
    public AddAudioChannel($channelType: VMAudioChannelType | string): void;
    public RemoveAudioChannelByType($channelType: VMAudioChannelType | string): void;
    public RemoveAudioChannelByName($name: string): void;
    public MuteCategory($channelType: VMAudioChannelType | string): void;
    public UnMuteCategory($channelType: VMAudioChannelType | string): void;
    public DuckAudioChannel($channelType: VMAudioChannelType | string, $duckRatio: number = 0.1): void;
    public UnDuckAudioChannel($channelType: VMAudioChannelType | string): void;

    private RemoveAudioChannel($name: string): void;
    private ResumeHowlerCtx(): void;
}

declare class RemoteResourceHandler {
    constructor();
    public static Instance: RemoteResourceHandler;
    public AddResourceConfig($configPath: string): void;
    public InitializeResourceKey($keys: string): void;
    public InitializeResourceData($basePath: string, $template: string, $cb: string);
    public InitiateDownload($basePath: string, $template: string, $cb: string);
    public GetResourceCount();
    public GetCompletedResourceCount();
    public GetDownloadProgress();
    public GetDownloadCompleted();
    public GetResource($key);
    public GetPath($key);
}

var remoteResourceHandler = new RemoteResourceHandler();
var remoteResourceHandler2 = new RemoteResourceHandler();