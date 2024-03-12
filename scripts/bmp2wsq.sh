#!/usr/bin/env bash

set -euo pipefail

depth=1
width=1
height=1

for bmpfile in "$tmpdir"/*.bmp; do
    rawfile=$(basename "$bmpfile" .bmp).raw
    wsqfile=$(basename "$bmpfile" .bmp).wsq

    convert "$bmpfile" -depth "$depth" -size "${width}x${height}" "gray:${rawfile}"
    cwsq raw sample_image.raw -r 0.75

    rm "$bmpfile"
done
