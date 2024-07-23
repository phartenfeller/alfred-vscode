import alfy from 'alfy';
import { fetch, getProjectFilePath, inputMatchesData } from './lib/utils.mjs';

async function main() {
  try {
    const file = getProjectFilePath();

    let projects = await fetch(file, {});

    if (alfy.input) {
      projects = inputMatchesData(projects, alfy.input, ['title', 'subtitle']);
    }

    if (projects.length === 0) {
      alfy.output([
        {
          title: 'No projects found',
        },
      ]);
    } else {
      alfy.output(
        projects.map((p) => ({
          title: decodeURIComponent(p.title),
          subtitle: decodeURIComponent(p.subtitle),
          // icon: p.icon,
          arg: p.folderUri,
          uid: p.uid,
        }))
      );
    }
  } catch (err) {
    console.error(`[error] ${err}`);
  }
}

main();
