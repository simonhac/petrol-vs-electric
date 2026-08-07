# petrol-vs-electric — committed environment template (dev).
#
# Secrets are 1Password references into the petrol-vs-electric-dev vault — no
# values live in this file. Bootstrap a working .env.local with:
#
#   npm run setup
#
# (op inject via the Keychain SA token op-sa-petrol-vs-electric-dev, or your
# personal op session). Prod secrets live in petrol-vs-electric-prod and are
# pushed to Vercel by the infra repo's sync tooling — never via this file.
#
# NOTE: op inject parses secret references ANYWHERE in this file, including
# comments — never write one here unless its field exists in the vault.

AMBER_API_TOKEN="op://petrol-vs-electric-dev/env/AMBER_API_TOKEN"
AMBER_SITE_ID="op://petrol-vs-electric-dev/env/AMBER_SITE_ID"
