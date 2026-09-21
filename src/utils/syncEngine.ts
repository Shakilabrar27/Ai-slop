import { Bookmark, Highlight, ReaderPreferences, ReadingProgress, SyncDataPayload, SyncDevice } from '../types';

const SYNC_STORAGE_KEY = 'lumina_cloud_sync_data';
const SYNC_DEVICES_KEY = 'lumina_sync_devices';
const SYNC_CODE_KEY = 'lumina_sync_pairing_code';
const DEVICE_ID_KEY = 'lumina_device_id';

// BroadcastChannel for instant inter-window / inter-tab communication in Windows
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('lumina_sync_channel');
} catch {
  // BroadcastChannel fallback
}

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'win-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getSyncPairingCode(): string {
  let code = localStorage.getItem(SYNC_CODE_KEY);
  if (!code) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    code = `LUMINA-${randomDigits}`;
    localStorage.setItem(SYNC_CODE_KEY, code);
  }
  return code;
}

export function setSyncPairingCode(newCode: string): void {
  localStorage.setItem(SYNC_CODE_KEY, newCode.trim().toUpperCase());
}

export function getRegisteredDevices(): SyncDevice[] {
  const raw = localStorage.getItem(SYNC_DEVICES_KEY);
  const currentId = getOrCreateDeviceId();

  const defaultDevices: SyncDevice[] = [
    {
      id: currentId,
      name: 'Windows 11 Desktop (This Device)',
      platform: 'windows',
      lastActive: Date.now(),
      isCurrent: true,
      ipLocation: 'Local Host',
    },
    {
      id: 'surface-pro-78',
      name: 'Surface Pro 9 (Windows 11)',
      platform: 'surface',
      lastActive: Date.now() - 1000 * 60 * 42, // 42 mins ago
      isCurrent: false,
      ipLocation: 'Cloud Paired',
    },
    {
      id: 'phone-sync-31',
      name: 'Mobile PWA (Companion)',
      platform: 'mobile',
      lastActive: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
      isCurrent: false,
      ipLocation: 'Cloud Paired',
    },
  ];

  if (!raw) {
    localStorage.setItem(SYNC_DEVICES_KEY, JSON.stringify(defaultDevices));
    return defaultDevices;
  }

  try {
    const parsed: SyncDevice[] = JSON.parse(raw);
    return parsed.map((d) => ({ ...d, isCurrent: d.id === currentId }));
  } catch {
    return defaultDevices;
  }
}

export function registerNewDevice(name: string, platform: SyncDevice['platform']): SyncDevice {
  const devices = getRegisteredDevices();
  const newDevice: SyncDevice = {
    id: 'dev-' + Math.random().toString(36).substring(2, 8),
    name,
    platform,
    lastActive: Date.now(),
    isCurrent: false,
    ipLocation: 'Cloud Paired',
  };
  devices.push(newDevice);
  localStorage.setItem(SYNC_DEVICES_KEY, JSON.stringify(devices));
  return newDevice;
}

export function getCloudSyncPayload(): SyncDataPayload | null {
  const raw = localStorage.getItem(SYNC_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function pushToCloudSync(
  libraryProgress: Record<string, ReadingProgress>,
  bookmarks: Bookmark[],
  highlights: Highlight[],
  preferences: ReaderPreferences
): SyncDataPayload {
  const deviceId = getOrCreateDeviceId();
  const payload: SyncDataPayload = {
    version: 1,
    timestamp: Date.now(),
    deviceId,
    libraryProgress,
    bookmarks,
    highlights,
    preferences,
  };

  localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(payload));

  // Notify other Windows tabs or windows instantly
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'LUMINA_SYNC_UPDATE', payload });
  }

  return payload;
}

export function mergeCloudSyncPayload(
  remote: SyncDataPayload,
  localProgress: Record<string, ReadingProgress>,
  localBookmarks: Bookmark[],
  localHighlights: Highlight[]
): {
  mergedProgress: Record<string, ReadingProgress>;
  mergedBookmarks: Bookmark[];
  mergedHighlights: Highlight[];
  remotePreferences?: ReaderPreferences;
} {
  // Merge Reading Progress (latest lastReadAt wins)
  const mergedProgress: Record<string, ReadingProgress> = { ...localProgress };
  for (const [bookId, remoteProg] of Object.entries(remote.libraryProgress || {})) {
    const localProg = mergedProgress[bookId];
    if (!localProg || remoteProg.lastReadAt > localProg.lastReadAt) {
      mergedProgress[bookId] = remoteProg;
    }
  }

  // Merge Bookmarks (union by id)
  const bookmarkMap = new Map<string, Bookmark>();
  localBookmarks.forEach((b) => bookmarkMap.set(b.id, b));
  (remote.bookmarks || []).forEach((b) => bookmarkMap.set(b.id, b));
  const mergedBookmarks = Array.from(bookmarkMap.values());

  // Merge Highlights (union by id)
  const highlightMap = new Map<string, Highlight>();
  localHighlights.forEach((h) => highlightMap.set(h.id, h));
  (remote.highlights || []).forEach((h) => highlightMap.set(h.id, h));
  const mergedHighlights = Array.from(highlightMap.values());

  return {
    mergedProgress,
    mergedBookmarks,
    mergedHighlights,
    remotePreferences: remote.preferences,
  };
}

export function subscribeToSyncUpdates(callback: (payload: SyncDataPayload) => void): () => void {
  if (!broadcastChannel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'LUMINA_SYNC_UPDATE' && event.data?.payload) {
      callback(event.data.payload);
    }
  };

  broadcastChannel.addEventListener('message', handler);
  return () => broadcastChannel?.removeEventListener('message', handler);
}
