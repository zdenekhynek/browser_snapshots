"""
A set of utils methods to be used

Consider splitting this module if it starts getting too big.
"""
import os

import raven
from raven.exceptions import InvalidGitRepository


def is_sha1(maybe_sha):
    if len(maybe_sha) != 40:
        return False
    try:
        int(maybe_sha, 16)
    except ValueError:
        return False
    return True


def get_git_version(base_dir):
    try:
        version = raven.fetch_git_sha(base_dir)
    except InvalidGitRepository:
        version_file_path = os.path.join(base_dir, 'version.txt')
        with open(version_file_path) as f:
            version = f.readline()
            version = version.strip()
            version = version if is_sha1(version) else 'unknown'

        return version
