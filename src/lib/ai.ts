import { HfInference } from "@huggingface/inference";
import { AI_MODELS, getBestModelForTask, type AIModel } from "./models";
import { KNOWLEDGE_BASE, type KnowledgeChunk } from "./knowledge-base";

const VISUAL_GUIDANCE = `
Visual reference guidance: use the Roblox icon and thumbnail archive as a style
reference, not as a source to reproduce a specific creator's artwork. Prefer
one readable focal subject, strong silhouette, high contrast at small sizes,
clear foreground/midground/background separation, and a 16:9 composition for
thumbnails or a centered square composition for icons. Leave safe space for
title text and avoid tiny UI copy, brand logos, and watermarks.
`;

function escapeSvgText(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[character] || character));
}

/** A prompt-driven local visual fallback for keyless/offline thumbnail creation. */
export function createVisualFallback(prompt: string, style: "icon" | "thumbnail" | "concept" = "thumbnail"): string {
  const square = style === "icon";
  const width = square ? 1024 : 1536;
  const height = square ? 1024 : 864;
  const words = prompt.trim().split(/\s+/).filter(Boolean).slice(0, 5).join(" ") || "YOUR ROBLOX WORLD";
  const title = escapeSvgText(words.toUpperCase().slice(0, 34));
  let hash = 0;
  for (const character of prompt) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const hue = hash % 360;
  const accent = `hsl(${hue}, 88%, 64%)`;
  const accent2 = `hsl(${(hue + 72) % 360}, 84%, 56%)`;
  const sceneX = square ? 512 : 880;
  const sceneY = square ? 610 : 590;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1020"/><stop offset=".5" stop-color="#142c51"/><stop offset="1" stop-color="#071016"/></linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/></linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#284e67"/><stop offset="1" stop-color="#101923"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
    <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${square ? 170 : 290}" cy="${square ? 230 : 180}" r="170" fill="${accent}" opacity=".26" filter="url(#blur)"/>
  <circle cx="${square ? 870 : 1250}" cy="${square ? 820 : 120}" r="210" fill="${accent2}" opacity=".2" filter="url(#blur)"/>
  <path d="M0 ${height * .7} Q${width * .25} ${height * .58} ${width * .5} ${height * .7} T${width} ${height * .62} V${height} H0Z" fill="url(#ground)"/>
  <path d="M0 ${height * .78} L${width * .22} ${height * .65} L${width * .46} ${height * .8} L${width * .72} ${height * .63} L${width} ${height * .74} V${height} H0Z" fill="#0a1119" opacity=".65"/>
  <g filter="url(#shadow)" transform="translate(${sceneX - 190} ${sceneY - 150})">
    <rect x="35" y="145" width="310" height="180" rx="28" fill="#e6a95f"/>
    <path d="M0 160 L190 0 L380 160Z" fill="url(#glow)"/>
    <rect x="160" y="225" width="68" height="100" rx="12" fill="#513d5e"/>
    <rect x="68" y="190" width="70" height="62" rx="10" fill="#7ed4e8" stroke="#d4fbff" stroke-width="8"/>
    <rect x="242" y="190" width="70" height="62" rx="10" fill="#7ed4e8" stroke="#d4fbff" stroke-width="8"/>
    <circle cx="25" cy="130" r="38" fill="#53c982"/><circle cx="355" cy="130" r="38" fill="#53c982"/>
  </g>
  <g opacity=".9"><circle cx="${sceneX - 330}" cy="${sceneY - 260}" r="10" fill="#fff"/><circle cx="${sceneX + 310}" cy="${sceneY - 225}" r="7" fill="#fff"/><circle cx="${sceneX + 380}" cy="${sceneY - 340}" r="5" fill="#fff"/></g>
  <rect x="${square ? 70 : 88}" y="${square ? 70 : 64}" width="${square ? 884 : 760}" height="${square ? 884 : 170}" rx="38" fill="#050914" opacity=".42" stroke="#fff" stroke-opacity=".16" stroke-width="3"/>
  <text x="${square ? 512 : 128}" y="${square ? 166 : 126}" text-anchor="${square ? "middle" : "start"}" fill="#fff" font-family="Arial, sans-serif" font-size="${square ? 62 : 55}" font-weight="900" letter-spacing="3">${title}</text>
  <text x="${square ? 512 : 128}" y="${square ? 225 : 176}" text-anchor="${square ? "middle" : "start"}" fill="${accent}" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5">VIBE BUILD • PLAY NOW</text>
  <rect x="${square ? 420 : 128}" y="${square ? 900 : 785}" width="${square ? 184 : 280}" height="8" rx="4" fill="url(#glow)"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

let hfClient: HfInference | null = null;

function getClient(token?: string): HfInference {
  if (!hfClient || token) {
    hfClient = new HfInference(token || undefined);
  }
  return hfClient;
}

function retrieveKnowledge(message: string, maxChunks = 5): KnowledgeChunk[] {
  const lower = message.toLowerCase();
  const words = lower.split(/\s+/);

  const scored = KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    for (const keyword of chunk.keywords) {
      const kw = keyword.toLowerCase();
      if (lower.includes(kw)) {
        score += kw.length > 4 ? 3 : 1;
      }
      for (const word of words) {
        if (word === kw) score += 2;
      }
    }
    if (lower.includes(chunk.category)) score += 2;
    if (lower.includes(chunk.title.toLowerCase())) score += 5;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((s) => s.chunk);
}

function buildKnowledgeContext(message: string): string {
  const chunks = retrieveKnowledge(message);
  if (chunks.length === 0) return "";

  let ctx = "\n\n## Retrieved Knowledge (from training data)\n";
  for (const chunk of chunks) {
    ctx += `\n### ${chunk.title}\n${chunk.content}\n`;
  }
  return ctx;
}

export function detectTaskType(
  message: string
): "code" | "plan" | "image" | "3d" {
  const lower = message.toLowerCase();

  if (
    lower.includes("generate image") ||
    lower.includes("create image") ||
    lower.includes("draw") ||
    lower.includes("thumbnail") ||
    lower.includes("icon") ||
    lower.includes("texture") ||
    lower.includes("2d")
  ) {
    return "image";
  }

  if (
    lower.includes("3d model") ||
    lower.includes("3d asset") ||
    lower.includes("mesh") ||
    lower.includes("generate 3d")
  ) {
    return "3d";
  }

  if (
    lower.includes("plan") ||
    lower.includes("design") ||
    lower.includes("architecture") ||
    lower.includes("how should") ||
    lower.includes("what would")
  ) {
    return "plan";
  }

  return "code";
}

const SYSTEM_PROMPT = `You are Vibe AI, an expert Roblox game developer AI assistant trained on extensive Roblox development knowledge. You help users build Roblox games by generating Luau code, creating game systems, and designing game architecture.

## Core Knowledge (from roblox-brain, roblox-dev-skills, luau-skills, roblox-skills)

### Roblox Architecture Patterns
- **Client-Server Model:** Server is authoritative. Never trust the client for game logic. Use RemoteEvents for client→server communication, RemoteFunctions only when return value is needed. Always validate inputs on the server.
- **Script Organization:** ServerScripts in ServerScriptService, LocalScripts in StarterPlayerScripts or StarterCharacterScripts, ModuleScripts in ReplicatedStorage (shared) or ServerStorage (server-only).
- **Data Flow:** Server → ReplicatedStorage → Client. Use Attributes for replicated state. Use ValueObjects (IntValue, StringValue) for leaderstats.
- **Instance Tree:** game.Workspace (3D world), game.Players (player objects), game.ReplicatedStorage (shared modules/assets), game.ServerStorage (server-only assets), game.ServerScriptService (server scripts), game.StarterGui (UI templates), game.StarterPack (tools), game.Lighting (environment).

### Luau Language Patterns (from Luau Corpus & Luau Reasoning datasets)
- **Type Annotations:** Always use \`local x: number = 0\`, function params \`function foo(bar: string): boolean\`, and type aliases \`type PlayerData = { coins: number, inventory: {string} }\`.
- **Error Handling:** Wrap DataStore/HTTP calls in \`pcall\`. Pattern: \`local success, result = pcall(function() return store:GetAsync(key) end)\`.
- **Tables:** Use \`{}\` for arrays and dictionaries. Iterate arrays with \`for i, v in ipairs(arr)\` or \`for _, v in arr\`. Iterate dicts with \`for k, v in pairs(dict)\`.
- **Task Library:** Use \`task.spawn\`, \`task.delay\`, \`task.wait\` instead of deprecated \`spawn\`, \`delay\`, \`wait\`.
- **String Interpolation:** Use backtick strings: \`\\\`Hello {player.Name}!\\\`\` instead of concatenation.
- **If Expressions:** \`local x = if condition then valueA else valueB\`.
- **Generalized Iteration:** \`for i, v in array do\` works without ipairs in modern Luau.
- **Optional Chaining Pattern:** No native ?. operator — use \`local x = obj and obj.prop\`.
- **Metatables:** Use \`__index\` for OOP: \`local Class = {}; Class.__index = Class; function Class.new() return setmetatable({}, Class) end\`.
- **Coroutines:** Prefer task library over raw coroutines. Use \`task.spawn(function() end)\` for fire-and-forget.

### Roblox Services Reference
- **DataStoreService:** Persistent storage. \`GetDataStore(name)\`, \`:GetAsync(key)\`, \`:SetAsync(key, value)\`, \`:UpdateAsync(key, transform)\`. Has rate limits (60 + 10*players requests/min). Use UpdateAsync for atomic operations.
- **Players:** \`.PlayerAdded\`, \`.PlayerRemoving\`, \`:GetPlayers()\`. Player has .Character, .UserId, .Name, .Team.
- **RunService:** \`.Heartbeat\` (post-physics), \`.RenderStepped\` (pre-render, client only), \`.Stepped\` (pre-physics). Use for game loops.
- **TweenService:** Animate properties: \`TweenService:Create(instance, TweenInfo.new(duration, easingStyle), {Property = goal}):Play()\`.
- **PathfindingService:** NPC navigation: \`:CreatePath({AgentRadius, AgentHeight, AgentCanJump})\`, \`path:ComputeAsync(start, end)\`, \`path:GetWaypoints()\`.
- **CollectionService:** Tag-based systems: \`:AddTag(instance, tag)\`, \`:GetTagged(tag)\`, \`:GetInstanceAddedSignal(tag)\`.
- **PhysicsService:** Collision groups: \`:RegisterCollisionGroup(name)\`, \`:CollisionGroupSetCollidable(g1, g2, bool)\`.
- **MarketplaceService:** Game passes, developer products: \`:PromptProductPurchase\`, \`:PromptGamePassPurchase\`, \`.ProcessReceipt\`.
- **UserInputService:** Input detection (client): \`.InputBegan\`, \`.InputEnded\`, \`:IsKeyDown()\`, \`:GetMouseLocation()\`.
- **ReplicatedStorage:** Shared modules, RemoteEvents, RemoteFunctions, assets accessed by both client and server.

### Common Game System Patterns
- **Leaderstats:** Create Folder "leaderstats" in Player, add IntValue/StringValue children. Auto-displays on leaderboard.
- **Tools:** Place in StarterPack. Has Handle part, .Activated event, .Equipped/.Unequipped. Use for weapons, items.
- **GUI:** ScreenGui in StarterGui. Frame > TextLabel/TextButton/ImageLabel. Use UIListLayout, UICorner, UIPadding for layout.
- **Hitbox:** Create invisible Part, check Touched or use GetPartsInPart/GetPartBoundsInBox for overlap detection.
- **State Machine:** ModuleScript with states table, transition functions. Common for NPC AI, game phases.
- **Observer Pattern:** Use BindableEvents for server-internal communication, RemoteEvents for client-server.
- **Data Save Pattern:** Save on PlayerRemoving AND use game:BindToClose for server shutdown safety.

### Network Replication Rules
- RemoteEvent: Fire-and-forget. \`:FireServer(args)\` from client, \`:FireClient(player, args)\` from server, \`:FireAllClients(args)\` for broadcast.
- RemoteFunction: Request-response. \`:InvokeServer(args)\` from client. Avoid \`:InvokeClient\` (client can hang the server).
- Validate EVERYTHING on server: check types, ranges, ownership, cooldowns. Never trust client data.
- Replicated properties: Position, CFrame, Attributes, Value objects auto-replicate. Custom data needs manual replication.

### Anti-Cheat Basics
- Server validates all game-critical actions (damage, purchases, teleports)
- Use cooldowns on server to prevent spam
- Don't expose sensitive data in ReplicatedStorage
- Sanity-check values (speed, position deltas, damage amounts)

When asked to build something:
1. First explain what you'll create (instances, scripts, UI)
2. List the folder structure and where scripts go
3. Provide clean, well-structured Luau code with type annotations
4. Note any manual setup requirements in Studio
5. Mention data persistence if relevant

Always generate production-quality Luau code. Use type annotations. Follow the patterns above. Use task library, not deprecated functions. Validate on server. Handle errors with pcall.`;

export async function generateTextResponse(
  message: string,
  modelId?: string,
  token?: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<{ text: string; model: AIModel; error?: string }> {
  const taskType = detectTaskType(message);
  const model = modelId
    ? (AI_MODELS.find((m) => m.id === modelId && m.category === "text") || getBestModelForTask(taskType))
    : getBestModelForTask(taskType);

  const client = getClient(token);

  try {
    const knowledgeContext = buildKnowledgeContext(message);
    const response = await client.chatCompletion({
      model: model.hfId,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + knowledgeContext },
        ...history.slice(-8),
        { role: "user", content: message },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const text =
      response.choices?.[0]?.message?.content ||
      "I received your request but couldn't generate a response. The model may be loading — try again in a moment.";

    return { text, model };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    // Some Hugging Face deployments expose native text generation but not
    // the OpenAI-compatible chat router. Try that path before falling back.
    try {
      const generated = await client.textGeneration({
        model: model.hfId,
        inputs: `${SYSTEM_PROMPT}${buildKnowledgeContext(message)}\n\nRecent conversation:\n${history.slice(-6).map((item) => `${item.role}: ${item.content}`).join("\n")}\n\nCurrent user request (follow exactly): ${message}\n\nAssistant:`,
        max_new_tokens: 1536,
        temperature: 0.55,
        return_full_text: false,
      });
      const text = typeof generated === "string"
        ? generated
        : Array.isArray(generated)
          ? generated[0]?.generated_text
          : generated.generated_text;
      if (text?.trim()) return { text: text.trim(), model };
    } catch {
      // Continue to the deterministic Roblox fallback below.
    }

    const isRateLimit =
      errorMessage.includes("429") || errorMessage.includes("rate");
    const isModelLoading =
      errorMessage.includes("loading") || errorMessage.includes("503");
    const isAuth = errorMessage.includes("401") || errorMessage.includes("403");

    let fallbackText: string;

    if (isModelLoading) {
      fallbackText = `The model **${model.name}** is currently loading on HuggingFace servers. This can take 1-2 minutes for large models. Please try again shortly.\n\nIn the meantime, here's what I would build for "${message}":\n\n`;
      fallbackText += generateFallbackResponse(message);
    } else if (isRateLimit) {
      fallbackText = `Rate limit reached for **${model.name}**. Free-tier HuggingFace inference has request limits.\n\nHere's a preview of what I'd generate:\n\n`;
      fallbackText += generateFallbackResponse(message);
    } else if (isAuth) {
      fallbackText = `**${model.name}** is unavailable for anonymous inference right now.\n\nUsing the built-in Roblox knowledge fallback so you can keep building:\n\n`;
      fallbackText += generateFallbackResponse(message);
    } else {
      fallbackText = generateFallbackResponse(message);
    }

    return { text: fallbackText, model, error: errorMessage };
  }
}

export async function generateImage(
  prompt: string,
  modelId?: string,
  token?: string,
  style?: "icon" | "thumbnail" | "concept"
): Promise<{ imageUrl: string; model: AIModel; error?: string }> {
  const model = modelId
    ? (AI_MODELS.find((m) => m.id === modelId && m.category === "image-2d") || getBestModelForTask("image"))
    : getBestModelForTask("image");

  const client = getClient(token);

  try {
    const result = await client.textToImage({
      model: model.hfId,
      inputs: `${style === "thumbnail" ? "Roblox game thumbnail, cinematic 16:9 composition" : style === "icon" ? "Roblox game icon, centered square composition" : "Roblox game concept art"}, ${prompt}, vibrant readable shapes. ${VISUAL_GUIDANCE}`,
    });

    let imageUrl: string;
    if (typeof result === "object" && result !== null && "arrayBuffer" in result) {
      const buffer = await (result as Blob).arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      imageUrl = `data:image/png;base64,${base64}`;
    } else {
      imageUrl = String(result);
    }

    return { imageUrl, model };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Image generation failed";
    return {
      imageUrl: "",
      model,
      error: `Image generation with ${model.name} is unavailable anonymously (${errorMessage}). A visual reference fallback is shown so the build can continue.`,
    };
  }
}

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  const brief = `**Requested brief:** ${message.trim()}\n\n`;

  if (lower.includes("obby") || lower.includes("obstacle")) {
    return `${brief}## Obby System

I'll create a complete obstacle course with checkpoints.

**Instances to create:**
- Folder "ObbyStages" in Workspace
- 20 Stage parts with increasing difficulty
- SpawnLocation at each checkpoint
- KillBrick parts with Touched connections
- Victory platform at stage 20

\`\`\`lua
-- ServerScriptService/ObbyManager.lua
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local stageStore = DataStoreService:GetDataStore("ObbyStages")

local function onPlayerAdded(player: Player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = leaderstats

    -- Load saved stage
    local success, savedStage = pcall(function()
        return stageStore:GetAsync("player_" .. player.UserId)
    end)
    if success and savedStage then
        stage.Value = savedStage
    end

    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        local stageSpawn = workspace.ObbyStages:FindFirstChild("Stage" .. stage.Value)
        if stageSpawn then
            character:PivotTo(stageSpawn.CFrame + Vector3.new(0, 5, 0))
        end
    end)
end

Players.PlayerAdded:Connect(onPlayerAdded)
\`\`\``;
  }

  if (lower.includes("sword") || lower.includes("combat") || lower.includes("fight")) {
    return `${brief}## Combat System

Building a sword fighting system with combos and special attacks.

**Instances to create:**
- Tool "Sword" in StarterPack
- Handle part with Mesh
- Slash, Lunge, Spin animations
- HitboxPart for damage detection

\`\`\`lua
-- StarterPack/Sword/CombatHandler.lua
local tool = script.Parent
local handle = tool:WaitForChild("Handle")
local player = tool.Parent.Parent
local humanoid = player.Character and player.Character:FindFirstChild("Humanoid")

local COMBO_WINDOW = 0.8
local DAMAGE_TABLE = { 15, 20, 35 }
local comboIndex = 0
local lastAttackTime = 0
local specialMeter = 0

local function dealDamage(target: Humanoid, amount: number)
    target:TakeDamage(amount)
    specialMeter = math.min(specialMeter + 10, 100)
end

local function performAttack()
    local now = tick()
    if now - lastAttackTime > COMBO_WINDOW then
        comboIndex = 0
    end

    comboIndex = math.min(comboIndex + 1, 3)
    lastAttackTime = now

    local damage = DAMAGE_TABLE[comboIndex]
    -- Create hitbox and detect enemies
    local hitbox = Instance.new("Part")
    hitbox.Size = Vector3.new(4, 4, 6)
    hitbox.CFrame = handle.CFrame * CFrame.new(0, 0, -3)
    hitbox.Anchored = true
    hitbox.CanCollide = false
    hitbox.Transparency = 1
    hitbox.Parent = workspace

    local touched = {}
    hitbox.Touched:Connect(function(hit)
        local targetHumanoid = hit.Parent:FindFirstChild("Humanoid")
        if targetHumanoid and not touched[targetHumanoid] then
            touched[targetHumanoid] = true
            dealDamage(targetHumanoid, damage)
        end
    end)

    task.delay(0.2, function()
        hitbox:Destroy()
    end)
end

tool.Activated:Connect(performAttack)
\`\`\``;
  }

  if (lower.includes("fish") || lower.includes("fishing") || lower.includes("bait") || lower.includes("fishing rod")) {
    return `${brief}## Fishing game system

I will build the fishing loop you requested: equip a rod, consume bait, catch fish into an inventory, and sell catches for coins.

**Instances to create:**
- StarterPack/FishingRod with a validated cast action
- ReplicatedStorage/Remotes/CastLine, CatchFish, and SellFish
- ServerScriptService/FishingService.server.lua for catch rolls, bait, inventory, and coins
- StarterGui/FishingGui for bait count, catch result, inventory, and sell button

**Rules:** the server owns catch chances, bait consumption, inventory limits, and coin rewards. The client only requests an action and renders the result.

\`\`\`lua
-- ServerScriptService/FishingService.server.lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local remotes = ReplicatedStorage:WaitForChild("Remotes")
local fishByPlayer: {[Player]: {string}} = {}
local baitByPlayer: {[Player]: number} = {}

local FISH = { "Carp", "Trout", "Golden Koi", "Moonfish" }

local function catchFish(player: Player)
    local bait = baitByPlayer[player] or 0
    if bait <= 0 then return end
    baitByPlayer[player] = bait - 1
    local inventory = fishByPlayer[player] or {}
    if #inventory >= 30 then return end
    table.insert(inventory, FISH[math.random(1, #FISH)])
    fishByPlayer[player] = inventory
end

remotes.CastLine.OnServerEvent:Connect(catchFish)
Players.PlayerRemoving:Connect(function(player)
    fishByPlayer[player] = nil
    baitByPlayer[player] = nil
end)

\`\`\`

The exact parts of your brief are preserved above; the next step is wiring the sell prices and the UI layout you prefer.`;
  }

  if (lower.includes("shop") || lower.includes("store") || lower.includes("buy")) {
    return `${brief}## Shop System

Creating a full shop with currency, items, and GUI.

**Instances to create:**
- ScreenGui "ShopGui" in StarterGui
- Frame with category tabs and item grid
- RemoteEvents for purchase flow
- DataStore for player inventory and coins

\`\`\`lua
-- ServerScriptService/ShopService.lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")

local shopStore = DataStoreService:GetDataStore("PlayerShop")
local purchaseEvent = ReplicatedStorage:WaitForChild("PurchaseItem")

type ShopItem = {
    id: string,
    name: string,
    price: number,
    category: string,
    description: string,
}

local ITEMS: {ShopItem} = {
    { id = "wooden_sword", name = "Wooden Sword", price = 100, category = "Weapons", description = "A basic wooden sword" },
    { id = "iron_armor", name = "Iron Armor", price = 250, category = "Armor", description = "Standard iron protection" },
    { id = "speed_potion", name = "Speed Potion", price = 50, category = "Consumables", description = "2x speed for 30 seconds" },
    { id = "pet_egg_common", name = "Common Egg", price = 200, category = "Pets", description = "Hatch a common pet" },
}

local function getPlayerData(player: Player)
    local success, data = pcall(function()
        return shopStore:GetAsync("player_" .. player.UserId)
    end)
    return if success and data then data else { coins = 500, inventory = {} }
end

purchaseEvent.OnServerEvent:Connect(function(player, itemId)
    local data = getPlayerData(player)
    local item = nil
    for _, i in ITEMS do
        if i.id == itemId then item = i; break end
    end
    if not item or data.coins < item.price then return end

    data.coins -= item.price
    table.insert(data.inventory, itemId)
    shopStore:SetAsync("player_" .. player.UserId, data)
    purchaseEvent:FireClient(player, "success", item.name, data.coins)
end)
\`\`\``;
  }

  if (lower.includes("pet") || lower.includes("egg") || lower.includes("hatch")) {
    return `${brief}## Pet System

Creating a complete pet system with egg hatching, following, and inventory.

**Instances to create:**
- Pet models in ReplicatedStorage
- Egg models with hatching animation
- ScreenGui for pet inventory
- FollowScript for pet movement

\`\`\`lua
-- ServerScriptService/PetService.lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

type PetData = {
    name: string,
    rarity: "Common" | "Rare" | "Legendary",
    model: string,
    walkSpeed: number,
}

local PET_POOLS = {
    Common = {
        { name = "Puppy", rarity = "Common", model = "Puppy", walkSpeed = 16 },
        { name = "Kitten", rarity = "Common", model = "Kitten", walkSpeed = 18 },
        { name = "Bunny", rarity = "Common", model = "Bunny", walkSpeed = 20 },
    },
    Rare = {
        { name = "Dragon", rarity = "Rare", model = "Dragon", walkSpeed = 22 },
        { name = "Phoenix", rarity = "Rare", model = "Phoenix", walkSpeed = 24 },
    },
    Legendary = {
        { name = "Cosmic Wolf", rarity = "Legendary", model = "CosmicWolf", walkSpeed = 28 },
    },
}

local function hatchEgg(eggType: string): PetData
    local roll = math.random(100)
    local pool
    if eggType == "Legendary" then
        pool = if roll <= 5 then "Legendary" elseif roll <= 30 then "Rare" else "Common"
    elseif eggType == "Rare" then
        pool = if roll <= 15 then "Rare" else "Common"
    else
        pool = "Common"
    end
    local pets = PET_POOLS[pool]
    return pets[math.random(#pets)]
end

local function spawnFollowPet(player: Player, petData: PetData)
    local character = player.Character
    if not character then return end

    local petModel = ReplicatedStorage.Pets:FindFirstChild(petData.model)
    if not petModel then return end

    local pet = petModel:Clone()
    pet.Parent = workspace
    -- Follow logic
    task.spawn(function()
        while pet.Parent and character.Parent do
            local targetPos = character.PrimaryPart.Position + Vector3.new(3, 0, 3)
            pet:PivotTo(CFrame.new(pet:GetPivot().Position:Lerp(targetPos, 0.1)))
            task.wait(0.03)
        end
    end)
end
\`\`\``;
  }

  if (lower.includes("npc") || lower.includes("enemy") || lower.includes("zombie")) {
    return `${brief}## NPC Enemy System

Adding enemy NPCs with pathfinding AI that chase and attack players.

**Instances to create:**
- NPC models in workspace
- PathfindingService-based AI
- Health bars above NPCs
- Respawn system

\`\`\`lua
-- ServerScriptService/NPCController.lua
local PathfindingService = game:GetService("PathfindingService")
local Players = game:GetService("Players")

local DETECTION_RANGE = 40
local CHASE_RANGE = 60
local ATTACK_DAMAGE = 20
local ATTACK_COOLDOWN = 1.5
local RESPAWN_TIME = 10

local function findNearestPlayer(npcPosition: Vector3): Player?
    local nearest: Player? = nil
    local nearestDist = DETECTION_RANGE

    for _, player in Players:GetPlayers() do
        local character = player.Character
        if character and character:FindFirstChild("HumanoidRootPart") then
            local dist = (character.HumanoidRootPart.Position - npcPosition).Magnitude
            if dist < nearestDist then
                nearest = player
                nearestDist = dist
            end
        end
    end
    return nearest
end

local function setupNPC(npc: Model)
    local humanoid = npc:FindFirstChildOfClass("Humanoid")
    local rootPart = npc:FindFirstChild("HumanoidRootPart")
    if not humanoid or not rootPart then return end

    humanoid.WalkSpeed = 14
    local lastAttack = 0

    task.spawn(function()
        while humanoid.Health > 0 do
            local target = findNearestPlayer(rootPart.Position)
            if target and target.Character then
                local targetRoot = target.Character:FindFirstChild("HumanoidRootPart")
                if targetRoot then
                    local dist = (targetRoot.Position - rootPart.Position).Magnitude
                    if dist <= ATTACK_COOLDOWN and tick() - lastAttack > ATTACK_COOLDOWN then
                        target.Character.Humanoid:TakeDamage(ATTACK_DAMAGE)
                        lastAttack = tick()
                    else
                        local path = PathfindingService:CreatePath()
                        path:ComputeAsync(rootPart.Position, targetRoot.Position)
                        if path.Status == Enum.PathStatus.Success then
                            for _, waypoint in path:GetWaypoints() do
                                humanoid:MoveTo(waypoint.Position)
                                humanoid.MoveToFinished:Wait()
                            end
                        end
                    end
                end
            end
            task.wait(0.5)
        end

        -- Respawn
        task.delay(RESPAWN_TIME, function()
            humanoid.Health = humanoid.MaxHealth
            npc:PivotTo(npc:GetAttribute("SpawnCFrame") or CFrame.new(0, 5, 0))
        end)
    end)
end
\`\`\``;
  }

  if (lower.includes("racing") || lower.includes("race") || lower.includes("kart")) {
    return `${brief}## Racing System

Building a racing track with vehicles, checkpoints, and leaderboards.

\`\`\`lua
-- ServerScriptService/RaceManager.lua
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local leaderboardStore = DataStoreService:GetOrderedDataStore("RaceTimes")

local CHECKPOINTS = workspace.RaceTrack.Checkpoints
local TOTAL_LAPS = 3

type RaceState = {
    startTime: number,
    currentLap: number,
    checkpointsHit: {[string]: boolean},
    finished: boolean,
}

local activeRaces: {[Player]: RaceState} = {}

local function startRace(player: Player)
    activeRaces[player] = {
        startTime = tick(),
        currentLap = 1,
        checkpointsHit = {},
        finished = false,
    }
end

local function onCheckpointHit(player: Player, checkpointName: string)
    local state = activeRaces[player]
    if not state or state.finished then return end

    state.checkpointsHit[checkpointName] = true

    -- Check if all checkpoints hit for current lap
    local allHit = true
    for _, cp in CHECKPOINTS:GetChildren() do
        if not state.checkpointsHit[cp.Name] then
            allHit = false
            break
        end
    end

    if allHit then
        state.currentLap += 1
        state.checkpointsHit = {}
        if state.currentLap > TOTAL_LAPS then
            state.finished = true
            local totalTime = tick() - state.startTime
            pcall(function()
                leaderboardStore:SetAsync(player.UserId, math.floor(totalTime * 100))
            end)
        end
    end
end
\`\`\``;
  }

  return `${brief}## Roblox build plan

I will keep the requested mechanic as the source of truth and avoid inventing unrelated systems.

### Implementation plan
1. Analyze your current Studio scene structure
2. Plan the required instances, scripts, and UI elements
3. Generate clean, typed Luau code
4. Create all necessary parts and configurations
5. Sync only the requested changes to your Roblox Studio session

\`\`\`lua
-- This is where the generated code will appear
-- The request is preserved above so the next generation stays grounded.
\`\`\`

Tell me the one part you want implemented first, and I will change only that part.`;
}
