const path = require('path');
const { union } = require('lodash');
const fs = require('fs');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const getChildrenDirectoryPaths = (folderPath) => new Promise((resolve, reject) => {
  const pathsArray = [];
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      reject(err);
      process.exit(1);
    }
    files.forEach(async (file) => {
      const fullPath = path.join(folderPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        pathsArray.push(fullPath);
      }
    });
    resolve(pathsArray);
  });
});
const pagesBuilder = async ({ actions }) => {
  const { createPage } = actions;
  const extensionsFolder = path.join(__dirname, './src/components/extensions');

  const componentsFolders = await getChildrenDirectoryPaths(extensionsFolder);
  const versionsFolders = Array.prototype.concat.apply([],
    await Promise.all(
      componentsFolders.map((folder) => getChildrenDirectoryPaths(folder)),
    ));

  versionsFolders.map((folderPath) => {
    console.log(folderPath);
    const slug = folderPath.replace(extensionsFolder, '').toLowerCase();
    console.log(slug);
    createPage({
      path: slug,
      component: `${folderPath}/index.js`,
      context: {
        slug,
      },
    });
  });


  // fs.readdir(extensionsFolder, (err, files) => {
  //   if (err) {
  //     console.error('Could not list the directory.', err);
  //     process.exit(1);
  //   }

  //   // Loop over folders
  //   files.forEach((componentFolder) => {
  //     const fullComponentFolderPath = path.join(extensionsFolder, componentFolder);

  //     fs.stat(fullComponentFolderPath, (errorStat, stat) => {
  //       if (stat.isDirectory()) {
  //         // Loop through versions and create pages
  //         fs.readdir(componentFolder, (errorVersion, versionFolders) => [
  //           versionFolders.forEach((versionFolder) => {
  //             fs.stat(versionFolder, (error, vStat) => {
  //               if (vStat.isDirectory()) {
  //                 console.log('VERSIONS', versionFolder);
  //               }
  //             });
  //           }),
  //         ]);
  //       }
  //       console.log('IS DIRECTORY', stat.isDirectory());
  //     });
  //   });
  // });
};

exports.createPages = pagesBuilder;
