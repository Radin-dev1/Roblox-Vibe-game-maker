export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  category: "code" | "visual" | "audio" | "utility";
  features: string[];
  comingSoon?: boolean;
}

export const TOOLS: Tool[] = [
  {
    id: "script-gen",
    name: "Script Generator",
    description: "Generate production-ready Luau scripts from natural language",
    longDescription: "Describe any game mechanic and get clean, optimized Luau code. Supports Server, Client, and Module scripts with proper architecture patterns.",
    icon: "S",
    color: "#7c5cfc",
    category: "code",
    features: ["Server/Client/Module scripts", "Error handling", "Type annotations", "Performance optimized"],
  },
  {
    id: "gui-builder",
    name: "GUI Builder",
    description: "Design and generate Roblox UI from descriptions or screenshots",
    longDescription: "Create stunning game interfaces — menus, HUDs, shops, inventories, and more. Generates ScreenGui hierarchies with proper scaling and theming.",
    icon: "G",
    color: "#00d4aa",
    category: "visual",
    features: ["Auto-scaling UI", "Animations", "Responsive layouts", "Touch-friendly"],
  },
  {
    id: "map-maker",
    name: "Map Maker",
    description: "Generate 3D maps and environments from text descriptions",
    longDescription: "Describe your game world and get a fully built map with terrain, props, spawn points, and lighting. Supports multiple biomes and styles.",
    icon: "M",
    color: "#ff6b6b",
    category: "visual",
    features: ["Terrain generation", "Prop placement", "Lighting setup", "Multiple biomes"],
  },
  {
    id: "npc-creator",
    name: "NPC Creator",
    description: "Build intelligent NPCs with pathfinding, dialogue, and combat AI",
    longDescription: "Create NPCs that feel alive — shopkeepers with dialogue trees, enemies with patrol routes and combat AI, quest givers, and more.",
    icon: "N",
    color: "#fbbf24",
    category: "code",
    features: ["Pathfinding AI", "Dialogue trees", "Combat behavior", "Quest integration"],
  },
  {
    id: "texture-studio",
    name: "Texture Studio",
    description: "Generate and apply textures to your game assets",
    longDescription: "Create custom textures from text descriptions. Apply them to parts, meshes, and terrain. Supports PBR materials with roughness and metalness maps.",
    icon: "T",
    color: "#a78bfa",
    category: "visual",
    features: ["AI texture generation", "PBR materials", "Seamless tiling", "Batch apply"],
  },
  {
    id: "sound-studio",
    name: "Sound Studio",
    description: "Add music, sound effects, and ambient audio to your game",
    longDescription: "Generate and place sound effects, background music, and ambient audio. Auto-configures SoundService with proper settings for 3D and 2D audio.",
    icon: "A",
    color: "#f472b6",
    category: "audio",
    features: ["SFX generation", "Music placement", "3D spatial audio", "Volume management"],
  },
  {
    id: "data-manager",
    name: "Data Manager",
    description: "Generate DataStore systems for saving and loading player data",
    longDescription: "Create robust data persistence with DataStoreService. Handles player data, leaderboards, global datastores, and session locking with auto-save.",
    icon: "D",
    color: "#34d399",
    category: "code",
    features: ["DataStore setup", "Auto-save", "Session locking", "Data migration"],
  },
  {
    id: "animation-studio",
    name: "Animation Studio",
    description: "Create and manage character animations and tweens",
    longDescription: "Generate animation sequences, configure AnimationControllers, and create smooth TweenService animations for any object in your game.",
    icon: "V",
    color: "#fb923c",
    category: "visual",
    features: ["Character anims", "Tween sequences", "Easing curves", "Animation events"],
    comingSoon: true,
  },
  {
    id: "localization",
    name: "Translator",
    description: "Translate your game into multiple languages automatically",
    longDescription: "Auto-detect all visible text in your game and translate it into dozens of languages using LocalizationService with proper context handling.",
    icon: "L",
    color: "#06b6d4",
    category: "utility",
    features: ["Auto-detection", "50+ languages", "Context-aware", "Bulk translate"],
    comingSoon: true,
  },
  {
    id: "debugger",
    name: "Bug Doctor",
    description: "Analyze your scripts for bugs, memory leaks, and performance issues",
    longDescription: "Paste any Luau code and get instant analysis — find memory leaks, infinite loops, race conditions, and performance bottlenecks with suggested fixes.",
    icon: "B",
    color: "#ef4444",
    category: "utility",
    features: ["Bug detection", "Memory leak finder", "Performance tips", "Auto-fix suggestions"],
  },
  {
    id: "game-systems",
    name: "Game Systems",
    description: "Generate complete game systems: combat, economy, quests, pets",
    longDescription: "One-click generation of complete game systems. Each system includes all necessary scripts, UI elements, and data structures wired together.",
    icon: "X",
    color: "#8b5cf6",
    category: "code",
    features: ["Combat systems", "Economy/shops", "Quest framework", "Pet/inventory"],
  },
  {
    id: "plugin-builder",
    name: "Plugin Builder",
    description: "Create custom Roblox Studio plugins from descriptions",
    longDescription: "Generate Studio plugins with toolbar buttons, custom widgets, and DockWidgetPluginGuis. Great for automating repetitive tasks in your workflow.",
    icon: "P",
    color: "#14b8a6",
    category: "code",
    features: ["Toolbar buttons", "Custom widgets", "Dock widgets", "Undo support"],
    comingSoon: true,
  },
];

export const TOOL_CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "code", label: "Code" },
  { id: "visual", label: "Visual" },
  { id: "audio", label: "Audio" },
  { id: "utility", label: "Utility" },
];
