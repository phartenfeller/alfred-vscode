import alfy from 'alfy';
import { fetch, getProjectFilePath, inputMatchesData } from './lib/utils.mjs';

async function main() {
  try {
    const file = getProjectFilePath();
    // console.log(`[info] Using file: ${file}`);
    // alfy.log(`[info] Using file: ${file}`);

    let projects = await fetch(file, {});

    if (alfy.input) {
      projects = inputMatchesData(projects, alfy.input, ['title', 'subtitle']);
    }

    // alfy.log(`[info] Found ${projects.length} projects`);
    // console.log(`[info] Found ${projects.length} projects`);

    if (projects.length === 0) {
      alfy.output([
        {
          title: 'No projects found',
        },
      ]);
    } else {
      const formatted = projects.map((p) => ({
        title: decodeURIComponent(p.title),
        subtitle: decodeURIComponent(p.subtitle),
        // icon: p.icon,
        arg: p.folderUri,
        uid: p.uid,
      }));

      // console.log(`[info] Outputting projects:`, formatted);

      alfy.output(formatted);
    }
  } catch (err) {
    alfy.error(`[error] ${err}`);
    // console.error(`[error] ${err}`);
    throw err;
  }
}

main();
