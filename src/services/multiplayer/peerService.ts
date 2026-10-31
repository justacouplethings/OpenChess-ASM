import Peer, { DataConnection } from 'peerjs';

export interface P2PMessage {
  type:
    | 'HELLO'
    | 'START_GAME'
    | 'MOVE'
    | 'TIME_SYNC'
    | 'DRAW_OFFER'
    | 'DRAW_ACCEPT'
    | 'DRAW_DECLINE'
    | 'RESIGN'
    | 'REMATCH_OFFER'
    | 'REMATCH_ACCEPT'
    | 'CHAT_MESSAGE';
  payload?: any;
  timestamp: number;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export class P2PMultiplayerService {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private myPeerId: string = '';
  private onMessageCallback: ((msg: P2PMessage) => void) | null = null;
  private onStateChangeCallback: ((state: ConnectionState, peerId?: string) => void) | null = null;

  public initialize(customId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create Peer instance with free public cloud STUN / signaling broker
        const peerInstance = customId ? new Peer(customId) : new Peer();

        peerInstance.on('open', (id) => {
          this.peer = peerInstance;
          this.myPeerId = id;
          this.onStateChangeCallback?.('connecting', id);
          resolve(id);
        });

        // Listen for incoming peer connection (when acting as Host)
        peerInstance.on('connection', (connection) => {
          this.setupConnection(connection);
        });

        peerInstance.on('error', (err) => {
          console.warn('PeerJS error:', err);
          this.onStateChangeCallback?.('error');
          // If customId collision, fallback cleanly
          if (customId) {
            this.initialize().then(resolve).catch(reject);
          } else {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Connect to an existing room host
  public connectToRoom(hostRoomId: string) {
    if (!this.peer) return;
    this.onStateChangeCallback?.('connecting');

    const connection = this.peer.connect(hostRoomId, {
      reliable: true,
    });
    this.setupConnection(connection);
  }

  private setupConnection(connection: DataConnection) {
    this.conn = connection;

    connection.on('open', () => {
      this.onStateChangeCallback?.('connected', connection.peer);
    });

    connection.on('data', (data) => {
      try {
        const msg = data as P2PMessage;
        this.onMessageCallback?.(msg);
      } catch (err) {
        console.error('Invalid P2P message received:', err);
      }
    });

    connection.on('close', () => {
      this.onStateChangeCallback?.('disconnected');
      this.conn = null;
    });

    connection.on('error', (err) => {
      console.warn('P2P connection error:', err);
      this.onStateChangeCallback?.('error');
    });
  }

  public sendMessage(type: P2PMessage['type'], payload?: any) {
    if (!this.conn || !this.conn.open) return;
    const msg: P2PMessage = {
      type,
      payload,
      timestamp: Date.now(),
    };
    this.conn.send(msg);
  }

  public onMessage(callback: (msg: P2PMessage) => void) {
    this.onMessageCallback = callback;
  }

  public onStateChange(callback: (state: ConnectionState, peerId?: string) => void) {
    this.onStateChangeCallback = callback;
  }

  public getMyId(): string {
    return this.myPeerId;
  }

  public disconnect() {
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.onStateChangeCallback?.('disconnected');
  }
}

export const p2pService = new P2PMultiplayerService();
