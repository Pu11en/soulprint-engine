# OpenClaw Railway Template

Deploy OpenClaw to Railway in one click. Get a 24/7 AI agent with persistent memory, connected to Telegram (or Discord), with full version control of your config and workspace.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/2VgcTk?referralCode=jcFhp_)

## What you get

- **OpenClaw Gateway** running 24/7 on Railway
- **Everything version controlled** — config, cron jobs, workspace, memory all backed up to GitHub
- **Telegram or Discord** connected out of the box
- **Persistent storage** — survives redeploys via Railway volume

## Before you deploy

You'll need three things ready before clicking the deploy button:

### 1. Anthropic authentication (pick one)

**Option A: Setup token (recommended)** — uses your Claude Pro/Max subscription, no separate API billing.

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Run `claude` and complete the OAuth login in your browser
3. Run `claude setup-token`
4. Copy the token it outputs

**Option B: API key** — direct billing to your Anthropic account.

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Navigate to API Keys → Create Key

### 2. GitHub repo for backup

Your agent's entire `.openclaw` directory (config, cron, workspace, memory) is version controlled. You need a repo to back it up to.

1. Create a **new private repo** on GitHub (can be empty, no README needed)
2. Create a [personal access token](https://github.com/settings/tokens) with `repo` scope
3. Note the repo name (e.g. `username/my-agent`)

### 3. Chat channel (pick one)

**Telegram:**
1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name and username (must end in `bot`)
4. Copy the token BotFather gives you (looks like `123456789:AAHdq...`)

**Discord:**
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. New Application → Bot tab → Reset Token → copy it
3. Enable **Message Content Intent** under Privileged Gateway Intents
4. OAuth2 → URL Generator → `bot` scope + `Send Messages` → invite to your server

## Deploy

Click the deploy button and fill in the variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_TOKEN` | Pick one | Setup token from `claude setup-token` |
| `ANTHROPIC_API_KEY` | Pick one | Anthropic API key |
| `GITHUB_TOKEN` | ✅ | GitHub personal access token with `repo` scope |
| `GITHUB_WORKSPACE_REPO` | ✅ | e.g. `username/my-agent` |
| `TELEGRAM_BOT_TOKEN` | Pick one | From BotFather |
| `DISCORD_BOT_TOKEN` | Pick one | From Discord Developer Portal |
| `OPENCLAW_GATEWAY_TOKEN` | Auto | Auto-generated, protects your gateway |
| `GIT_EMAIL` | Optional | For git commits (default: agent@openclaw.ai) |
| `GIT_NAME` | Optional | For git commits (default: OpenClaw Agent) |
| `NOTION_API_KEY` | Optional | For Notion integration |
| `OPENAI_API_KEY` | Optional | For OpenAI models |
| `GEMINI_API_KEY` | Optional | For Gemini models |

## After deploy

1. DM your bot on Telegram (or Discord)
2. It will ask you to approve pairing — check the Railway deploy logs for instructions
3. Once paired, you're talking to your agent

## How it works

```
/data/.openclaw/           ← Persistent volume + git repo
├── openclaw.json          ← Config (secrets sanitized to ${ENV_VAR})
├── cron/jobs.json         ← Scheduled tasks
├── .gitignore             ← Excludes auth-profiles, logs, caches
├── agents/                ← Session state
└── workspace/             ← Agent workspace
    ├── AGENTS.md
    ├── TOOLS.md
    ├── HEARTBEAT.md
    ├── skills/
    └── memory/
```

On first boot, `setup.sh` runs `openclaw onboard` to scaffold everything, sanitizes secrets in the config (replacing raw values with `${ENV_VAR}` references), and pushes the initial commit to your GitHub repo.

On subsequent boots, it pulls the latest from git and starts the gateway. Your agent commits and pushes changes during normal operation.

**Secrets are never committed to git.** The sanitizer replaces raw API keys and tokens with environment variable references (e.g. `${ANTHROPIC_API_KEY}`). OpenClaw resolves these from Railway's environment at runtime.

## Troubleshooting

### "pairing required" when DMing the bot

Normal on first connect. Check Railway deploy logs for the pairing code, or visit the OpenClaw Control UI at `https://your-app.up.railway.app/openclaw`.

### Bot doesn't respond

- Check Railway deploy logs for errors
- Make sure your channel token is set correctly
- Redeploy to pick up variable changes

### Gateway crash loop

- Ensure the volume is mounted at `/data`
- Check that your Anthropic credentials are valid
- Look at deploy logs for the specific error

## Links

- [OpenClaw docs](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Community Discord](https://discord.com/invite/clawd)
