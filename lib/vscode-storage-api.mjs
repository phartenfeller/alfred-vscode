/* eslint-disable prefer-regex-literals */
import BetterSqlite3 from 'better-sqlite3';

// source: https://github.com/microsoft/PowerToys/blob/35c14385146e7dc8aec50f0c1cf7fb23da462906/src/modules/launcher/Plugins/Community.PowerToys.Run.Plugin.VSCodeWorkspaces/WorkspacesHelper/VSCodeWorkspacesApi.cs#L154
const query = `SELECT value FROM ItemTable WHERE key LIKE 'history.recentlyOpenedPathsList'`;

const localWs = new RegExp('^file://(.+)$');
const remoteSshWs = new RegExp('^vscode-remote://ssh-remote+(.+?(?=/))(.+)$');
const remoteWslWs = new RegExp('^vscode-remote://wsl+(.+?(?=/))(.+)$');
const codespacesWs = new RegExp('^vscode-remote://vsonline+(.+?(?=/))(.+)$');
const devContainerWs = new RegExp(
  '^vscode-remote://dev-container+(.+?(?=/))(.+)$'
);

// mostly copied from https://github.com/microsoft/PowerToys/blob/35c14385146e7dc8aec50f0c1cf7fb23da462906/src/modules/launcher/Plugins/Community.PowerToys.Run.Plugin.VSCodeWorkspaces/WorkspacesHelper/ParseVSCodeUri.cs#L21
function getWorkspaceType(path) {
  if (!path) return null;
  const cleaned = path.replace('%2B', '+');

  let match = localWs.exec(cleaned);
  if (match) {
    console.log(cleaned, 'local', JSON.stringify(match));
    return { type: 'Local', machineName: null, path: match[0] };
  }

  match = remoteSshWs.exec(cleaned);
  if (match) {
    console.log(cleaned, 'remoteSSH', JSON.stringify(match));

    return {
      type: 'RemoteSSH',
      machineName: match[1].replace('+', ''),
      path: match[2],
    };
  }

  match = remoteWslWs.exec(cleaned);
  if (match) {
    console.log(cleaned, 'RemoteWSL', JSON.stringify(match));

    return {
      type: 'RemoteWSL',
      machineName: match[1].replace('+', ''),
      path: match[2],
    };
  }

  match = codespacesWs.exec(cleaned);
  if (match) {
    console.log(cleaned, 'Codespace', JSON.stringify(match));
    return {
      type: 'Codespace',
      machineName: match[1].replace('+', ''),
      path: match[2],
    };
  }

  match = devContainerWs.exec(cleaned);
  if (match) {
    console.log(cleaned, 'DevContainer', JSON.stringify(match));
    return {
      type: 'DevContainer',
      machineName: match[1].replace('+', ''),
      path: match[2],
    };
  }

  return {
    type: 'unknown',
    machineName: null,
    path: cleaned,
  };
}

function processRow(row) {
  console.log('before parse', typeof row);
  const { entries } = JSON.parse(row.value);
  // const json = row;
  console.log('after parse');

  return entries.map((item) => ({
    item: item.label,
    remoteAuthority: item.remoteAuthority,
    folderUri: item.folderUri,
    ...getWorkspaceType(item.folderUri),
  }));
}

function queryProjects(storagePath) {
  const db = new BetterSqlite3(storagePath, { readonly: true });

  const stmnt = db.prepare(query);
  const row = stmnt.get([]);
  db.close();

  return row;
}

function getLastItem(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}

function getProjects(storagePath) {
  console.log('storagePath', storagePath);
  const row = queryProjects(storagePath);
  const results = processRow(row);

  return results
    .filter((r) => r && r.type)
    .map((r) => ({
      item: r.item,
      remoteAuthority: r.remoteAuthority,
      type: r.type,
      machineName: r.machineName,
      path: r.path,

      title: r.machineName
        ? `${r.machineName} » ${getLastItem(r.path)}`
        : getLastItem(r.path),
      subtitle: r.path,
      icon: { path: 'icon.png' },
      uid: r.folderUri,
    }));
}

export default getProjects;
