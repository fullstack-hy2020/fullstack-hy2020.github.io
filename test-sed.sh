#!/bin/bash

find ./src/content -type f|grep zh | while read i
do
    sed -i  '' 's/lang: en/lang: zh/g' $i
done