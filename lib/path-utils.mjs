import { homedir } from 'os';

export const homeDir = homedir();
export const homePathVariable = '$home';

/**
 * Indicates if a path is a UNC path
 *
 * @public
 * @param {String} path The path to check
 * @returns {Boolean}
 */
export function pathIsUNC(path) {
  return path.indexOf('\\\\') === 0;
}

/**
 * If the project path is in the user's home directory then store the home directory as a
 * parameter. This will help in situations when the user works with the same projects on
 * different machines, under different user names.
 *
 * @public
 * @param {String} path The path to compact
 * @returns {String}
 */
export function compactHomePath(path) {
  if (path.indexOf(homeDir) !== 0) return path;

  return path.replace(homeDir, homePathVariable);
}

/**
 * Expand $home parameter from path to real os home path
 *
 * @public
 * @param {String} path The path to expand
 * @returns {String}
 */
export function expandHomePath(path) {
  if (path.indexOf(homePathVariable) !== 0) return path;

  return path.replace(homePathVariable, homeDir);
}

/**
 * Expand $home parameter from path to real os home path
 *
 * @public
 * @param {Object[]} items The array of items <QuickPickItem> to expand
 * @returns {Object[]}
 */
export function expandHomePaths(items) {
  return items.map((item) => ({
    ...item,
    description: expandHomePath(item.description),
  }));
}
