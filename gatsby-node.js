const path = require('path');
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
    const slug = folderPath.replace(extensionsFolder, '').toLowerCase();
    console.log(`http://localhost:8000${slug}`);
    createPage({
      path: slug,
      component: `${folderPath}/index.js`,
      context: {
        slug,
      },
    });
  });
};

exports.createPages = pagesBuilder;

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /contentful-ui-extensions-sdk/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
