# Northstar Desk Agent Lab: Railway edition

A lightweight gallery for a class debrief. Students enter through private group links. Each group posts a workflow screenshot (up to three images allowed), a short design explanation, an optional workflow link, and its first responses to two common challenge requests (H01 and H02). The instructor previews posts and reveals them together. Reveal closes editing.

The normal course submission remains the official deliverable. The gallery does not collect baseline work, practice outputs, full prompts, reflection, or grades. The instructor distributes the challenge requests in class; the gallery does not release test cases.

## Deploy from GitHub

In Railway, create a new project from this GitHub repository. Select the repository root (the folder containing Dockerfile). Add a volume mounted at `/data` and the variables listed below. Deploy, then use **Settings → Networking → Generate Domain** with target port 3000. Keep one replica.

## Deploy from this Mac

Railway's command-line tool is already installed. Open Terminal and run:

```sh
cd "/Users/jxshix/Documents/GRAD/BizAICourse/agent-lab-railway"
railway login
railway init --name northstar-agent-lab
railway add --service agent-lab
railway service link agent-lab
railway volume add --mount-path /data
railway open
```

Select your own Railway workspace when prompted. This creates a new project and service. Railway account billing and resource limits apply.

In the dashboard, select **agent-lab → Variables** and add:

| Variable | Value |
| --- | --- |
| `INSTRUCTOR_PASSWORD` | A unique password with at least 16 characters |
| `SESSION_SECRET` | A random secret with at least 32 characters |
| `DATA_DIR` | `/data` |
| `PORT` | `3000` |

Generate the session secret with your password manager or `openssl rand -hex 32`. Keep both credentials private. Do not commit them or change SESSION_SECRET during the lab: it controls sessions and group links.

Confirm the volume is attached to agent-lab at **/data**. The app saves its SQLite database and screenshot images there. Use one service instance, with no replicas. No separate database service is needed. A fresh installation starts empty; the Sites deployment's data is not migrated.

Then return to Terminal:

```sh
railway up --service agent-lab
railway domain --service agent-lab --port 3000
```

Wait for a successful deployment. Open the generated HTTPS address. If desired, set `APP_URL` to that exact origin without a trailing slash and redeploy. Railway detects the included Dockerfile. The health check is `/api/health`; it fails until the required credentials and storage work. Do not override the Docker start command.

If you already created a Railway project, use `railway link` instead of `railway init`, then select its service. Do not create duplicate projects accidentally.

## First class setup

1. Open **Instructor access** and enter INSTRUCTOR_PASSWORD.
2. Expand **Manage private group links**, create one entry per existing group, and copy each link. Share it only with that group through your normal course channel.
3. Groups build and practice using the lab materials. Keep three practice requests. Freeze workflows before releasing H01 and H02. Treat the policy-change request as an optional extension outside the gallery.
4. Each group opens its link and uploads a workflow screenshot, adds a 3–5 sentence explanation, and pastes the first output for each shared challenge. Include the customer draft and internal note. A workflow share link is optional. No student account is required.
5. Groups can fix transcription errors in their posts before reveal. They should not rerun the workflow to replace an unfavorable challenge result. There is no score or leaderboard.
6. The instructor sees how many groups have posted and can preview their work. When ready, select **Reveal gallery**, then confirm. This reveals posts to all participants and closes editing.
7. Use the selector to compare **Workflow designs**, **Challenge 1**, or **Challenge 2** during a 10-minute discussion. Ask whether extra steps helped and which output was easiest for a human employee to review.

Student names are not required. All six members can use their group link, but should coordinate edits: the most recent save wins. Opening a group link in the instructor browser switches that browser's session, so use a private window to test student access. **Close this workspace** returns to the access screen.

Screenshots may be PNG, JPEG, or WebP, at most 5 MB each. The gallery shows screenshots to other groups only after reveal. Private group links or the instructor session are required to view the gallery, even after reveal.

The gallery records what each group built and produced. It does not execute workflows, send customer messages, or grade assignments.

## Official course submission

Keep the complete workflow, prompts, baseline comparison, three practice outputs, two challenge outputs, and reflection in the regular course channel. The six core outputs are one baseline, three practice, and two challenge responses. The optional policy-change exercise adds one more. This replaces the earlier seven-required-output setup. Earlier Word/PPTX lab materials still describe the prior setup and need this adjustment before distribution.

## Storage and course reuse

Enable Railway volume backups before class. Preserve `/data` across deployments. For a second class, deploy another service with a new volume and SESSION_SECRET; there is deliberately no classroom-reset button that can erase submissions by accident. Screenshot images live in the database and are included in database backups. Keep the private group links within the class.

## Local development

Node 24 or newer is required. Copy `.env.example` to `.env.local` and fill in credentials. Run `npm ci` then `npm run dev`. For a production build, run `npm run build` and `npm start`. Production sessions use secure cookies, so use HTTPS in a browser. DATA_DIR defaults to `./data` locally.

## Deployment alternatives

You can instead put this folder's contents in a private GitHub repository, connect that repository to a new Railway service, add the same variables and /data volume, then deploy. Keep Dockerfile and package.json at the repository root. Do not upload node_modules, .next, local data, or credential files.

## References

- Railway Dockerfiles: https://docs.railway.com/builds/dockerfiles
- Railway volumes: https://docs.railway.com/volumes
- Railway CLI: https://docs.railway.com/cli
- Railway public networking: https://docs.railway.com/networking/public-networking
