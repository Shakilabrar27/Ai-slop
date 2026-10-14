import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Check, 
  Copy, 
  HardDrive, 
  UploadCloud, 
  DownloadCloud, 
  Share2, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { SyncDevice } from '../types';
import { getSyncPairingCode, setSyncPairingCode } from '../utils/syncEngine';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: SyncDevice[];
  lastSyncTime?: number;
  onTriggerManualSync: () => Promise<void>;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
  offlineStorageEstimate: { usedBytes: number; quotaBytes: number };
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  devices,
  lastSyncTime,
  onTriggerManualSync,
  onExportBackup,
  onImportBackup,
  offlineStorageEstimate,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCode, setLocalSyncCode] = useState(getSyncPairingCode());
  const [copied, setCopied] = useState(false);
  const [newCodeInput, setNewCodeInput] = useState('');
  const [pairingSuccess, setPairingSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await onTriggerManualSync();
    setTimeout(() => setIsSyncing(false), 700);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePairNewDevice = () => {
    if (!newCodeInput.trim()) return;
    setSyncPairingCode(newCodeInput.trim());
    setLocalSyncCode(newCodeInput.trim().toUpperCase());
    setNewCodeInput('');
    setPairingSuccess(true);
    setTimeout(() => setPairingSuccess(false), 3000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getPlatformIcon = (platform: SyncDevice['platform']) => {
    switch (platform) {
      case 'windows':
      case 'surface':
        return <Laptop className="w-4 h-4 text-sky-400" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-purple-400" />;
      default:
        return <Laptop className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900/95 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Cross-Device Cloud Sync</h2>
              <p className="text-xs text-slate-400">Seamless sync across Windows PC, Surface & Mobile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 to-slate-900 border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span>Cloud Library Connected</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs text-slate-400">
                  {lastSyncTime ? `Last synced ${new Date(lastSyncTime).toLocaleTimeString()}` : 'Syncing in real-time'}
                </div>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Sync Pairing Code */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Your Device Pairing Code</span>
                <span className="text-[11px] text-slate-400">Enter this code on your Surface or Phone to link libraries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-sky-400 tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-white/10">
                  {syncCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                  title="Copy Pairing Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Pair Another Device input */}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Enter Remote Sync Code (e.g. CORN-4821)"
                value={newCodeInput}
                onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 uppercase font-mono focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={handlePairNewDevice}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
              >
                Connect
              </button>
            </div>
            {pairingSuccess && (
              <p className="text-xs text-emerald-400 font-medium animate-in fade-in">
                Device code connected! Reading positions will synchronize automatically.
              </p>
            )}
          </div>

          {/* Connected Devices List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Paired Devices ({devices.length})
            </label>
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    device.isCurrent
                      ? 'border-sky-500/40 bg-sky-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      {getPlatformIcon(device.platform)}
                    </div>
                    <div>
                      <div className="font-medium text-xs text-slate-100 flex items-center gap-1.5">
                        <span>{device.name}</span>
                        {device.isCurrent && (
                          <span className="text-[10px] bg-sky-500/30 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Active {device.isCurrent ? 'Right Now' : new Date(device.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px]">Synced</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Storage & Backup Management */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span>Offline IndexedDB Cache</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {formatBytes(offlineStorageEstimate.usedBytes)} Cached Locally
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              All books, reading positions, and bookmarks are persistently stored in your browser's IndexedDB. You can read completely offline without internet.
            </p>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={onExportBackup}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Export Cloud Backup</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          onImportBackup(reader.result);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
