const fs = require("fs");

const importer = ({
  extension,
  folderPath,
  customImportStatement = "import $customComponentName from '$pathName';",
  outputFile = "index.js",
  customExportStatement = "export {$components};",
}) => {
  const data = [];
  const fileNames = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const componentName = `${file
      .replace(`.${extension}`, "")
      .replaceAll("-", "_")}`;
    let importStatement = "";

    if (fs.lstatSync(folderPath + "/" + file).isDirectory()) {
      const filePathName = `./${file}/${file}.${extension}`;
      importStatement = customImportStatement
        .replace("$customComponentName", componentName)
        .replace("$pathName", filePathName);
    } else if (file.endsWith(extension)) {
      importStatement = customImportStatement
        .replace("$customComponentName", componentName)
        .replace("$pathName", `./${file}`);
      // importStatement = `import ${componentName} from "./${file}";`;
    }

    if (importStatement.length > 0 && !fileNames.includes("index.js")) {
      data.push(importStatement);
      fileNames.push(componentName);
    }
  });
  const exportStatement = customExportStatement.replace(
    "$components",
    fileNames.join(", ")
  );
  data.push(exportStatement);
  // const exportStatement = `export { ${fileNames.join(", ")} };`;
  // data.push(exportStatement);

  fs.writeFileSync(folderPath + `/${outputFile}`, data.join("\n"));
};

// to import all components to index.js of components/ folder
importer({ extension: "jsx", folderPath: "./src/components" });

importer({ extension: "js", folderPath: "./src/context" });
importer({ extension: "jsx", folderPath: "./src/pages" });
