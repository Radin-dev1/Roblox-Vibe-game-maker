--[[
  Vibe Studio Plugin for Roblox Studio
  Connects your Roblox Studio session to the Vibe AI web app.

  Install: Save this file as a .lua plugin in your Roblox Studio plugins folder,
  or install from the Creator Store.
]]

local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local StarterPlayer = game:GetService("StarterPlayer")
local StarterGui = game:GetService("StarterGui")
local Workspace = game:GetService("Workspace")
local Lighting = game:GetService("Lighting")
local SoundService = game:GetService("SoundService")

local PLUGIN_VERSION = "1.0.0"
local API_BASE = "http://localhost:3000/api/plugin"
local POLL_INTERVAL = 2

local toolbar = plugin:CreateToolbar("Vibe Studio")
local connectButton = toolbar:CreateButton(
	"Connect",
	"Connect to Vibe AI web app",
	"rbxassetid://0",
	"Connect to Vibe"
)

local statusButton = toolbar:CreateButton(
	"Status",
	"Show connection status",
	"rbxassetid://0",
	"Status"
)

local connected = false
local sessionId = nil
local polling = false

local widget = plugin:CreateDockWidgetPluginGui(
	"VibeStudio",
	DockWidgetPluginGuiInfo.new(
		Enum.InitialDockState.Right,
		false,
		false,
		300,
		400,
		200,
		200
	)
)
widget.Title = "Vibe Studio"

local bg = Instance.new("Frame")
bg.Size = UDim2.fromScale(1, 1)
bg.BackgroundColor3 = Color3.fromRGB(18, 18, 18)
bg.BorderSizePixel = 0
bg.Parent = widget

local statusLabel = Instance.new("TextLabel")
statusLabel.Size = UDim2.new(1, -32, 0, 40)
statusLabel.Position = UDim2.new(0, 16, 0, 16)
statusLabel.BackgroundTransparency = 1
statusLabel.Font = Enum.Font.GothamBold
statusLabel.TextSize = 16
statusLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
statusLabel.TextXAlignment = Enum.TextXAlignment.Left
statusLabel.Text = "Vibe Studio v" .. PLUGIN_VERSION
statusLabel.Parent = bg

local connectionDot = Instance.new("Frame")
connectionDot.Size = UDim2.fromOffset(8, 8)
connectionDot.Position = UDim2.new(0, 16, 0, 64)
connectionDot.BackgroundColor3 = Color3.fromRGB(255, 80, 80)
connectionDot.Parent = bg
local dotCorner = Instance.new("UICorner")
dotCorner.CornerRadius = UDim.new(1, 0)
dotCorner.Parent = connectionDot

local connectionLabel = Instance.new("TextLabel")
connectionLabel.Size = UDim2.new(1, -48, 0, 20)
connectionLabel.Position = UDim2.new(0, 32, 0, 58)
connectionLabel.BackgroundTransparency = 1
connectionLabel.Font = Enum.Font.Gotham
connectionLabel.TextSize = 13
connectionLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
connectionLabel.TextXAlignment = Enum.TextXAlignment.Left
connectionLabel.Text = "Disconnected"
connectionLabel.Parent = bg

local logFrame = Instance.new("ScrollingFrame")
logFrame.Size = UDim2.new(1, -32, 1, -120)
logFrame.Position = UDim2.new(0, 16, 0, 100)
logFrame.BackgroundColor3 = Color3.fromRGB(12, 12, 12)
logFrame.BorderSizePixel = 0
logFrame.ScrollBarThickness = 4
logFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
logFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
logFrame.Parent = bg

local logLayout = Instance.new("UIListLayout")
logLayout.SortOrder = Enum.SortOrder.LayoutOrder
logLayout.Padding = UDim.new(0, 2)
logLayout.Parent = logFrame

local logPadding = Instance.new("UIPadding")
logPadding.PaddingAll = UDim.new(0, 8)
logPadding.Parent = logFrame

local logCorner = Instance.new("UICorner")
logCorner.CornerRadius = UDim.new(0, 8)
logCorner.Parent = logFrame

local logIndex = 0

local function addLog(text, color)
	logIndex += 1
	local label = Instance.new("TextLabel")
	label.Size = UDim2.new(1, 0, 0, 0)
	label.AutomaticSize = Enum.AutomaticSize.Y
	label.BackgroundTransparency = 1
	label.Font = Enum.Font.Code
	label.TextSize = 11
	label.TextColor3 = color or Color3.fromRGB(140, 140, 140)
	label.TextXAlignment = Enum.TextXAlignment.Left
	label.TextWrapped = true
	label.Text = text
	label.LayoutOrder = logIndex
	label.Parent = logFrame
	logFrame.CanvasPosition = Vector2.new(0, 9999)
end

local function setConnected(state)
	connected = state
	if state then
		connectionDot.BackgroundColor3 = Color3.fromRGB(52, 211, 153)
		connectionLabel.Text = "Connected to Vibe AI"
	else
		connectionDot.BackgroundColor3 = Color3.fromRGB(255, 80, 80)
		connectionLabel.Text = "Disconnected"
	end
end

local function getSceneInfo()
	local info = {
		placeId = game.PlaceId,
		placeName = game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId).Name or "Unknown",
		instanceCount = #Workspace:GetDescendants(),
		services = {},
	}

	for _, service in { ServerStorage, ReplicatedStorage, StarterPlayer, StarterGui, Lighting } do
		table.insert(info.services, {
			name = service.Name,
			children = #service:GetChildren(),
		})
	end

	return info
end

local function resolveParent(parentPath)
	if not parentPath or parentPath == "" then
		return Workspace
	end

	local parts = string.split(parentPath, ".")
	local current = game

	for _, part in parts do
		local child = current:FindFirstChild(part)
		if not child then
			child = Instance.new("Folder")
			child.Name = part
			child.Parent = current
		end
		current = child
	end

	return current
end

local function executeCommand(command)
	local action = command.action

	if action == "create_instance" then
		local inst = Instance.new(command.className or "Part")
		inst.Name = command.name or inst.ClassName
		inst.Parent = resolveParent(command.parent)

		if command.properties then
			for prop, value in command.properties do
				pcall(function()
					if typeof(inst[prop]) == "Vector3" then
						inst[prop] = Vector3.new(unpack(value))
					elseif typeof(inst[prop]) == "Color3" then
						inst[prop] = Color3.fromRGB(unpack(value))
					elseif typeof(inst[prop]) == "UDim2" then
						inst[prop] = UDim2.new(unpack(value))
					elseif typeof(inst[prop]) == "CFrame" then
						inst[prop] = CFrame.new(unpack(value))
					else
						inst[prop] = value
					end
				end)
			end
		end

		addLog("+ Created " .. inst.ClassName .. " '" .. inst.Name .. "'", Color3.fromRGB(52, 211, 153))
		return { success = true, path = inst:GetFullName() }

	elseif action == "create_script" then
		local scriptType = command.scriptType or "Script"
		local inst
		if scriptType == "LocalScript" then
			inst = Instance.new("LocalScript")
		elseif scriptType == "ModuleScript" then
			inst = Instance.new("ModuleScript")
		else
			inst = Instance.new("Script")
		end

		inst.Name = command.name or "Script"
		inst.Source = command.source or ""
		inst.Parent = resolveParent(command.parent)

		addLog("+ Script '" .. inst.Name .. "' (" .. #inst.Source .. " chars)", Color3.fromRGB(124, 92, 252))
		return { success = true, path = inst:GetFullName() }

	elseif action == "modify_instance" then
		local target = resolveParent(command.path)
		if target and command.properties then
			for prop, value in command.properties do
				pcall(function()
					if typeof(target[prop]) == "Vector3" then
						target[prop] = Vector3.new(unpack(value))
					elseif typeof(target[prop]) == "Color3" then
						target[prop] = Color3.fromRGB(unpack(value))
					else
						target[prop] = value
					end
				end)
			end
			addLog("~ Modified " .. target:GetFullName(), Color3.fromRGB(251, 191, 36))
			return { success = true }
		end
		return { success = false, error = "Instance not found" }

	elseif action == "delete_instance" then
		local target = resolveParent(command.path)
		if target and target ~= game then
			local name = target:GetFullName()
			target:Destroy()
			addLog("- Deleted " .. name, Color3.fromRGB(255, 107, 107))
			return { success = true }
		end
		return { success = false, error = "Instance not found" }

	elseif action == "set_lighting" then
		if command.properties then
			for prop, value in command.properties do
				pcall(function()
					if typeof(Lighting[prop]) == "Color3" then
						Lighting[prop] = Color3.fromRGB(unpack(value))
					else
						Lighting[prop] = value
					end
				end)
			end
			addLog("~ Updated Lighting", Color3.fromRGB(167, 139, 250))
			return { success = true }
		end

	elseif action == "bulk_create" then
		local results = {}
		for _, cmd in command.items or {} do
			table.insert(results, executeCommand(cmd))
		end
		return { success = true, results = results }
	end

	return { success = false, error = "Unknown action: " .. tostring(action) }
end

local function startPolling()
	if polling then return end
	polling = true

	task.spawn(function()
		while polling and connected do
			local ok, response = pcall(function()
				return HttpService:RequestAsync({
					Url = API_BASE .. "/poll?session=" .. (sessionId or ""),
					Method = "GET",
					Headers = { ["Content-Type"] = "application/json" },
				})
			end)

			if ok and response.Success then
				local data = HttpService:JSONDecode(response.Body)
				if data.commands and #data.commands > 0 then
					ChangeHistoryService:SetWaypoint("Vibe AI Changes")

					local results = {}
					for _, cmd in data.commands do
						table.insert(results, executeCommand(cmd))
					end

					ChangeHistoryService:SetWaypoint("Vibe AI Applied")

					pcall(function()
						HttpService:RequestAsync({
							Url = API_BASE .. "/results",
							Method = "POST",
							Headers = { ["Content-Type"] = "application/json" },
							Body = HttpService:JSONEncode({
								session = sessionId,
								results = results,
							}),
						})
					end)
				end
			elseif not ok then
				setConnected(false)
				polling = false
				addLog("Connection lost. Click Connect to retry.", Color3.fromRGB(255, 107, 107))
				return
			end

			task.wait(POLL_INTERVAL)
		end
	end)
end

local function connect()
	addLog("Connecting to Vibe AI...", Color3.fromRGB(200, 200, 200))

	local ok, response = pcall(function()
		return HttpService:RequestAsync({
			Url = API_BASE .. "/connect",
			Method = "POST",
			Headers = { ["Content-Type"] = "application/json" },
			Body = HttpService:JSONEncode({
				version = PLUGIN_VERSION,
				scene = getSceneInfo(),
			}),
		})
	end)

	if ok and response.Success then
		local data = HttpService:JSONDecode(response.Body)
		sessionId = data.sessionId
		setConnected(true)
		addLog("Connected! Session: " .. (sessionId or "unknown"), Color3.fromRGB(52, 211, 153))
		startPolling()
	else
		addLog("Failed to connect. Is the Vibe web app running?", Color3.fromRGB(255, 107, 107))
		addLog("Make sure HttpService is enabled in Game Settings.", Color3.fromRGB(200, 200, 200))
	end
end

connectButton.Click:Connect(function()
	widget.Enabled = true
	if not connected then
		connect()
	end
end)

statusButton.Click:Connect(function()
	widget.Enabled = not widget.Enabled
end)

addLog("Vibe Studio Plugin loaded.", Color3.fromRGB(124, 92, 252))
addLog("Click 'Connect' in the toolbar to start.", Color3.fromRGB(150, 150, 150))
