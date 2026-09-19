// Auto-generated knowledge base for Roblox game development RAG system.
// Source: roblox-brain, luau-skills, roblox-skills, roblox-dev-skills repos.

export interface KnowledgeChunk {
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ─── LUAU CORE LANGUAGE ──────────────────────────────────────────────────
  {
    category: "luau-core",
    title: "Luau Truthiness, Equality, and Basic Syntax",
    content: `Luau core language rules every Roblox developer must know:

**Truthiness:** Only \`false\` and \`nil\` are falsy. \`0\`, \`""\`, and \`{}\` are ALL truthy -- this trips up JavaScript/Python devs constantly.

**Equality:** No type coercion. \`0 == "0"\` is false. \`1 == true\` is false. Inequality is \`~=\` (not \`!=\`).

**If expressions:** Prefer \`if\` expression over \`condition and a or b\` when \`a\` may be \`false\` or \`nil\`:
\`\`\`luau
local label = if enabled then "On" else "Off"
local sign = if x < 0 then -1 elseif x > 0 then 1 else 0
\`\`\`

**String interpolation:** Use backticks for interpolation:
\`\`\`luau
local message = \\\`{name}: {score}\\\`
\`\`\`

**Compound assignment:** \`+=\`, \`-=\`, \`*=\`, \`/=\` are statements, not expressions.

**NaN detection:** NaN does not equal itself. Test with \`x ~= x\`. NaN defeats \`<\`/\`>\` comparisons.

**Key rules:**
- Prefer \`local\` for variables and functions
- Use 1-based indexing for arrays
- \`continue\` must be the last statement in its block
- \`typeof(value)\` recognizes Roblox datatypes; \`type(value)\` reports the underlying Luau type`,
    keywords: ["luau", "syntax", "truthiness", "equality", "if expression", "string interpolation", "NaN", "falsy", "truthy", "basic", "language", "variable", "local"],
  },

  {
    category: "luau-core",
    title: "Luau Tables: Arrays, Dictionaries, and References",
    content: `Tables are the fundamental data structure in Luau. They can represent sequences, dictionaries, records, sets, objects, or modules.

**Array conventions are 1-based.** \`#array\` is meaningful only for a contiguous sequence without nil gaps.

\`\`\`luau
local sequence = { "first", "second" }
local record = { name = "Ada", score = 10 }
local dictionary: {[number]: string} = {}
dictionary[userId] = "Ada"
local set: {[string]: boolean} = { admin = true }
\`\`\`

**Reference semantics:** Tables are references. Assignment aliases the same table.
\`\`\`luau
local alias = original
alias.score = 20
print(original.score) -- 20 (same table!)
\`\`\`

**Shallow copy:** \`table.clone\` is shallow. Nested tables remain shared:
\`\`\`luau
local copy = table.clone(original)
copy.nested.enabled = false -- ALSO changes original.nested.enabled
\`\`\`

**Key rules:**
- Assigning \`nil\` removes a table key
- Dictionary iteration order is unspecified -- never depend on it
- Dynamic keys require brackets: \`record[field]\`. Dot syntax uses literal identifiers
- \`table.find\` searches array values, returns index or nil
- \`table.sort\` mutates the sequence in place
- \`table.freeze\` prevents writes to that table (not recursively)
- Remove from middle of sequence: \`table.remove(sequence, index)\`
- Iterate backward when removing: \`for i = #seq, 1, -1 do\``,
    keywords: ["table", "array", "dictionary", "reference", "clone", "copy", "freeze", "sequence", "iteration", "pairs", "ipairs", "insert", "remove", "find", "sort"],
  },

  {
    category: "luau-core",
    title: "Luau Functions, Scope, and Multiple Returns",
    content: `**Scope:** A local name is visible from its declaration onward. Forward-declare mutually recursive functions.

\`\`\`luau
local second  -- forward declaration
local function first(value: number)
    if value > 0 then second(value - 1) end
end
function second(value: number)
    if value > 0 then first(value - 1) end
end
\`\`\`

**Multiple return values:**
\`\`\`luau
local function divide(a: number, b: number): (number?, string?)
    if b == 0 then return nil, "division by zero" end
    return a / b, nil
end
local quotient, problem = divide(6, 2)
\`\`\`

**Method syntax:** A colon adds implicit \`self\`:
\`\`\`luau
function object:move(amount)
    self.position += amount
end
object:move(2) -- equivalent to object.move(object, 2)
\`\`\`

Constructors and module functions use dot syntax (\`.\`). Instance methods use colon syntax (\`:\`).

**String patterns** (NOT regex):
\`\`\`luau
local year, month, day = string.match("2026-07-26", "^(%d+)-(%d+)-(%d+)$")
local compact = string.gsub("too   wide", "%s+", " ")
for word in string.gmatch("one two", "%S+") do print(word) end
\`\`\`
Common classes: \`%a\` letters, \`%d\` digits, \`%w\` alphanumeric, \`%s\` whitespace. Uppercase negates.

**Missing arguments become nil; extra arguments are discarded.**`,
    keywords: ["function", "scope", "return", "multiple return", "method", "self", "colon", "dot", "string pattern", "match", "gsub", "gmatch", "closure", "forward declare", "recursive"],
  },

  {
    category: "luau-core",
    title: "Luau Translation Traps from JavaScript and Python",
    content: `Common mistakes when translating from other languages to Luau:

**From JavaScript:**
- \`===\`, \`!==\` do not exist. Use \`==\` and \`~=\`
- \`null\` does not exist. Use \`nil\`
- No optional chaining (\`?.\`), spread (\`...\`), or arrow functions (\`=>\`)
- No array methods like \`.map()\`, \`.filter()\`, \`.forEach()\`
- No \`const\`/\`let\` -- use \`local\` (Luau has a newer \`const\` keyword but it works differently)
- Template literals use backticks but different syntax: \\\`{expr}\\\` not \\\${expr}\`

**From Python:**
- \`None\` does not exist. Use \`nil\`
- Lists are 1-based, not 0-based
- No list comprehensions
- No exceptions (use \`pcall\` for error handling)
- No implicit tuple behavior
- \`and\`/\`or\` work on truthiness, not boolean coercion

**Common traps:**
- \`x or fallback\` tests truthiness, not only absence. It replaces a valid \`false\` value
- \`typeof(value)\` recognizes Roblox datatypes; \`type(value)\` reports underlying Luau type
- Luau string patterns are NOT regular expressions
- Binary data uses the \`buffer\` library: fixed size, 0-based offsets
- For Base64, hashing, compression: use \`EncodingService\` (buffers, not strings)
- JSON encoding/decoding: use \`HttpService:JSONEncode()\` / \`JSONDecode()\``,
    keywords: ["javascript", "python", "translation", "convert", "migrate", "port", "nil", "null", "undefined", "arrow function", "spread", "optional chaining", "list comprehension", "exception", "pcall", "typeof"],
  },

  // ─── LUAU TYPE SYSTEM ───────────────────────────────────────────────────
  {
    category: "luau-types",
    title: "Luau Type System: Annotations, Strictness, and Inference",
    content: `Luau has a gradual type system with three strictness modes:

**Strictness modes:**
- \`--!strict\` -- Use for maintained code. Full type checking
- \`--!nonstrict\` -- Use while transitioning legacy code
- \`--!nocheck\` -- Only for legacy/generated code

**Inference philosophy:** Infer first, annotate boundaries (params, returns, exports). Don't annotate every local.

**Basic types:**
\`\`\`luau
--!strict
local names: {string} = { "Ada", "Lin" }
local scores: {[string]: number} = { Ada = 10, Lin = 12 }

type User = {
    id: number,
    nickname: string?,  -- optional field
}
\`\`\`

**Sealed vs unsealed tables:**
\`\`\`luau
local t = {}          -- unsealed: can add fields
t.x = 1               -- OK

local t: {x: number} = {x = 1}  -- sealed: no new fields
t.y = 2               -- ERROR
\`\`\`
Build tables fully before annotating. Passing/returning seals them.

**Unions and tagged unions:**
\`\`\`luau
local id: string | number = "abc"
type State<T> = {kind: "loading"} | {kind: "ready", value: T} | {kind: "fail", msg: string}
\`\`\`

**Narrowing:** \`typeof\`, \`IsA\`, \`assert\` all narrow types.

**Generics:** \`function first<T>(list: {T}): T?\`

**Type exports:** \`export type Foo = {...}\` at module boundary.

**Casts (::):** Precision tool to narrow inference, never to hide errors.

**Key rule:** Annotations are contracts for the compiler, not proof of runtime validity. Trust boundaries (remotes, DataStores, HttpService) still need runtime checks.`,
    keywords: ["type", "strict", "annotation", "generic", "union", "narrowing", "sealed", "unsealed", "export type", "typeof", "IsA", "cast", "inference", "optional", "type system", "type checking"],
  },

  // ─── LUAU PATTERNS ──────────────────────────────────────────────────────
  {
    category: "luau-patterns",
    title: "Luau Module Patterns and Object Lifecycle",
    content: `Choose the smallest shape for your module:

**Plain functions:** Default for stateless transformation or validation.
**Module with private state:** One explicit subsystem owner. Don't create a manager class just to namespace functions.
**Object with metatable:** Multiple independent values need shared behavior and lifecycle.

\`\`\`luau
-- Module pattern
local HealthSystem = {}

function HealthSystem.damage(entity, amount)
    entity.health = math.max(0, entity.health - amount)
end

return HealthSystem
\`\`\`

**Ownership rules:**
- The code that connects a signal, creates an instance, or starts a task owns cleanup
- Store connections and disconnect them when the owner ends
- Configure an instance before parenting (observers shouldn't see partial state)

**Failure semantics:**
\`\`\`luau
local ok, value = pcall(dataStore.GetAsync, dataStore, key)
if not ok then
    return nil, \\\`read failed: {value}\\\`
end
return value, nil -- value may legitimately be nil
\`\`\`
Don't collapse "call succeeded and returned nil" into "call failed."

**Scheduling:**
- Use \`task.defer\`, \`task.spawn\`, \`task.delay\`, and \`task.cancel\` deliberately
- Avoid legacy \`wait()\` and unjustified polling
- Prefer real state-change signals over polling

**Anti-patterns:** Circular requires, accidental concurrent startup, connections/tasks not cleaned up, client input not routed through networking.`,
    keywords: ["module", "pattern", "lifecycle", "cleanup", "ownership", "pcall", "error handling", "task", "spawn", "defer", "delay", "signal", "connection", "disconnect", "metatable", "object", "constructor"],
  },

  // ─── NETWORKING ─────────────────────────────────────────────────────────
  {
    category: "networking",
    title: "RemoteEvent Validation and Server Authority",
    content: `**Core rule: Treat every client argument as attacker-controlled input.**

Every server handler must validate: type, size, ownership, state, distance, and cooldown.

\`\`\`luau
local function validItemRequest(player: Player, itemId: unknown, amount: unknown): (boolean, string?)
    if typeof(itemId) ~= "string" or #itemId > 40 then
        return false, "bad item id"
    end
    if typeof(amount) ~= "number"
        or amount ~= amount           -- NaN check
        or math.abs(amount) == math.huge  -- infinity check
        or amount % 1 ~= 0            -- integer check
        or amount < 1 or amount > 20 then
        return false, "bad amount"
    end
    local item = ItemDefinitions[itemId]
    if not item or not item.Tradeable then
        return false, "item unavailable"
    end
    return true
end

TradeRemote.OnServerEvent:Connect(function(player, itemId, amount)
    local ok = validItemRequest(player, itemId, amount)
    if not ok then return end
    InventoryService:Remove(player, itemId, amount)
end)
\`\`\`

**Numeric poison checks:** NaN defeats \`<\`/\`>\` comparisons. Reject with \`x ~= x or math.abs(x) == math.huge\`.

**String validation:** \`utf8.len(s)\` returns nil for malformed UTF-8 that would fail DataStore saves.

**Remote types:**
- \`RemoteEvent\` -- reliable, for state changes (inventory, hits, transitions)
- \`UnreliableRemoteEvent\` -- for replaceable data (VFX, aim, particles). 1000-byte limit
- \`RemoteFunction\` -- only for short bounded queries. Avoid for mutations

**The client requests intent. The server calculates outcomes.** Never let the client decide damage, currency, or rewards.`,
    keywords: ["remote", "RemoteEvent", "RemoteFunction", "validate", "validation", "server", "client", "security", "exploit", "NaN", "infinity", "rate limit", "network", "FireServer", "OnServerEvent", "unreliable"],
  },

  {
    category: "networking",
    title: "Per-Player Rate Limiting for Remotes",
    content: `Rate limiting protects the server from remote spam but validation must still reject invalid requests.

\`\`\`luau
local Players = game:GetService("Players")
local lastCall: {[Player]: {[string]: number}} = {}
local intervalByAction = {
    BuyItem = 0.25,
    ClaimQuest = 0.5,
}

local function allowed(player: Player, action: string): boolean
    local now = os.clock()
    local playerCalls = lastCall[player]
    if not playerCalls then
        playerCalls = {}
        lastCall[player] = playerCalls
    end
    local previous = playerCalls[action]
    local interval = intervalByAction[action] or 0.2
    if previous and now - previous < interval then
        return false
    end
    playerCalls[action] = now
    return true
end

-- CRITICAL: Clean up when player leaves
Players.PlayerRemoving:Connect(function(player)
    lastCall[player] = nil
end)
\`\`\`

**Best practices:**
- Use monotonic clock (\`os.clock()\`) for timing
- Clean entries when players leave to prevent memory leaks
- Don't turn normal network jitter into a ban
- Record suspicious behavior and use thresholds
- Don't punish a player for one malformed packet
- Attach limits to actions, not blindly to every remote
- For expensive work, add a token/queue budget beyond simple cooldowns`,
    keywords: ["rate limit", "throttle", "cooldown", "spam", "flood", "remote", "exploit", "anti-cheat", "per-player", "os.clock", "PlayerRemoving"],
  },

  {
    category: "networking",
    title: "Remote Event Types and Payload Best Practices",
    content: `**Choose the right remote type:**

| Type | Use For | Key Rules |
|------|---------|-----------|
| RemoteEvent | Reliable state changes (inventory, hits, purchases) | Not ordered with property replication |
| UnreliableRemoteEvent | Replaceable data (VFX, aim, particles, snapshots) | May be dropped, unordered, 1000-byte limit |
| RemoteFunction | Short request-response queries | Keep callbacks fast, avoid for mutations |

**Payload rules:**
- Keep argument shapes simple: numbers, strings, booleans, vectors, replicated instances, tables with string keys
- Do NOT send functions, metatables, or mixed numeric/string key tables
- Non-replicated objects arrive as \`nil\`
- Payloads are copied across the boundary -- table identity and metatables are lost

**Client-to-Server:** Send player intent or request attempts
**Server-to-Client:** Send authoritative results, UI updates, presentation events
**Server-to-All:** Broadcast validated state changes

\`\`\`luau
-- GOOD: Compact payload, server derives everything
FireWeaponRemote:FireServer(origin, hitPosition, targetId)

-- BAD: Client tells server the outcome
DamageRemote:FireServer(target, 999999) -- exploiter controls damage
\`\`\`

**For VFX/presentation only:**
\`\`\`luau
-- UnreliableRemoteEvent for presentation data
Effects:FireAllClients("MuzzleFlash", muzzlePosition, direction)
\`\`\`

Measure payload size and fire rate under load. A small payload fired every frame can be worse than a larger payload occasionally.`,
    keywords: ["RemoteEvent", "UnreliableRemoteEvent", "RemoteFunction", "payload", "bandwidth", "network", "replication", "FireServer", "FireClient", "FireAllClients", "serialize", "compact"],
  },

  // ─── DATASTORES ─────────────────────────────────────────────────────────
  {
    category: "datastores",
    title: "DataStore Schema Design and Session Management",
    content: `**Schema design:**
\`\`\`luau
local CURRENT_VERSION = 3
local TEMPLATE = {
    version = CURRENT_VERSION,
    coins = 0,
    inventory = {},
    settings = { music = true, sensitivity = 1 },
}

local function cloneTemplate()
    -- Deep-construct: table.clone is SHALLOW and would alias nested tables
    local data = table.clone(TEMPLATE)
    data.inventory = {}
    data.settings = table.clone(TEMPLATE.settings)
    return data
end
\`\`\`

**Critical rules:**
- Always include a \`version\` field for migrations
- Deep-copy templates so nested defaults aren't shared between profiles
- Run migrations before stamping the version
- Never store Instances, functions, connections, threads, or cyclic references
- Before persisting client values: numbers must not be NaN or infinity, strings must pass \`utf8.len\`

**Session ownership:** Prevent two servers from mutating the same profile. Use a wrapper like ProfileStore or implement your own lock protocol with:
- An owner token identifying the live server
- Expiry or heartbeat policy
- Defined behavior for fresh, stale, or ambiguous locks

**Save lifecycle:**
1. Load before enabling gameplay
2. Hold profile in memory while player is active
3. Mark dirty on state changes, autosave at bounded intervals
4. Release/final-save on \`PlayerRemoving\`
5. Flush pending work from \`BindToClose\`

**A failed read is NOT an empty profile.** Keep player in a safe loading state rather than overwriting existing data with defaults.`,
    keywords: ["DataStore", "datastore", "save", "load", "schema", "migration", "version", "profile", "ProfileStore", "session", "lock", "template", "persistence", "player data", "BindToClose", "PlayerRemoving"],
  },

  {
    category: "datastores",
    title: "DataStore UpdateAsync and Migration Patterns",
    content: `**Use UpdateAsync for read-modify-write operations:**

\`\`\`luau
local function migrate(data)
    data = data or cloneTemplate()
    data.version = data.version or 1
    if data.version < 2 then
        data.coins = data.coins or data.gold or 0
        data.gold = nil
        data.version = 2
    end
    if data.version < 3 then
        data.settings = data.settings or { music = true, sensitivity = 1 }
        data.version = 3
    end
    return data
end

local function addCoins(userId: number, amount: number): boolean
    if amount ~= amount or amount == math.huge or amount == -math.huge then
        return false  -- reject NaN/infinity
    end
    if amount % 1 ~= 0 or amount < 0 or amount > 1_000_000 then
        return false
    end
    local ok, committed = pcall(function()
        return store:UpdateAsync("player_" .. tostring(userId), function(old)
            if old ~= nil then
                if type(old) ~= "table" then return nil end  -- unsupported shape
                if (tonumber(old.version) or 0) > CURRENT_VERSION then
                    return nil  -- future schema: don't downgrade
                end
            end
            local data = migrate(old)
            data.coins = (data.coins or 0) + amount
            data.version = CURRENT_VERSION
            return data
        end)
    end)
    return ok and committed ~= nil
end
\`\`\`

**Rules for UpdateAsync transform:**
- Do NOT perform network calls, yield, or mutate external state inside the callback
- Returning \`nil\` cancels the update (stored value unchanged)
- The transform must be deterministic and safe to run more than once
- Always migrate BEFORE mutating data
- If stored version > CURRENT_VERSION, refuse the write

**Retry with bounded backoff:**
\`\`\`luau
local delaySeconds = 1
for attempt = 1, 4 do
    local ok, value = pcall(function() return store:GetAsync(key) end)
    if ok then return true, value end
    task.wait(delaySeconds + math.random() * 0.25)
    delaySeconds *= 2
end
\`\`\``,
    keywords: ["UpdateAsync", "GetAsync", "SetAsync", "migration", "migrate", "version", "schema", "retry", "backoff", "pcall", "DataStore", "transform", "atomic", "read-modify-write"],
  },

  // ─── GUI / UI ───────────────────────────────────────────────────────────
  {
    category: "ui",
    title: "Roblox UI Layout Fundamentals",
    content: `**Container types:**
- \`ScreenGui\` -- 2D screen overlay
- \`SurfaceGui\` -- rendered on a part surface
- \`BillboardGui\` -- camera-facing label in 3D world
- \`ViewportFrame\` -- renders 3D model preview in UI

**Layout-driven design:**
\`\`\`luau
local panel = Instance.new("Frame")
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.Size = UDim2.fromScale(0.8, 0.75)
panel.Parent = screenGui

local padding = Instance.new("UIPadding")
padding.PaddingTop = UDim.new(0, 16)
padding.Parent = panel

local list = Instance.new("UIListLayout")
list.Padding = UDim.new(0, 8)
list.SortOrder = Enum.SortOrder.LayoutOrder
list.Parent = panel
\`\`\`

**Scale vs Offset:**
- \`Scale\` for responsive structure (proportional sizing)
- \`Offset\` for deliberate padding or fixed-size details
- Use \`UISizeConstraint\` to clamp min/max sizes
- Use \`UIAspectRatioConstraint\` for fixed ratios

**Design rules:**
- Design for touch and gamepad as well as mouse/keyboard
- Use \`UIListLayout\`, \`UIGridLayout\`, and constraints for repeated layout
- Avoid per-frame pixel positioning
- Keep important buttons away from corners and system gesture zones
- Use large tap targets for mobile
- Set \`DisplayOrder\` deliberately for overlapping ScreenGuis
- \`ResetOnSpawn\` only when UI should survive character respawn`,
    keywords: ["UI", "GUI", "ScreenGui", "Frame", "layout", "UIListLayout", "UIGridLayout", "UIPadding", "Scale", "Offset", "UDim2", "AnchorPoint", "Position", "Size", "responsive", "mobile", "touch", "gamepad"],
  },

  {
    category: "ui",
    title: "Roblox UI State Management and Server Separation",
    content: `**Critical rule: UI is an input surface, not a trust boundary.** A button click is not an authority boundary.

**Keep UI state separate from server state.** The UI renders a snapshot. The server response determines the final display.

\`\`\`luau
-- Client sends a purchase request with a unique ID
local requestId = HttpService:GenerateGUID(false)
BuyItem:FireServer(requestId, state.selectedId)

-- Listen for server response
PurchaseResult.OnClientEvent:Connect(function(id, ok, message)
    if id ~= state.requestId then return end  -- ignore stale results
    state.requestId = nil
    statusLabel.Text = message
    render()
end)
\`\`\`

**UI state rules:**
- Never grant currency, inventory, or ownership from a button handler
- Correlate each request with an ID
- Treat "no response yet" as bounded unknown, not failure to retry
- A timed-out purchase may still have committed -- blind retry can double-spend
- In Server Authority projects, show predicted state but mark as pending

**Common UI surfaces:**
- HUD: objective, currency, health/energy, progress, next reward
- Upgrade panel: current value, next value, cost, affordability
- Shop: optional offers, clear benefit, no first-session pressure
- Rewards: short celebration, visible delta, next goal
- Settings: audio, graphics/performance, input preferences

**Scrolling content:**
\`\`\`luau
local scroll = Instance.new("ScrollingFrame")
scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y
scroll.CanvasSize = UDim2.fromScale(0, 0)
scroll.ScrollBarThickness = 6
\`\`\``,
    keywords: ["UI state", "server state", "purchase", "request", "response", "button", "shop", "HUD", "inventory", "currency", "scroll", "ScrollingFrame", "trust boundary", "predicted state"],
  },

  {
    category: "ui",
    title: "Roblox UI Limitations and Workarounds",
    content: `Key Roblox UI limitations and their solutions:

**No drop shadows:** Use an offset dark Frame with UICorner and high Transparency.

**No per-element blur:** Only global \`BlurEffect\` in Lighting. Use \`CanvasGroup\` with \`GroupTransparency\` for glass effect.

**UIGradient is linear only:** No radial/conic gradients. No UIGradient on ScrollingFrame or TextBox. Use pre-rendered ImageLabels for radial.

**ClipDescendants broken on rotated elements:** Use \`CanvasGroup\` instead.

**Only 1 layout constraint per parent:** Can't combine UIListLayout + UIGridLayout. Nest Frames instead.

**AutomaticSize circular dependency:** Use \`AutomaticSize = Enum.AutomaticSize.Y\` only with \`TextWrapped\`.

**No native SVG:** Rasterize to high-res PNG and upload.

**ViewportFrame is expensive:** Limit to 3-5 simultaneous frames.

**Performance limits:**
| Metric | Practical Limit |
|--------|----------------|
| Active GuiObjects | ~500-1,000 |
| CanvasGroup VRAM | ~8MB per 1920x1080 |
| AutomaticSize labels | ~50 before stutter |
| ViewportFrames | 3-5 active |

**React-Lua specific:**
- No \`Suspense\`, \`lazy\`, \`useTransition\` -- use \`task.spawn\` or Promise for async
- Use \`React.useBinding\` for frequent visual updates without full reconciliation
- No official React DevTools -- use \`debug.profilebegin/end\` and MicroProfiler

**Impossible in Roblox UI:** Per-element blur, UIGradient on ScrollingFrame/TextBox, radial/conic UIGradient, React.Suspense/lazy, ClipDescendants on rotated elements.`,
    keywords: ["UI limitation", "shadow", "blur", "gradient", "UIGradient", "ClipDescendants", "CanvasGroup", "ViewportFrame", "performance", "mobile", "AutomaticSize", "SVG", "React-Lua", "workaround"],
  },

  // ─── ARCHITECTURE ───────────────────────────────────────────────────────
  {
    category: "architecture",
    title: "Roblox Game Architecture and Code Organization",
    content: `**Script placement rules:**
- \`ServerScriptService\` -- Authoritative game logic, server-only modules
- \`ReplicatedStorage\` -- Shared constants, type definitions, remotes, pure helpers
- Client scripts -- Player input, camera, local-only UI, visual prediction
- Shared code contains NO secrets or authoritative mutable state (clients can read it)

**For each behavior, define:**
- Authoritative state and who may mutate it
- Public operations and callers
- Roblox instances, connections, and tasks it owns
- Persistence or network boundary
- Startup and teardown conditions

**Dependency rules:**
- Direct module calls are the default for stable dependencies
- Use signals only when one publisher has genuinely independent observers
- Do NOT add global event buses, dependency containers, or manager classes
- Keep module top-level work cheap and non-yielding
- Call ordered startup sequentially and fail visibly
- Bound \`WaitForChild\` with timeout -- unbounded wait = silent hang

**Deep modules over shallow modules:**
- A lot of behavior behind a small, stable interface
- Name modules from the game's vocabulary ("coin economy service") not generics ("Handler", "Manager")
- Deletion test: if removing a module makes complexity vanish, it was pass-through -- inline it

**Split only when there is:**
- A separate lifecycle or authority boundary
- A distinct persistence contract
- An independently testable pure core
- Unrelated reasons to change`,
    keywords: ["architecture", "organization", "ServerScriptService", "ReplicatedStorage", "module", "dependency", "startup", "WaitForChild", "script placement", "code structure", "separation", "client", "server", "shared"],
  },

  {
    category: "architecture",
    title: "Roblox Client-Server Runtime Model",
    content: `Roblox experiences are multiplayer by default and run in a client-server model.

**The server is the authority** for shared experience state and keeps clients synchronized through replication.

**Divide responsibility by runtime side:**
- **Server:** Spawn world objects, validate state changes, manage shared state, calculate rewards
- **Client:** Read controls, drive camera, show local feedback, react to replicated state
- **Shared:** Constants and pure helpers in ReplicatedStorage modules

\`\`\`luau
-- Shared constant module (ReplicatedStorage)
local Config = {
    WalkSpeed = 16,
    MaxHealth = 100,
}
return Config
\`\`\`

**Replication rules:**
- Server-created instances may not be available to clients immediately
- Client code should use \`WaitForChild()\` when load order is uncertain
- Do not assume property changes and signals arrive in the same order
- With streaming enabled, \`FindFirstChild("DistantPart")\` returns nil if streamed out

**ModuleScript rules:**
- Runs once per Luau environment, returns a cached value
- Return exactly one non-nil value
- Require once per script, reuse the reference
- Avoid circular requires
- Put modules in replicated or server-only containers based on who needs them

\`\`\`luau
-- Basic module shape
local module = {}
function module.greet(name)
    return "Hello, " .. name
end
return module
\`\`\``,
    keywords: ["client-server", "replication", "server authority", "ModuleScript", "require", "WaitForChild", "ReplicatedStorage", "ServerScriptService", "streaming", "multiplayer", "runtime"],
  },

  // ─── COMBAT SYSTEMS ─────────────────────────────────────────────────────
  {
    category: "combat",
    title: "Roblox Combat System Design and Server Authority",
    content: `**Combat authority model:**
- Client requests: intent, animation, aim direction, target candidate
- Server validates: range, cooldown, line of sight, team, state, damage
- Server decides: final hit, damage amount, reward, kill credit, loot
- NEVER let the client decide damage, rewards, or kill credit

\`\`\`luau
-- BAD: Client controls damage
DamageRemote.OnServerEvent:Connect(function(player, target, damage)
    target.Humanoid:TakeDamage(damage) -- exploiter sends 999999
end)

-- GOOD: Server computes damage
AttackRemote.OnServerEvent:Connect(function(player, targetId)
    local weapon = getEquippedWeapon(player)
    if not weapon then return end
    local target = resolveTarget(targetId)
    if not target then return end
    if not isInRange(player, target, weapon.Range) then return end
    if not checkCooldown(player, weapon) then return end
    local damage = weapon.BaseDamage * getDamageMultiplier(player)
    target.Humanoid:TakeDamage(damage)
end)
\`\`\`

**Combat loop design:**
1. Anticipation (wind-up animation, tells)
2. Action (attack executes)
3. Impact (hit confirmation, VFX/SFX)
4. Recovery (cooldown, return to idle)

**Implementation areas:**
- Hitboxes and raycasts for hit detection
- Cooldown and stamina/energy systems
- Damage types and modifiers (fire, ice, critical)
- Status effects with duration, stacking, and cleanup
- Enemy AI target selection and leash rules
- Reward grants tied to server-confirmed contribution

**Feedback:** Clear feedback for hit, miss, crit, block, dodge, and death. Enemy tells and fair counterplay. Early encounters that teach through safe repetition.`,
    keywords: ["combat", "damage", "attack", "weapon", "hitbox", "raycast", "cooldown", "stamina", "health", "melee", "ranged", "ability", "status effect", "enemy", "AI", "fight", "battle", "PvP", "PvE"],
  },

  // ─── QUEST / PROGRESSION ────────────────────────────────────────────────
  {
    category: "quest-progression",
    title: "Quest and Progression System Design",
    content: `**Progression layers:**
- **Immediate:** First reward, first upgrade, first objective complete
- **Session:** Quest chain, zone unlock, collection progress
- **Multi-day:** Daily streak, weekly challenge, Day 7 reward
- **Long-term:** Prestige, mastery, rare collections, leaderboards, social status

**Quest design rules:**
- Use objectives that reinforce the core loop
- Show current objective and next reward in the HUD
- Avoid vague objectives that require menu hunting
- Reward every cycle, but reserve big unlocks for meaningful milestones
- Unlock new content near the 2-3 hour mark to fight the Day 3 retention wall

**Implementation rules:**
- Track canonical quest progress on the SERVER
- Validate all client-reported actions against server state
- Separate objective definitions from player progress
- Make reward claims idempotent (safe to call multiple times)
- Save progress through DataStore-backed profile state

**Retention impact:**
- Day 1: Clear first objective, first reward, first upgrade
- Day 3: New content unlock, meaningful progression choice
- Day 7: Major milestone reward, social status unlock

**Output for quest system:**
- Progression ladder (what unlocks when)
- Objective definitions (separate from player state)
- Reward and claim flow (server-validated)
- Save requirements (what persists in DataStore)`,
    keywords: ["quest", "progression", "objective", "reward", "daily", "weekly", "streak", "achievement", "unlock", "prestige", "milestone", "retention", "Day 1", "Day 3", "Day 7", "level", "experience", "XP"],
  },

  // ─── ECONOMY ────────────────────────────────────────────────────────────
  {
    category: "economy",
    title: "Roblox Game Economy Design and Balancing",
    content: `**Economy map -- define all flows:**

**Sources (where currency comes from):**
- Core loop rewards, quests, streaks, events, social rewards, purchases

**Sinks (where currency goes):**
- Upgrades, crafting, cosmetics, rerolls, prestige, entry fees, repairs

**Multipliers:**
- Boosts, VIP, game passes, events, group/friend bonuses

**Gates:**
- Zones, levels, equipment, quests, timers

**Balance rules:**
- Reward every loop, but keep meaningful upgrades paced
- Make early upgrades fast and satisfying
- Avoid runaway compounding that destroys long-term goals
- Add enough sinks BEFORE adding large sources
- Keep premium boosts convenient, not mandatory
- Preserve social fairness and competitive integrity

**Progression curves:**
- Early: Quick wins and teaching (first 30 minutes)
- Mid: Visible planning and choice (hours 1-3)
- Late: Prestige, collections, rarity, social flex (day 3+)

**Watch for the 2-3 hour content wall** -- add meaningful unlocks before it.

**Monetization fairness:**
- Premium currency should provide convenience, not power
- No pay-to-win pressure in competitive modes
- Game passes for permanent perks, Developer Products for consumables
- Show clear benefit of purchases without first-session pressure`,
    keywords: ["economy", "currency", "coins", "gold", "money", "shop", "store", "purchase", "price", "cost", "upgrade", "sink", "source", "balance", "inflation", "monetization", "Robux", "game pass", "developer product"],
  },

  // ─── SECURITY ───────────────────────────────────────────────────────────
  {
    category: "security",
    title: "Roblox Security: Anti-Exploit and Server Authority",
    content: `**Core principle: The client is compromised. Always.** Exploiters run arbitrary Luau on the client. Every LocalScript and ReplicatedStorage module is readable/writable by attackers.

**Security audit checklist:**

CRITICAL (game-breaking if missing):
- All game state is server-authoritative
- All RemoteEvent handlers validate types of EVERY argument
- All RemoteEvent handlers have rate limiting
- DataStore operations use session locking
- No client-side currency/inventory mutations
- MarketplaceService purchases verified via ProcessReceipt
- No sensitive logic in LocalScripts or ReplicatedStorage

HIGH (exploitable if missing):
- Custom movement validated without fighting authority model
- BindToClose saves protected against data loss
- Trading uses atomic operations
- No trusting client-reported values

**Common exploit vectors and mitigations:**
| Attack | Mitigation |
|--------|-----------|
| Remote spam | Per-player rate limiter |
| Argument spoofing | Validate every argument type and range |
| Item duplication | Session locking, atomic operations |
| Negative purchase | Validate quantity > 0 server-side |
| Transaction replay | Unique transaction IDs |
| DataStore rollback | Session locking with server JobId |
| NaN injection | Reject \`x ~= x\` at remote boundary |
| Malformed UTF-8 | \`utf8.len(s)\` before DataStore save |

**Anti-patterns:** Don't obfuscate client code, use \`_G\` for security, kick without logging, or rely on client anti-cheat.`,
    keywords: ["security", "exploit", "anti-cheat", "hack", "cheat", "vulnerability", "audit", "server authority", "validation", "rate limit", "duplication", "dupe", "injection", "ProcessReceipt", "session lock"],
  },

  {
    category: "security",
    title: "Economy Security: Protecting Valuable Game State",
    content: `**High-risk surfaces that need server protection:**
- Currency and premium currency
- Inventory, pets, skins, tools, boosts, quest rewards
- Trading, gifting, crafting, upgrades, prestige, loot rolls
- Developer product receipts and game pass checks
- Daily rewards, streaks, event rewards

**Server authority rules:**
- Calculate rewards on the server
- Validate player eligibility on the server
- Store canonical balances and inventory on the server
- Treat client UI as display and intent only
- Use idempotency for purchases and valuable grants
- Reject malformed, replayed, impossible, or too-frequent remote requests

**Trading and gifting security:**
- Use server-owned trade sessions
- Lock offered items while trade is pending
- Require both parties to confirm exact final offer
- Revalidate ownership immediately before commit
- Commit atomically from server state
- Log valuable trades for investigation

**DataStore and receipt patterns:**
- Save compact canonical state, not UI state
- Use versioned schemas with migration guards
- Queue or debounce saves during active sessions
- Bind saves to player leaving AND server shutdown
- For developer products: grant through receipt processing, record processed purchase IDs before considering transaction complete`,
    keywords: ["economy security", "trading", "gifting", "purchase", "receipt", "ProcessReceipt", "developer product", "game pass", "currency", "inventory", "duplication", "atomic", "idempotent", "server authority"],
  },

  // ─── PERFORMANCE ────────────────────────────────────────────────────────
  {
    category: "performance",
    title: "Roblox Performance Profiling and Optimization",
    content: `**Profiling tools:**
- **MicroProfiler (Ctrl+F6):** Per-frame breakdown of scripts, physics, rendering
- **Developer Console (F9):** Memory, network, render stats
- **Script Profiler (Ctrl+Alt+F5):** Per-script CPU and heap allocations

**Performance targets:**
| Metric | Target | Investigate At |
|--------|--------|---------------|
| Server heartbeat | < 16ms | > 33ms |
| Client FPS (desktop) | 60 | < 30 |
| Client FPS (mobile) | 45 | < 30 |
| Memory | device-specific | sustained growth |

**Optimization targets:**
- Instance count and deeply nested hierarchies
- Unanchored parts causing physics cost
- Excessive constraints, touched events, or per-frame loops
- Large textures, too many unique materials, high-poly meshes
- Particle emitters with high rate/lifetime
- Dynamic lights, shadows, post-processing
- Scripts connecting events repeatedly or leaving stale connections

**Object pooling pattern:**
\`\`\`luau
local obj, lease = pool:get()
-- use obj...
pool:release(obj, lease)
\`\`\`

**StreamingEnabled essentials:**
- On by default for Workspace descendants
- Streamed-out = parented to nil, NOT destroyed
- \`FindFirstChild("DistantPart")\` returns nil if streamed out
- Use \`WaitForChild\` with timeout for distant objects

**Mobile optimization:**
- Profile on low-end phones
- Keep first area technically cheap but visually strong
- Use Level of Detail for distant props
- Avoid per-frame layout work in UI
- Test phones and tablet viewports, not just desktop Studio`,
    keywords: ["performance", "optimization", "FPS", "lag", "memory", "MicroProfiler", "profiling", "streaming", "StreamingEnabled", "mobile", "pool", "pooling", "heartbeat", "frame rate", "physics", "render"],
  },

  {
    category: "performance",
    title: "Parallel Luau and Advanced Performance Patterns",
    content: `**Parallel Luau:**
- Use Actors only AFTER profiling identifies isolatable CPU work
- Workers compute; synchronize before restricted DataModel writes
- SharedTable and mutexes add coordination cost
- They do NOT replace ownership boundaries

**When to optimize:**
- "Expensive" means the profiler shows it on a hot frame path
- Throttle by judgment from measurements, not universal numbers
- Re-measure after shipping: profile before and after on representative devices
- Confirm the targeted metric moved without regressions

**Mobile budget habits:**
- Build the first area to be visually strong but technically cheap
- Prefer fewer meaningful effects over many constant effects
- Use Level of Detail thinking for distant props
- Keep UI lightweight -- avoid per-frame layout work
- Test phones and tablet-like viewport sizes, not only desktop Studio

**Scene optimization targets:**
- Instance count and deeply nested hierarchies
- Unanchored parts causing unnecessary physics cost
- Excessive constraints, touched events, or per-frame loops
- Large textures, too many unique materials, high-poly meshes
- Particle emitters with high rate/lifetime combinations
- Dynamic lights, shadows, post-processing, and expensive transparency
- Scripts that connect events repeatedly or leave stale connections
- Workspace content that should stream or load later

**Profile BEFORE optimizing.** Don't guess where the bottleneck is.`,
    keywords: ["parallel", "Luau", "Actor", "SharedTable", "optimization", "mobile", "budget", "instance count", "physics", "particles", "texture", "mesh", "Level of Detail", "LOD", "streaming"],
  },

  // ─── BUILDING 3D OBJECTS ────────────────────────────────────────────────
  {
    category: "building",
    title: "Building 3D Objects in Roblox: CSG and Part Placement",
    content: `**Build process (4 phases):**
1. **Assess:** Know components, scale, and if static/moving
2. **Plan:** Establish coordinate system and dimension variables
3. **Build:** Generate geometry with CSG operations
4. **Verify:** Run validation script, fix errors

**CSG (Constructive Solid Geometry) rules:**
\`\`\`luau
-- EPSILON rule: cutters must slightly overlap boundaries
local EPSILON = 0.05
local holeCutter = Instance.new("Part")
holeCutter.Size = Vector3.new(2, 2, 1 + (EPSILON * 2))

-- Safe CSG execution wrapper
local success, result = pcall(function()
    return basePart:SubtractAsync({cutterPart})
end)
if success and result and result:IsA("BasePart") then
    result.CFrame = basePart.CFrame  -- Copy exact CFrame
    result.UsePartColor = true       -- Re-apply color
    result.Color = basePart.Color
    result.Material = basePart.Material
    result.Anchored = true
    result.Parent = basePart.Parent
    basePart:Destroy()
end
cutterPart:Destroy()  -- Always cleanup cutters
\`\`\`

**Player scale reference:**
Player ~5 studs | Door 4w x 7h | Ceiling 10-14 | Counter 3.5-4 | Seat 1.5 | Path 6+

**Critical rules:**
- Always set \`Anchored = true\` unless physics simulation is intended
- All sub-positions MUST be relative to a parent CFrame, never hardcoded world coordinates
- Snap dimensions to 0.125/0.25/0.5 studs to avoid floating-point drift
- Build complex CSG near origin, then \`PivotTo\` the destination
- \`SubtractAsync\`/\`UnionAsync\` ONLY work on \`Part\` and \`PartOperation\`, NOT \`MeshPart\`

**Anti-patterns:** Guessing coordinates, unanchored parts, hardcoded world positions, silent CSG failure, oversized batches.`,
    keywords: ["build", "3D", "object", "part", "CSG", "union", "subtract", "SubtractAsync", "UnionAsync", "CFrame", "position", "size", "anchor", "model", "prop", "furniture", "geometry", "stud"],
  },

  {
    category: "building",
    title: "Roblox Platform-Specific Building Rules",
    content: `**Cylinder orientation:**
Cylinders extend along the X-axis by default. To make upright:
\`\`\`luau
local pillar = Instance.new("Part")
pillar.Shape = Enum.PartType.Cylinder
pillar.Size = Vector3.new(10, 2, 2)  -- (Length, Diameter, Diameter)
pillar.CFrame = CFrame.new(0, 5, 0) * CFrame.Angles(0, 0, math.pi/2)
\`\`\`

**WedgePart orientation:**
Default tip points toward +Z. To point UP:
\`\`\`luau
local tip = Instance.new("WedgePart")
tip.Size = Vector3.new(0.3, 1.0, 0.3)
tip.CFrame = baseCFrame * CFrame.new(0, offset, 0) * CFrame.Angles(-math.pi/2, 0, 0)
\`\`\`
| Desired Direction | Rotation |
|---|---|
| +Y (up) | \`CFrame.Angles(-math.pi/2, 0, 0)\` |
| -Y (down) | \`CFrame.Angles(math.pi/2, 0, 0)\` |
| +Z (forward) | no rotation needed |

**Neon material:** Does NOT cast dynamic light. Add a PointLight/SpotLight/SurfaceLight:
\`\`\`luau
local lamp = Instance.new("Part")
lamp.Material = Enum.Material.Neon
local light = Instance.new("PointLight")
light.Range = 15
light.Brightness = 2
light.Parent = lamp
\`\`\`

**Always set explicitly:**
- \`Anchored = true\` (defaults to false!)
- \`CanCollide = true\` (or false for decorative)
- \`CastShadow = true\` (or false for triggers/neon)

**CSG precision:** Floating-point degrades far from origin. Build near \`CFrame.new(0,0,0)\`, then \`PivotTo()\` final location.

**Collision fidelity:** For decorative Unions, set \`CollisionFidelity = Enum.CollisionFidelity.Box\` to save performance.`,
    keywords: ["cylinder", "wedge", "WedgePart", "CFrame", "rotation", "Angles", "neon", "light", "PointLight", "material", "anchored", "collision", "fidelity", "building", "orientation", "platform"],
  },

  {
    category: "building",
    title: "Building Maps and Multi-Zone Environments",
    content: `**Map build process (6 phases):**
1. **Layout Planning:** Define scale, gameplay type, zone breakdown
2. **Ground & Boundaries:** Floor planes, boundary walls, Origin anchor
3. **Zone Shells:** Floor sections, major walls, dividers (relative to Origin)
4. **Landmarks:** Towers, fountains, key structures for orientation
5. **Zone Fill:** Props, furniture, vegetation per zone
6. **Environment:** Lighting, atmosphere, spawn locations

**Folder organization:**
\`\`\`
workspace/
  MapName/              -- MapRoot (Folder)
    Origin              -- invisible anchor part (0,0,0)
    Terrain/            -- ground planes, terrain features
    Zone_A/             -- named zone (Folder)
      Floor / Walls / Props
    Zone_B/
    Landmarks/          -- major visual anchors
    Lighting/           -- ambient sources
    Spawns/             -- SpawnLocation instances
\`\`\`

**Critical rules:**
- All zone offsets MUST be relative to the Origin CFrame
- Differentiate zones with distinct materials, colors, or landmarks
- Main paths must be 10+ studs wide (6 stud minimum for any path)
- All structures must connect to the ground plane
- Don't build entire map in one script call -- split by phase/zone

**Scale checklist:**
- Total size defined? (100x100 arena vs 2000x2000 city)
- Gameplay type defined? (flat lobby vs vertical parkour)
- Specific zones listed? ("town with spawn plaza, 3 houses, shop")

**Environment settings:**
- \`Lighting.ClockTime\` / \`TimeOfDay\`
- \`Atmosphere\` (Density, Offset, Color, Decay, Glare, Haze)
- \`SpawnLocation\` on solid ground facing first objective`,
    keywords: ["map", "level", "zone", "environment", "terrain", "spawn", "lobby", "arena", "hub", "town", "world", "landmark", "lighting", "atmosphere", "layout", "level design", "path", "navigation"],
  },

  // ─── SPATIAL PATTERNS ───────────────────────────────────────────────────
  {
    category: "building",
    title: "Spatial Patterns: Coordinate Systems and Relative Positioning",
    content: `When building complex objects (multi-call or >5 parts), use these patterns:

**1. Geometric manifest -- declare all dimensions as named variables:**
\`\`\`luau
local DeskDef = {
    Width = 6.0,
    Depth = 3.0,
    Height = 2.8,
    TopThickness = 0.2,
    LegSize = 0.3,
    LegOffset = 0.1,
}
\`\`\`

**2. Anchor pattern -- position everything relative to one anchor part:**
\`\`\`luau
local top = Instance.new("Part")
top.Size = Vector3.new(DeskDef.Width, DeskDef.TopThickness, DeskDef.Depth)
top.Position = Vector3.new(0, DeskDef.Height - (DeskDef.TopThickness/2), 0)

-- Calculate leg position RELATIVE to anchor
local offsetX = (DeskDef.Width/2) - (DeskDef.LegSize/2) - DeskDef.LegOffset
local offsetY = -(DeskDef.TopThickness/2) - (legHeight/2)
leg.CFrame = top.CFrame * CFrame.new(offsetX, offsetY, offsetZ)
\`\`\`

**3. Grid snapping:** Snap all dimensions to consistent grid (0.125, 0.25, or 0.5 studs). Avoid arbitrary decimals like 0.333333 that compound into visible gaps.

**MCP stateless execution pattern:**
\`\`\`luau
-- MUST be at the start of EVERY run_code call
local model = workspace:FindFirstChild("MyDesk")
if not model then
    model = Instance.new("Model")
    model.Name = "MyDesk"
    model.Parent = workspace
end
\`\`\`

**Ground truth rule:** Never guess coordinates from memory. Always query \`workspace\` to read the current CFrame and Size before calculating new offsets.`,
    keywords: ["spatial", "coordinate", "CFrame", "position", "offset", "relative", "anchor", "grid", "snap", "manifest", "dimension", "scale", "stud", "Vector3", "MCP", "run_code"],
  },

  // ─── WORLD / LEVEL DESIGN ──────────────────────────────────────────────
  {
    category: "world-design",
    title: "Roblox World and Level Design Principles",
    content: `**Spatial flow design:**
- Spawn facing the first objective or landmark
- First action reachable within 10-30 seconds
- Clear routes using shape, color, lighting, motion, and landmarks
- Short loops that bring players back to rewards, upgrades, or social areas
- New zones that visibly tease future goals
- Safe space before challenge space

**Landmarks and readability:**
- Give each zone a readable silhouette and color identity
- Use tall or distinct landmarks to orient players
- Keep important interactables visually louder than decoration
- Avoid clutter that hides objectives or enemies
- Make paths understandable without walls of text

**Gameplay placement:**
- Objectives where players naturally look and move
- Rewards immediately after effort
- Shops and upgrades near loop return points
- Social spaces where players can show progress
- Bosses/challenges after preparation cues
- Hidden secrets off the main path, not on onboarding

**Performance-aware layout:**
- Stream or stage distant content
- Avoid over-dense prop clusters in first playable area
- Keep expensive particles, transparency, physics, lights intentional
- Use occlusion, terrain shape, and zone gates to control visual complexity

**Mobile considerations:**
- Keep draw calls low in the initial spawn area
- Use LOD for distant props
- Test on phone-sized viewports`,
    keywords: ["world", "level design", "spatial", "flow", "landmark", "zone", "spawn", "navigation", "path", "onboarding", "first action", "layout", "biome", "arena", "hub", "exploration"],
  },

  // ─── REACT-LUA / UI MASTERY ─────────────────────────────────────────────
  {
    category: "ui",
    title: "React-Lua Component Patterns for Roblox UI",
    content: `**Core rules for React-Lua:**
1. Use \`--!strict\` on all files with type annotations
2. Binding = animation (no re-render), State = logic
3. Use design system tokens, not hardcoded colors/sizes
4. \`useEffect\` must always return a cleanup function
5. \`React.memo\` for list items, \`useCallback\` for event handlers passed to memo'd children

**Binding vs State decision:**
- Value changes >1/sec AND purely visual (position/size/transparency)? -> Binding
- Otherwise -> State (with throttle if needed)

**createElement syntax (no JSX in Luau):**
\`\`\`luau
React.createElement("Frame", {
    Size = UDim2.fromScale(1, 1),
    BackgroundTransparency = 1,
    [React.Event.Activated] = function() end,
    ref = myRef,
}, {
    Corner = React.createElement("UICorner", { CornerRadius = UDim.new(0, 8) }),
    Label = React.createElement("TextLabel", { Text = "Hello" }),
    Badge = showBadge and React.createElement("Frame", {}) or nil,
})
\`\`\`

**Children use STRING keys, not array indices.** Stable keys are critical:
- Static: "Corner", "Layout", "Stroke", "Padding"
- Dynamic: "Player_" .. player.id, "Tab_" .. tabName
- Conditional: \`AdminBadge = isAdmin and elem or nil\`

**Bad keys cause full remount on reorder!**

**Key patterns:** Compound Component (Tabs), Slot Pattern (Card with header/body/footer), Portal (toasts/overlays), Fragment (sibling grouping), forwardRef (parent needs Instance access).`,
    keywords: ["React", "React-Lua", "Roact", "component", "createElement", "useState", "useEffect", "useCallback", "memo", "Binding", "hook", "portal", "fragment", "forwardRef", "compound component", "slot"],
  },

  {
    category: "ui",
    title: "React-Lua Compound Component Pattern: Tabs Example",
    content: `The Compound Component pattern lets multiple sub-components share implicit state through Context. The root owns state; sub-components consume without prop-drilling.

\`\`\`luau
--!strict
-- Tab compound component
local TabContext = React.createContext({
    activeTab = "",
    setActiveTab = function(_tab: string) end,
})

local function TabRoot(props: TabRootProps): React.ReactElement
    local activeTab, setActiveTab = React.useState(props.defaultTab)
    return React.createElement(TabContext.Provider, {
        value = { activeTab = activeTab, setActiveTab = setActiveTab },
    }, React.createElement("Frame", {
        Size = UDim2.fromScale(1, 1),
        BackgroundTransparency = 1,
    }, props.children))
end

local function TabPanel(props: TabPanelProps): React.ReactElement?
    local ctx = React.useContext(TabContext)
    if ctx.activeTab ~= props.tabId then return nil end
    return React.createElement("Frame", {
        Size = UDim2.new(1, 0, 1, -44),
        BackgroundTransparency = 1,
    }, props.children)
end

-- Usage:
React.createElement(Tab.Root, { defaultTab = "Audio" }, {
    List = React.createElement(Tab.List, { tabs = {"Audio", "Graphics"} }),
    AudioPanel = React.createElement(Tab.Panel, { tabId = "Audio" }, { ... }),
    GraphicsPanel = React.createElement(Tab.Panel, { tabId = "Graphics" }, { ... }),
})
\`\`\`

**Use when:** Multiple cooperating sub-parts (Tabs, Accordion, Dropdown, Stepper).
**Don't use when:** A single \`activeTab\` prop suffices.

**Other patterns:** Slot (header/body/footer regions), Render Props (inject hover/focus state), Portal (escape ScreenGui for toasts/overlays).`,
    keywords: ["compound component", "Tab", "Accordion", "Dropdown", "Context", "Provider", "useContext", "React-Lua", "pattern", "sub-component", "state sharing", "prop drilling"],
  },

  // ─── SOCIAL SYSTEMS ─────────────────────────────────────────────────────
  {
    category: "social",
    title: "Roblox Social Systems for Retention",
    content: `**Social connection is one of the strongest retention multipliers.**

**First-session social hooks:**
- Visible other players doing the core loop
- Co-op objective or shared reward
- Friend boost or group bonus (don't punish solo players)
- Public celebration for level up, rare drop, boss defeat
- Simple invite or help-request moment

**System patterns:**
- **Parties:** Shared objectives, teleport together, contribution rewards
- **Groups/Clans:** Identity, weekly goals, group upgrades, leaderboards
- **Trading/Gifting:** Server-owned sessions, locked offers, double confirmation
- **Leaderboards:** Reward participation as well as mastery
- **Commendations:** Lightweight positive feedback after co-op play

**Safety rules:**
- Validate ALL player-to-player value exchange on server
- Rate limit invite, gift, and trade requests
- Add audit logs for valuable exchanges
- Avoid designs enabling harassment, spam, or coercive monetization

**Trading security pattern:**
1. Server creates trade session
2. Both players add items (server validates ownership)
3. Items locked while trade pending
4. Both players confirm exact final offer
5. Server revalidates ownership immediately before commit
6. Atomic commit from server state
7. Log the trade for investigation`,
    keywords: ["social", "party", "clan", "group", "friend", "invite", "trade", "trading", "gifting", "leaderboard", "co-op", "multiplayer", "retention", "community", "commendation"],
  },

  // ─── UI IMPLEMENTATION ──────────────────────────────────────────────────
  {
    category: "ui",
    title: "Roblox UI Implementation: Mobile-First Design",
    content: `**Design phone-first.** Every UI surface must work on mobile before considering desktop.

**Layout rules:**
- Use \`UIScale\`, constraints, and anchors deliberately
- Keep important buttons away from corners and system gesture zones
- Use large tap targets (minimum 44x44 points)
- Clear pressed/disabled/loading states on all buttons
- Avoid text that can overflow in small buttons
- Keep core HUD visible without blocking the playfield

**Common surfaces:**
- **HUD:** Objective, currency, health/energy, progress, next reward
- **Upgrade panel:** Current value, next value, cost, affordability indicator
- **Shop:** Optional offers, clear benefit, no first-session pressure
- **Rewards:** Short celebration, visible delta, next goal
- **Settings:** Audio, graphics/performance, input preferences

**Architecture:**
- Keep UI construction and state updates in client-side controllers
- Keep reward/purchase/inventory decisions on the SERVER
- Put shared UI constants in ReplicatedStorage
- Use remotes to request actions, not to grant value

**Verification checklist:**
- Text fits on mobile screens
- Buttons have obvious affordances and state
- UI does not block first action
- Valuable actions are server-validated
- Empty/loading/error states all handled
- No new console errors

**Build every state the design brief specifies:** default, empty, loading, error, and permission/locked.`,
    keywords: ["mobile", "phone", "touch", "tap target", "responsive", "HUD", "menu", "button", "shop", "upgrade", "reward", "settings", "UI implementation", "layout", "phone-first"],
  },

  // ─── DATASTORE PERSISTENCE ──────────────────────────────────────────────
  {
    category: "datastores",
    title: "DataStore Save Strategy and Valuable State Protection",
    content: `**Save strategy:**
- Load once when the player joins
- Keep in-memory authoritative profile on the server
- Save on meaningful intervals and player leave
- Save on server shutdown with bounded timeout via \`BindToClose\`
- Debounce rapid save requests
- Retry transient failures with backoff
- Mark dirty profiles, avoid unnecessary writes

**Valuable state (treat carefully):**
- Currency and premium currency
- Inventory, pets, cosmetics, boosts
- Quest progress and achievements
- Purchases and receipt-granted items
- Trading or gifting results
- Daily streaks and time-gated rewards

**Schema rules:**
- Store compact canonical state, not UI state
- Include \`schemaVersion\` field
- Keep defaults centralized
- Validate loaded data before using it
- Write migrations that handle old, missing, or partial data
- Keep transient match/session state SEPARATE from permanent profile state

**BindToClose pattern:**
\`\`\`luau
game:BindToClose(function()
    -- Save all active profiles within shutdown window
    local threads = {}
    for _, player in Players:GetPlayers() do
        table.insert(threads, task.spawn(function()
            saveProfile(player)
        end))
    end
    -- Wait for all saves to complete (bounded by Roblox shutdown timer)
end)
\`\`\`

**A failed read is NOT an empty profile.** Never overwrite existing data with defaults because a read failed.`,
    keywords: ["save", "load", "BindToClose", "PlayerRemoving", "shutdown", "autosave", "dirty", "profile", "valuable state", "currency", "inventory", "schema", "migration", "retry", "backoff"],
  },

  // ─── ADDITIONAL ARCHITECTURE ────────────────────────────────────────────
  {
    category: "architecture",
    title: "Roblox Remote Boundaries and Module Design",
    content: `**Remote boundary design:**
- Treat every client remote payload as untrusted
- Prefer narrow remotes with explicit action names and typed payload checks
- Rate-limit player-triggered remotes affecting economy, inventory, combat, or placement
- Use RemoteFunctions sparingly; avoid long-yielding server calls
- Never let the client decide currency, inventory, ownership, damage, quest completion, or purchase grants

**Module pattern for services:**
\`\`\`luau
-- Services with Init/Start lifecycle
local CombatService = {}

function CombatService.Init()
    -- Setup connections, load data
end

function CombatService.Start()
    -- Begin processing after all services initialized
end

return CombatService
\`\`\`

**Deep modules principle:**
- A lot of behavior behind a small, stable interface
- If removing a module makes complexity vanish, it was pass-through -- inline it
- If the same complexity reappears across call sites, keep the module
- One adapter satisfying an interface is a hypothetical seam; two is real
- Name modules from game vocabulary: "CoinEconomy", "QuestTracker" -- not "Manager", "Handler"

**Use modules for:**
- Services with lifecycle
- Data access wrappers
- Economy calculations
- Reward tables and balancing constants
- UI controllers on the client
- Shared utility functions (deterministic, side-effect-light)

**Keep modules small enough** that another system can depend on them without importing unrelated behavior.`,
    keywords: ["module", "service", "Init", "Start", "remote", "boundary", "deep module", "architecture", "dependency", "lifecycle", "wrapper", "controller", "utility"],
  },

  // ─── NPC / AI ───────────────────────────────────────────────────────────
  {
    category: "combat",
    title: "Enemy AI and NPC Design Patterns",
    content: `**Enemy AI design for combat systems:**

**Target selection rules:**
- Server-authoritative target selection
- Leash distance: enemies return to spawn if pulled too far
- Aggro management: nearest player, most damage dealt, or threat table
- De-aggro on player death or leaving range

**AI behavior patterns:**
- Idle -> Alert -> Chase -> Attack -> Recovery cycle
- Clear tells before attacks (wind-up animations)
- Fair counterplay: player can dodge or block after the tell
- Difficulty scaling through stats, not removing counterplay

**Server-side validation for AI:**
\`\`\`luau
-- Enemy damage is SERVER calculated, never client
local function enemyAttack(enemy, target)
    if not target or not target.Parent then return end
    if not isInRange(enemy, target, enemy.AttackRange) then return end
    if not checkCooldown(enemy, "attack") then return end
    local damage = enemy.BaseDamage
    target.Humanoid:TakeDamage(damage)
    setCooldown(enemy, "attack", enemy.AttackSpeed)
end
\`\`\`

**NPC spawn management:**
- Pool NPCs to reduce Instance creation overhead
- Respawn on timer or trigger, not immediately
- Limit active NPCs per area for performance
- Clean up NPC state when despawning

**Reward distribution:**
- Rewards tied to server-confirmed contribution
- Anti-AFK checks for reward-granting encounters
- Kill credit to player who dealt most damage or landed final hit
- No reward for players outside valid combat range`,
    keywords: ["NPC", "AI", "enemy", "aggro", "target", "pathfinding", "behavior", "spawn", "despawn", "pool", "combat AI", "leash", "patrol", "chase", "boss", "mob"],
  },

  // ─── GAME DESIGN ────────────────────────────────────────────────────────
  {
    category: "game-design",
    title: "Core Loop and Onboarding Design",
    content: `**Core loop structure:**
The core loop is the repeating cycle of actions that keeps players engaged:
Action -> Reward -> Upgrade -> Harder Action -> Better Reward

**Onboarding rules:**
- First action reachable within 10-30 seconds of spawn
- Teach through DOING, not text walls
- Reward the first completion immediately
- Show the upgrade path early
- Don't overwhelm with systems -- introduce one at a time
- Safe space before challenge space

**Retention milestones:**
- **First 30 seconds:** Player understands what to do
- **First 5 minutes:** Player has completed core loop once
- **First session (30 min):** Player has upgraded, sees progress
- **Day 1 return:** Daily reward, new objective
- **Day 3:** New content unlock before content wall
- **Day 7:** Major milestone, social investment

**Design patterns for engagement:**
- Show next reward/unlock at all times
- Use variable reward schedules (not always same reward)
- Create "just one more" moments at session end
- Social hooks: visible other players, celebrations, leaderboards
- Tease future content to motivate return

**Mobile-first design:**
- Touch-friendly controls
- Short session viability (5-minute meaningful sessions)
- Landscape AND portrait considerations
- Battery and performance consciousness`,
    keywords: ["core loop", "onboarding", "tutorial", "first action", "retention", "engagement", "reward", "upgrade", "progression", "session", "Day 1", "Day 3", "Day 7", "mobile", "design"],
  },

  // ─── FINAL: INPUT HANDLING ──────────────────────────────────────────────
  {
    category: "architecture",
    title: "Input Handling and Cross-Platform Controls",
    content: `**Input handling in Roblox:**

**ContextActionService** for gameplay actions:
\`\`\`luau
local CAS = game:GetService("ContextActionService")
CAS:BindAction("Attack", function(name, state, input)
    if state == Enum.UserInputState.Begin then
        attackRemote:FireServer()
    end
end, true, Enum.KeyCode.E, Enum.KeyCode.ButtonR1)
\`\`\`

**UserInputService** for raw device details and gesture tracking.

**Server Authority Input System:**
For simulation-affecting input, use \`InputAction\`/\`InputContext\` and \`RunService:BindToSimulation()\` (requires \`Workspace.UseFixedSimulation\`).

**Cross-platform rules:**
- Design for touch AND gamepad as well as keyboard/mouse
- Bind gameplay actions with ContextActionService
- For gamepad UI, set \`GuiService.SelectedObject\` and wire \`NextSelectionRight/Down\`
- Touch: large tap targets, away from system gesture zones
- Hover events (MouseEnter/Leave) are PC only -- use SelectionGained/Lost for gamepad

**Gamepad UI navigation:**
\`\`\`luau
buttonA.NextSelectionRight = buttonB
buttonB.NextSelectionLeft = buttonA
GuiService.SelectedObject = buttonA  -- entry point
\`\`\`

**Every interactive control needs:**
- Visible state for hover, press, disabled, focus
- Clear label or tooltip
- Route that works without precise mouse aiming
- Debounced action preventing duplicate requests while busy`,
    keywords: ["input", "keyboard", "mouse", "touch", "gamepad", "controller", "ContextActionService", "UserInputService", "InputAction", "bind", "action", "cross-platform", "controls", "mobile input"],
  },
];
