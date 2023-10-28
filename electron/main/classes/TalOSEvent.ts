export enum TalOSEventType {
    DiscordCommand,
    ActiveConstructDiscordMessage,
    SecondaryConstructDiscordMessage,
    DiscordMessageCycleStart,
    DiscordMessageCycleEnd,
    DiscordMessageCycleActionDetermination,
    DiscordMessageCycleAction,
    DiscordMessageCycleError,
    LLMGenerationRequest,
    LLMGenerationResult,
    LLMGenerationError,
    SDGenerationRequest,
    SDGenerationResult,
    SDGenerationError,
}

export class TalOSEvent {
    constructor(
        public type: TalOSEventType,
        public consoleMessage: string,
        public data: any,
        public timestamp: number
    ){}
}