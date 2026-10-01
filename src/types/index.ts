export type AestheticMode = 'amber-gold' | 'neon-fracture';

export type EngineTarget = 'google-ai-studio' | 'local-ollama-katzqwenai' | 'dual-consensus';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sourceEngine: 'google-ai-studio' | 'local-ollama-katzqwenai' | 'dual-consensus' | 'system';
  timestamp: string;
  syncedToGoogleAIStudio: boolean;
  syncedToOllama: boolean;
  telemetry?: {
    latencyMs: number;
    tokens?: number;
    primeBusPingMs?: number;
    walCheckpoint?: string;
  };
}

export interface ManuscriptNode {
  id: string;
  title: string;
  chapterNumber: number;
  prose: string;
  authorAlias: 'April Rose' | 'Mystivia' | 'Nyptix' | 'Kat (Yuba City)';
  walPageId: string;
  committedAt: string;
  tags: string[];
}

export interface TelemetryData {
  primeBus: {
    meshLatencyMs: string;
    activeSubject: string;
    jetStreamPackets: number;
    status: string;
  };
  willowO: {
    totalNodes: number;
    sqliteWalPages: number;
    checkpointStatus: string;
    lastCommittedWal: string;
  };
  kaosKollisions: {
    particleCount: number;
    fps: number;
    controlNetDepthMap: string;
    currentShaders: string;
  };
  hardware: {
    host: string;
    vrDisplay: string;
    opticalMicroscope: string;
    opticalStatus: string;
  };
  katzTunez: {
    currentBpm: number;
    mode: string;
    activeVoice: string;
    alternateVoice: string;
  };
  syncBridge?: {
    status: string;
    sharedContextTurns: number;
    parity: string;
  };
}

export interface OllamaPingResult {
  online: boolean;
  endpoint: string;
  latencyMs: number;
  models?: string[];
  hasKatzQwen?: boolean;
  statusText: string;
}

export interface DirectorPacket {
  id: string;
  packetFile: string;
  chapterNumber: number;
  title: string;
  prose_directive: string;
  video_params: {
    grading: 'Amber-Gold Luminescence' | 'Neon Fracture / High Chaos' | '300x Optical Valerie Audit';
    motion_scale: number;
    target_fps: number;
    aspect_ratio: '16:9' | '9:16';
    resolution: '720p' | '1080p' | '4k';
    volumetric_bloom: boolean;
    analog_tape_saturation: boolean;
    kaos_particle_density: number;
    controlnet_depth_map: string;
    audio_directive: string;
  };
  compiledAt: string;
  status: 'PENDING' | 'RENDERING' | 'COMPILED';
  renderSpec?: string;
  targetOutputFile?: string;
}

export interface KatzKompilerBuild {
  id: string;
  manifestFile: string;
  compiler: string;
  timestamp: string;
  target_node: string;
  aesthetic_state: string;
  harmonic_spine: {
    bpm: number;
    protocol: string;
    clock_source: string;
  };
  truexr_rendering_parameters: {
    motion_scale: number;
    fps: number;
    color_grading: string;
    bloom_radius: number;
    controlnet_weight: number;
    controlnet_depth_source: string;
  };
  particle_telemetry: {
    status: string;
    nodes_active: number;
  };
  veo3_prompt_directive: string;
  pua_glyph_routing: string;
  outputPath: string;
  linkedToVeo3?: boolean;
}

export interface CouncilMember {
  agent_id: 'Adam-O' | 'Willow-O' | 'Valerie' | 'Arty' | 'Barry';
  domain: string;
  harmonic_binding: string;
  active_status: 'ONLINE' | 'ACTIVE_RENDER' | 'DIAGNOSTIC';
  core_directive: string;
  icon: string;
  color: string;
  lastAction: string;
}

export interface PortingFiles {
  pythonPortScript: string;
  biDirectionalSyncScript: string;
  veo3BridgeScript?: string;
  katzKompilerScript?: string;
  councilExpansionScript?: string;
  mobileWebBuilderScript?: string;
  khromiumBuilderScript?: string;
  primeBackendGenScript?: string;
  tunezSynthScript?: string;
  adamWillowBridgeScript?: string;
  bashInstallScript: string;
  githubPushScript: string;
  ollamaBridgeScript?: string;
}

export interface AdamWillowSyncPacket {
  source: string;
  timestamp: string;
  app_target: string;
  council_status: {
    adam_o: string;
    willow_o: string;
    arty: string;
    barry: string;
  };
  active_manuscript_node: string;
  aesthetic_state: string;
  prose_snippet: string;
}

export interface SynthChunk {
  part: 'Intro' | 'Verse / Build' | 'Pre-Drop Tension' | 'Main Climax' | 'Outro Decay';
  bars: number;
  durationSeconds: number;
  dspParameters: {
    cutoffHz: number;
    resonance: number;
    tapeDriveDb: number;
    reverbWet: number;
  };
  promptSeed: string;
}

export interface AliasMusicProfile {
  alias: 'April Rose' | 'Mystivia' | 'Nyptix';
  genre: string;
  bpm: number;
  key: string;
  aesthetic: string;
  color: string;
  description: string;
  vocalStyle: string;
  lyriaPromptTemplate: string;
  sunoPromptTemplate: string;
}
