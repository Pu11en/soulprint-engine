import { h, render } from 'https://esm.sh/preact';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { fetchStatus, fetchPairings, approvePairing, rejectPairing } from './lib/api.js';
import { Gateway } from './components/gateway.js';
import { Channels, ALL_CHANNELS } from './components/channels.js';
import { Pairings } from './components/pairings.js';
import { Google } from './components/google.js';
import { ToastContainer } from './components/toast.js';
const html = htm.bind(h);

function App() {
  const [gatewayStatus, setGatewayStatus] = useState(null);
  const [channels, setChannels] = useState(null);
  const [pending, setPending] = useState([]);
  const [hasUnpaired, setHasUnpaired] = useState(false);
  const [googleKey, setGoogleKey] = useState(0);

  const refreshPairings = useCallback(async () => {
    try {
      const status = await fetchStatus();
      setGatewayStatus(status.gateway);
      setChannels(status.channels);

      const unpaired = ALL_CHANNELS.some(ch => {
        const info = status.channels?.[ch];
        return info && info.status !== 'paired';
      });
      setHasUnpaired(unpaired);

      if (unpaired && status.gateway === 'running') {
        const pairData = await fetchPairings();
        setPending(pairData.pending || []);
      } else {
        setPending([]);
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  }, []);

  useEffect(() => {
    refreshPairings();
    const interval = setInterval(refreshPairings, 15000);
    return () => clearInterval(interval);
  }, [refreshPairings]);

  const handleApprove = async (id, channel) => {
    await approvePairing(id, channel);
    setTimeout(refreshPairings, 500);
  };

  const handleReject = async (id, channel) => {
    await rejectPairing(id, channel);
    setTimeout(refreshPairings, 500);
  };

  const fullRefresh = () => {
    refreshPairings();
    setGoogleKey(k => k + 1);
  };

  return html`
    <div class="max-w-lg w-full space-y-4">
      <div>
        <div class="text-4xl mb-1">🐾</div>
        <h1 class="text-2xl font-semibold">OpenClaw</h1>
        <p class="text-gray-500 text-sm mt-1">Your agent is deploying. Complete setup below.</p>
      </div>

      <${Gateway} status=${gatewayStatus} />
      <${Channels} channels=${channels} />
      <${Pairings} pending=${pending} visible=${hasUnpaired} onApprove=${handleApprove} onReject=${handleReject} />
      <${Google} key=${googleKey} />

      <p class="text-center text-gray-600 text-xs">
        Pairings auto-refresh every 15s ·${' '}
        <a href="#" onclick=${(e) => { e.preventDefault(); fullRefresh(); }} class="text-gray-500 hover:text-gray-300">Refresh all</a>
      </p>
    </div>
    <${ToastContainer} />
  `;
}

render(html`<${App} />`, document.getElementById('app'));
