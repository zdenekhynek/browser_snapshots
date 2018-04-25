#! /usr/bin/env bash

# Arguments = -d
usage() {
cat << EOF
usage: $0 options

This script will deploy the app to Elastic Beanstalk

OPTIONS:
   -h      Show this message
   -e      <env> "production" or "staging"
EOF
}

# Fails early on errors
set -e

TARGET_ENV=
REACT_APP_BUILD_MODE=
SETTINGS_MODULE=
EB_ENV="Not defined"
CWD=$(pwd)

while getopts "he:" OPTION; do
    case $OPTION in
        h) usage; exit 1 ;;
        e) TARGET_ENV=$OPTARG ;;
    esac
done

#if [ "$TARGET_ENV" != "production" ] && [ "$TARGET_ENV" != "staging" ]; then
if [ "$TARGET_ENV" != "production" ]; then
    echo "The target environment can only be \"production\""
    exit 1
fi

# if [ "$TARGET_ENV" == "staging" ]; then
#     EB_ENV="sn7257TrueDatYoutub-staging"
#     SETTINGS_MODULE="staging"
#     REACT_APP_BUILD_MODE="staging"
#     WEBPACK_STATS_FILE="webpack-stats-staging.json"
# fi

if [ "$TARGET_ENV" == "production" ]; then
    EB_ENV="sn7257TrueDatYoutub-production"
    SETTINGS_MODULE="production"
    REACT_APP_BUILD_MODE="production"
    WEBPACK_STATS_FILE="webpack-stats-production.json"
fi

echo "=> Install all the dependencies"
# pipenv install -d

# Elastic Beanstalk doesn't know about pipenv, so cannot use pipfile
# we need to generate requrements.txt for it, so that EB installs all the
# dependencies
pipenv run pip freeze > requirements.txt


echo "=> Runs the tests"
# TODO ENABLE TESTS AGAIN!
#pipenv run pytest

# npm run lint

echo "=> Clean up the previous build"
if [ -d ./.tmp_dist ]; then
    rm -r ./.tmp_dist
fi
if [ -d ./static ]; then
    rm -r ./static
fi

mkdir ./.tmp_dist
mkdir ./static
touch ./static/empty


echo "=> Compile React app"
cd frontend
# npm i
npm run build:$REACT_APP_BUILD_MODE
cd ..

echo "=> Generate all the assets"
pipenv run python manage.py collectstatic --no-input # no need to specify settings here

echo "=> Create an archive"
git archive -v --format=zip -o .tmp_dist/archive.zip HEAD

# add requirements file which is needed for Elastic Beanstalk environment
zip -ur .tmp_dist/archive.zip requirements.txt
# remove it
rm requirements.txt

# add webpack stats file
zip -ur .tmp_dist/archive.zip $WEBPACK_STATS_FILE

# add static files
zip -ur .tmp_dist/archive.zip static

# Deploys
echo "=> Deploys to EB"
eb deploy $EB_ENV
