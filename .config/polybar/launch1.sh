#!/bin/sh

sleep 1
pkill polybar &&
sleep 1
wal -R -a 97 
polybar base &
sleep .5
