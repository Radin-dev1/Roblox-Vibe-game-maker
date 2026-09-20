export interface PluginCommand {
  action: string;
  [key: string]: unknown;
}

interface PluginSession {
  id: string;
  version?: string;
  scene: unknown;
  commands: PluginCommand[];
  results: unknown[];
  connectedAt: number;
  lastSeen: number;
}

type PluginStore = Map<string, PluginSession>;

const globalStore = globalThis as typeof globalThis & { __vibePluginSessions?: PluginStore };
const sessions = globalStore.__vibePluginSessions ?? new Map<string, PluginSession>();
globalStore.__vibePluginSessions = sessions;

function getSession(id: string) {
  return sessions.get(id);
}

export function createPluginSession(scene: unknown, version?: string) {
  const id = crypto.randomUUID().replaceAll("-", "").slice(0, 14);
  sessions.set(id, {
    id,
    version,
    scene,
    commands: [],
    results: [],
    connectedAt: Date.now(),
    lastSeen: Date.now(),
  });
  return id;
}

export function pollPluginSession(id: string) {
  const session = getSession(id);
  if (!session) return null;
  session.lastSeen = Date.now();
  const commands = session.commands.splice(0, session.commands.length);
  return { commands, scene: session.scene, version: session.version };
}

export function queuePluginCommand(id: string, command: PluginCommand) {
  const session = getSession(id);
  if (!session) return false;
  session.commands.push(command);
  session.lastSeen = Date.now();
  return true;
}

export function recordPluginResults(id: string, results: unknown[]) {
  const session = getSession(id);
  if (!session) return false;
  session.results.push(...results);
  session.lastSeen = Date.now();
  return true;
}

export function pluginSessionSummary(id: string) {
  const session = getSession(id);
  if (!session) return null;
  return {
    id: session.id,
    version: session.version,
    scene: session.scene,
    pendingCommands: session.commands.length,
    connectedAt: session.connectedAt,
    lastSeen: session.lastSeen,
  };
}
