#!/bin/bash
# Run this from C:\Users\Admin\hlasuj-sk in Git Bash
cd "$(dirname "$0")"
rm -f .git/index.lock
git add .
git commit -m "fix(vote): optional chain on optionIds; extend lint-staged to prettier all file types"
git push
