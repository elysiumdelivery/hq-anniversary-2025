#!/bin/sh

# resizes images in the static folder
magick mogrify -resize 512x512\> images/corkboard-img/entries/*?polaroid.png
magick mogrify -resize 2048x2048\> images/corkboard-img/entries/*.jpg
magick mogrify -resize 2048x2048\> images/corkboard-img/entries/*.png

# for file in $(find images/ -name '*.png'); do cwebp -q 100 "$file" -o "${file%.png}.webp"; done
for file in $(find images/ -name '*.png'); do exiftool -EXIF= "$file"; done