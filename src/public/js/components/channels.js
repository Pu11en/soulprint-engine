import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
const html = htm.bind(h);

const ALL_CHANNELS = ['telegram', 'discord'];

export function Channels({ channels }) {
  return html`
    <div class="bg-surface border border-border rounded-xl p-4">
      <h2 class="font-semibold mb-3">Channels</h2>
      <div class="space-y-2">
        ${channels ? ALL_CHANNELS.map(ch => {
          const info = channels[ch];
          let badgeClass, badgeText;
          if (!info) {
            badgeClass = 'bg-gray-800 text-gray-500';
            badgeText = 'Not configured';
          } else if (info.status === 'paired') {
            badgeClass = 'bg-green-500/10 text-green-500';
            badgeText = `Paired (${info.paired})`;
          } else {
            badgeClass = 'bg-yellow-500/10 text-yellow-500';
            badgeText = 'Awaiting pairing';
          }
          return html`<div class="flex justify-between items-center py-1.5">
            <span class="font-medium text-sm">${ch.charAt(0).toUpperCase() + ch.slice(1)}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}">${badgeText}</span>
          </div>`;
        }) : html`<div class="text-gray-500 text-sm text-center py-2">Loading...</div>`}
      </div>
    </div>`;
}

export { ALL_CHANNELS };
