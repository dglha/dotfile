#!/bin/sh

sleep 1
pkill polybar &&
sleep 1
wal -i "$(< "${HOME}/.cache/wal/wal")"
polybar base &
sleep .5
