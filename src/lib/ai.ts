import { HfInference } from "@huggingface/inference";
import { AI_MODELS, getBestModelForTask, type AIModel } from "./models";

let hfClient: HfInference | null = null;

function getClient(token?: string): HfInference {
  if (!hfClient || token) {
    hfClient = new HfInference(token || undefined);
  }
  return hfClient;
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

const SYSTEM_PROMPT = `You are Vibe AI, an expert Roblox game developer AI assistant. You help users build Roblox games by generating Luau code, creating game systems, and designing game architecture.

You have deep knowledge of:
- Roblox Studio and its API (Services, Instances, Properties)
- Luau programming language (types, generics, coroutines, metatables)
- Game design patterns (state machines, ECS, observer pattern)
- Common game systems (combat, inventory, UI, economy, NPCs, pets)
- Roblox services (DataStoreService, ReplicatedStorage, ServerScriptService, etc.)
- Physics, animations, particles, and visual effects
- Network replication and RemoteEvents/RemoteFunctions

When asked to build something:
1. First explain what you'll create
2. List the instances/scripts you'll add
3. Provide clean, well-structured Luau code
4. Note any setup requirements

Always generate production-quality Luau code. Use type annotations. Follow Roblox best practices.`;

export async function generateTextResponse(
  message: string,
  modelId?: string,
  token?: string
): Promise<{ text: string; model: AIModel; error?: string }> {
  const taskType = detectTaskType(message);
  const model = modelId
    ? AI_MODELS.find((m) => m.id === modelId) || getBestModelForTask(taskType)
    : getBestModelForTask(taskType);

  const client = getClient(token);

  try {
    const response = await client.chatCompletion({
      model: model.hfId,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
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
      fallbackText = `**${model.name}** requires a HuggingFace token (it's a gated model). Add your token in Settings to use this model.\n\nUsing built-in knowledge instead:\n\n`;
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
  token?: string
): Promise<{ imageUrl: string; model: AIModel; error?: string }> {
  const model = modelId
    ? AI_MODELS.find((m) => m.id === modelId) || getBestModelForTask("image")
    : getBestModelForTask("image");

  const client = getClient(token);

  try {
    const blob = await client.textToImage({
      model: model.hfId,
      inputs: `roblox game asset, ${prompt}, game icon style, vibrant colors`,
    });

    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return { imageUrl, model };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Image generation failed";
    return {
      imageUrl: "",
      model,
      error: `Image generation with ${model.name} failed: ${errorMessage}. Try adding a HuggingFace token in Settings for better access.`,
    };
  }
}

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("obby") || lower.includes("obstacle")) {
    return `## Obby System

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
    return `## Combat System

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

  if (lower.includes("shop") || lower.includes("store") || lower.includes("buy")) {
    return `## Shop System

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
    return `## Pet System

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
    return `## NPC Enemy System

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
    return `## Racing System

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

  return `I'll work on that for you. Let me analyze your request and build the appropriate game systems.

**Processing:** "${message}"

Here's my approach:
1. Analyze your current Studio scene structure
2. Plan the required instances, scripts, and UI elements
3. Generate clean, typed Luau code
4. Create all necessary parts and configurations
5. Sync everything to your Roblox Studio session

\`\`\`lua
-- This is where the generated code will appear
-- The AI model is processing your request...
-- Try specifying a system: combat, shop, pets, NPCs, racing, or obby
\`\`\`

**Tip:** For best results, be specific about what you want. For example:
- "Add a sword with 3-hit combo and special attack"
- "Create a shop with 4 item categories and coin currency"
- "Build an obby with 20 stages and checkpoint saves"`;
}
