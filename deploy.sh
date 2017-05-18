#!/usr/bin/env bash
echo -e "public/ \nsrc/ \n.babelrc \n.flowconfig \npackage.json \nREADME.md" >> .gitignore
rsync -a build/* .
