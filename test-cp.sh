#!/bin/bash

find ./src/content -type d -name '*en'|awk -F "/" '{print $1"/"$2"/"$3"/"$4}' | while read i
do
    cp -r $i/en $i/zh
done