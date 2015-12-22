#!/bin/bash

VERSION=$1

set -e

EXPECTED_ARGS=1

if [ $# -ne $EXPECTED_ARGS ]
then
echo "usage: scripts/prepare-release.sh VERSION"
exit
fi
echo "new SDK version: ${VERSION}"



update_doxygen_conf() {
	the_file=docs/doxygen.conf
	sed -i.bak "s/^PROJECT_NUMBER = \(.*\)$/PROJECT_NUMBER = ${VERSION}/g" $the_file
	rm ${the_file}.bak
}

update_doxygen_conf

echo 'updated project version for phonegap plugin'
echo 'Please verify that the changes are correct'
git diff
echo ''
echo ''
echo 'You may commit the changes now with:'
echo "   git commit -a -m 'bump version to ${VERSION}'"
