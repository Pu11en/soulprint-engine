import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
const html = htm.bind(h);

export function Pairings({ pending, visible, onApprove, onReject }) {
  if (!visible) return null;

  return html`
    <div class="bg-surface border border-border rounded-xl p-4">
      <h2 class="font-semibold mb-3">Pending Pairings</h2>
      <div>
        ${pending.length === 0
          ? html`<div class="text-gray-500 text-sm text-center py-2">No pending pairings</div>`
          : pending.map(p => html`
            <div class="bg-black/30 rounded-lg p-3 mb-2" key=${p.id}>
              <div class="font-medium text-sm mb-2">${(p.channel || 'unknown').charAt(0).toUpperCase() + (p.channel || '').slice(1)} · <code class="text-gray-400">${p.code || p.id || '?'}</code></div>
              <div class="flex gap-2">
                <button onclick=${() => onApprove(p.id, p.channel)} class="bg-green-500 text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-85">Approve</button>
                <button onclick=${() => onReject(p.id, p.channel)} class="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700">Reject</button>
              </div>
            </div>
          `)}
      </div>
      <p class="text-gray-600 text-xs mt-3 leading-relaxed">
        Send any message to your bot on Telegram or Discord. The pairing request will appear here.
      </p>
    </div>`;
}
