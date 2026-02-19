import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
const html = htm.bind(h);

export function Gateway({ status }) {
  const isRunning = status === 'running';
  const dotClass = isRunning
    ? 'w-2 h-2 rounded-full bg-green-500'
    : 'w-2 h-2 rounded-full bg-yellow-500 animate-pulse';

  return html`
    <div class="bg-surface border border-border rounded-xl p-4">
      <div class="flex items-center gap-2">
        <span class=${dotClass}></span>
        <span class="font-semibold">Gateway:</span>
        <span class="text-gray-400">${status || 'checking...'}</span>
      </div>
    </div>`;
}
