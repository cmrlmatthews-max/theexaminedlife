#!/bin/bash
# convert staged MINI ART/43 Level IV/*.jpeg into art/raw43/*.png
U="/mnt/user-data/uploads/Claude-Sandbox/Personal Projects/The Examined Life/MINI ART/43 Level IV"
for f in "$U"/*.jpeg; do b=$(basename "$f" .jpeg); [ -f art/raw43/$b.png ] && [ art/raw43/$b.png -nt "$f" ] && continue; python3 -c "from PIL import Image; Image.open('$f').convert('RGB').save('art/raw43/$b.png')"; echo $b; done
