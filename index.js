import alfy from 'alfy';
import { fetch, getProjectFilePath, inputMatchesData } from './lib/utils.mjs';

async function main() {
  const file = getProjectFilePath();

  const projects = await fetch(file, {});

  const matchedProjects = inputMatchesData(projects, alfy.input, [
    'title',
    'subtitle',
  ]); // .sort((a, b) => a.title.localeCompare(b.title));
  // .map((project) => ({
  //   title: utils.getTitle(project),
  //   subtitle: utils.getSubtitle(project),
  //   icon: utils.getIcon(project),
  //   arg: utils.getArgument(project),
  //   valid: true,
  //   text: {
  //     copy: utils.getArgument(project),
  //   },
  // }) );

  if (matchedProjects.length === 0) {
    alfy.output([
      {
        title: 'No projects found',
      },
    ]);
  } else {
    alfy.output([
      {
        title: 'Hello',
      },
      {
        title: 'Hello2',
      },
    ]);
    /*
    alfy.log('output time...');

    const res = matchedProjects.map((p) => ({
      title: p.title,
      subtitle: p.subtitle,
      icon: p.icon,
      arg: p.title,
      uid: p.uid,
    }));

    alfy.output(res);
    */
  }
}

main();
