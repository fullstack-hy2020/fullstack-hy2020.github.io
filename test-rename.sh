#!/bin/bash

find ./src/content -type f|grep zh | while read i
do
    cp $i /tmp/part
done