#!/bin/bash
# Montage UGC Sellvora : voix ElevenLabs + sous-titres + écran de fin
set -e
cd "/c/Users/HP/Documents/SELLVORA/videos"

FF="$1"

# 1. Écran de fin 3s (fond blanc, texte Sellvora)
"$FF" -y -f lavfi -i "color=white:s=720x1280:d=3:r=30" -vf "\
drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':text='SELLVORA':fontsize=92:fontcolor=0x14161a:x=(w-text_w)/2:y=430,\
drawtext=fontfile='C\:/Windows/Fonts/segoeui.ttf':text='Transformez votre budget publicitaire':fontsize=34:fontcolor=0x5b616e:x=(w-text_w)/2:y=570,\
drawtext=fontfile='C\:/Windows/Fonts/segoeui.ttf':text='en commandes rentables.':fontsize=34:fontcolor=0x5b616e:x=(w-text_w)/2:y=620,\
drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':text='Postulez maintenant pour devenir client':fontsize=32:fontcolor=0x2563eb:x=(w-text_w)/2:y=730,\
drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':text='www.sellvora.com':fontsize=38:fontcolor=0x14161a:x=(w-text_w)/2:y=820" \
-c:v libx264 -pix_fmt yuv420p endcard.mp4

# 2. Concat vidéo principale (sans son) + écran de fin, sous-titres incrustés, voix ElevenLabs par-dessus
"$FF" -y -i ugc-sellvora-10s.mp4 -i endcard.mp4 -i voix-elevenlabs.mp3 -filter_complex "\
[0:v]fps=30,format=yuv420p[v0];\
[1:v]fps=30,format=yuv420p[v1];\
[v0][v1]concat=n=2:v=1:a=0[vc];\
[vc]subtitles=subs.srt:force_style='FontName=Segoe UI,FontSize=13,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=1,MarginV=140,Alignment=2'[vout];\
[2:a]apad[aout]" \
-map "[vout]" -map "[aout]" -t 13 -c:v libx264 -crf 20 -c:a aac -b:a 160k ugc-sellvora-final.mp4

echo "OK: ugc-sellvora-final.mp4"
