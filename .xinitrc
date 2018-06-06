export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
xsetroot -cursor_name left_ptr &
fcitx -d &
mpd &
dunst &
exec bspwm
