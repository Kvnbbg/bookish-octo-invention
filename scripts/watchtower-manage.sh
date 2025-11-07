#!/usr/bin/env bash
# watchtower-manage.sh — helper script to operate the Watchtower service defined in docker-compose.yml
# Usage: ./watchtower-manage.sh start|stop|update|status|logs

set -euo pipefail

DOCKER_COMPOSE_FILE="$(dirname "$0")/../docker-compose.yml"
WT_SERVICE="watchtower"

if command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN=(docker-compose)
else
  COMPOSE_BIN=(docker compose)
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 start|stop|update|status|logs" >&2
  exit 1
fi

action="$1"

case "$action" in
  start)
    echo "[watchtower] starting service via docker-compose"
    "${COMPOSE_BIN[@]}" -f "$DOCKER_COMPOSE_FILE" up -d "$WT_SERVICE"
    ;;
  stop)
    echo "[watchtower] stopping service via docker-compose"
    "${COMPOSE_BIN[@]}" -f "$DOCKER_COMPOSE_FILE" stop "$WT_SERVICE"
    ;;
  update)
    echo "[watchtower] updating container image and recreating service"
    docker pull containrrr/watchtower:latest
    "${COMPOSE_BIN[@]}" -f "$DOCKER_COMPOSE_FILE" up -d --force-recreate "$WT_SERVICE"
    ;;
  status)
    docker ps --filter "name=$WT_SERVICE" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
    ;;
  logs)
    docker logs -f "$WT_SERVICE"
    ;;
  *)
    echo "Unsupported action: $action" >&2
    echo "Usage: $0 start|stop|update|status|logs" >&2
    exit 1
    ;;
esac
