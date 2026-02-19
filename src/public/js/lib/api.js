export async function fetchStatus() {
  const res = await fetch('/api/status');
  return res.json();
}

export async function fetchPairings() {
  const res = await fetch('/api/pairings');
  return res.json();
}

export async function approvePairing(id, channel) {
  const res = await fetch(`/api/pairings/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel }),
  });
  return res.json();
}

export async function rejectPairing(id, channel) {
  const res = await fetch(`/api/pairings/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel }),
  });
  return res.json();
}

export async function fetchGoogleStatus() {
  const res = await fetch('/api/google/status');
  return res.json();
}

export async function checkGoogleApis() {
  const res = await fetch('/api/google/check');
  return res.json();
}

export async function saveGoogleCredentials(clientId, clientSecret, email) {
  const res = await fetch('/api/google/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret, email }),
  });
  return res.json();
}

export async function disconnectGoogle() {
  const res = await fetch('/api/google/disconnect', { method: 'POST' });
  return res.json();
}
