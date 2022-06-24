import alfy from 'alfy';
import fs from 'fs';
import fuzzysort from 'fuzzysort';
import path from 'path';
import { homeDir } from './path-utils.mjs';
import getProjects from './vscode-storage-api.mjs';

const STORAGE_FILE = 'state.vscdb';
/**
 * Filter projects
 *
 * @public
 * @param {Object[]} list List of data objects
 * @param {String} input Search input
 * @param {Array} keys Props to search
 * @returns {Array} Filtered list
 */
export function inputMatchesData(list, input, keys) {
  if (!input || [list, keys].filter(Array.isArray).length !== 2) return list;

  return fuzzysort
    .go(input, list, {
      limit: 100,
      threshold: -10000,
      keys,
    })
    .map((result) => result.obj);
}

export async function fetch(url, options = {}) {
  const rawKey = url + JSON.stringify(options);
  const key = rawKey.replace(/\./g, '\\.');
  const cachedResponse = alfy.cache.get(key, { ignoreMaxAge: true });

  if (cachedResponse && !alfy.cache.isExpired(key)) {
    return Promise.resolve(cachedResponse);
  }

  let projects;

  try {
    projects = await getProjects(url);
  } catch (err) {
    alfy.log(`[error] Could not get data: ${err}`);
    throw err;
  }

  if (options.maxAge) {
    alfy.cache.set(key, projects, { maxAge: options.maxAge });
  }

  return projects;
}

export function getChannelPath(appdata = '', vscodeEdition = 'code') {
  if (
    vscodeEdition === 'code-insiders' &&
    fs.existsSync(''.concat(appdata, '/Code - Insiders'))
  ) {
    return 'Code - Insiders';
  }

  if (
    vscodeEdition === 'codium' &&
    fs.existsSync(''.concat(appdata, '/VSCodium'))
  ) {
    return 'VSCodium';
  }

  return 'Code';
}

export function getProjectFilePath() {
  let appdata;

  const {
    env: { APPDATA, HOME, vscodeEdition },
  } = process;

  if (APPDATA) {
    appdata = APPDATA;
  } else {
    appdata =
      process.platform === 'darwin'
        ? ''.concat(HOME, '/Library/Application Support')
        : '/var/local';
  }

  const channelPath = getChannelPath(appdata, vscodeEdition);
  const relativeProjectFilePath = path.join(
    channelPath,
    'User/globalStorage',
    STORAGE_FILE
  );

  let projectFile = path.join(appdata, relativeProjectFilePath);

  // In linux, it may not work with /var/local, then try to use /home/myuser/.config
  if (process.platform === 'linux' && fs.existsSync(projectFile) === false) {
    projectFile = path.join(homeDir, '.config/', relativeProjectFilePath);
  }

  return projectFile;
}
