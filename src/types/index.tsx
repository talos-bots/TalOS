export type BotSettingsType = {
    endpoint: string;
    endpointType: string;
    password?: string;
    settings: {
      rep_pen?: number;
      rep_pen_range?: number;
      temperature?: number;
      sampler_order?: number[];
      top_k?: number;
      top_p?: number;
      top_a?: number;
      tfs?: number;
      typical?: number;
      singleline?: boolean;
      sampler_full_determinism?: boolean;
      max_length?: number;
      min_length?: number;
      max_context_length?: number;
      max_tokens?: number;
    };
    hordeModel?: string;
    stopBrackets?: boolean;
};