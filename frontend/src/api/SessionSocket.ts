export type SocketKind = 'waypoint' | 'target' | 'text' | 'frontline';
export type SocketAction = 'create' | 'update' | 'delete' | 'clear';

export interface OutgoingMessage {
  kind: SocketKind;
  action: SocketAction;
  data: Record<string, unknown>;
}

export interface IncomingMessage {
  kind: SocketKind | 'error';
  action?: SocketAction;
  data?: Record<string, unknown>;
  message?: string;
}

/* opens the per-session socket; token is omitted entirely when all_can_edit sessions are viewed anonymously */
export function connectSessionSocket(
  username: string,
  slug: string,
  onMessage: (msg: IncomingMessage) => void,
) {
  const token = localStorage.getItem('access');
  const query = token ? `?token=${token}` : '';
  const ws = new WebSocket(
    `${import.meta.env.VITE_WS_URL}ws/mapSessions/${username}/${slug}/${query}`,
  );
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  return ws;
}

export function sendSocketMessage(
  ws: WebSocket | null,
  message: OutgoingMessage,
) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
