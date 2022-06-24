import alfy from 'alfy';
import { fetch, getProjectFilePath, inputMatchesData } from './lib/utils.mjs';

async function main() {
  try {
    const file = getProjectFilePath();

    let projects = await fetch(file, {});

    if (alfy.input) {
      projects = inputMatchesData(projects, alfy.input, ['title', 'subtitle']);
    }
    // .sort((a, b) => a.title.localeCompare(b.title));
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

    if (projects.length === 0) {
      alfy.output([
        {
          title: 'No projects found',
        },
      ]);
    } else {
      // const fuck = alfy.inputMatches(projects, (item, input) =>
      //   item.title.toLowerCase().includes(input)
      // );

      // console.log('fuck', projects);

      alfy.output(
        projects.map((p) => ({
          title: p.title,
          subtitle: p.subtitle,
          // icon: p.icon,
          arg: p.folderUri,
          uid: p.uid,
        }))
      );

      // alfy.output([
      //   {
      //     title: 'Hello',
      //   },
      //   {
      //     title: 'Hello2',
      //   },
      // ]);
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
  } catch (err) {
    console.error(`[error] ${err}`);
  }
}

main();
