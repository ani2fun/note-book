#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

WORKSPACE_NAME="${1:-}"
ACTION="${2:-}"

if [[ -z "$WORKSPACE_NAME" || -z "$ACTION" ]]; then
  echo "Usage: $(basename "$0") <workspace-name> {push|pull}" >&2
  echo "Example: $(basename "$0") homelab push" >&2
  exit 1
fi

ENV_FILE="$SCRIPT_DIR/env/.structurizr-${WORKSPACE_NAME}.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: Env file $ENV_FILE not found. Create it and set workspace ID, API key, secret, and DSL path." >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${STRUCTURIZR_WORKSPACE_ID:?Missing STRUCTURIZR_WORKSPACE_ID in $ENV_FILE}"
: "${STRUCTURIZR_API_KEY:?Missing STRUCTURIZR_API_KEY in $ENV_FILE}"
: "${STRUCTURIZR_API_SECRET:?Missing STRUCTURIZR_API_SECRET in $ENV_FILE}"
: "${STRUCTURIZR_WORKSPACE_DSL:?Missing STRUCTURIZR_WORKSPACE_DSL in $ENV_FILE}"

BASE_URL="${STRUCTURIZR_BASE_URL:-https://structurizr.kakde.eu/api}"

case "$ACTION" in
  push)
    echo ">>> Pushing workspace [$WORKSPACE_NAME] (ID=$STRUCTURIZR_WORKSPACE_ID) to $BASE_URL from $STRUCTURIZR_WORKSPACE_DSL"
    structurizr-cli push \
      -workspace "$STRUCTURIZR_WORKSPACE_DSL" \
      -url "$BASE_URL" \
      -id "$STRUCTURIZR_WORKSPACE_ID" \
      -key "$STRUCTURIZR_API_KEY" \
      -secret "$STRUCTURIZR_API_SECRET"
    ;;
  pull)
    echo ">>> Pulling workspace [$WORKSPACE_NAME] (ID=$STRUCTURIZR_WORKSPACE_ID) from $BASE_URL"
    structurizr-cli pull \
      -url "$BASE_URL" \
      -id "$STRUCTURIZR_WORKSPACE_ID" \
      -key "$STRUCTURIZR_API_KEY" \
      -secret "$STRUCTURIZR_API_SECRET"
    ;;
  *)
    echo "Usage: $(basename "$0") <workspace-name> {push|pull}" >&2
    exit 1
    ;;
esac
