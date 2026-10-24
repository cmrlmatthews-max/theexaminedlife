#!/bin/bash
# convert staged MINI ART/42 Level III/*.jpeg into art/raw42/*.png
U="/mnt/user-data/uploads/Claude-Sandbox/Personal Projects/The Examined Life/MINI ART/42 Level III"
for f in "$U"/*.jpeg; do b=$(basename "$f" .jpeg); [ -f art/raw42/$b.png ] && [ art/raw42/$b.png -nt "$f" ] && continue; python3 -c "from PIL import Image; Image.open('$f').convert('RGB').save('art/raw42/$b.png')"; echo $b; done
