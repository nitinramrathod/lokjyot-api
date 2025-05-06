const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');
const path = require('node:path');

function removeStartingPublic(path) {
  if (path.startsWith('/public')) {
    return path.replace(/^\/public/, '') || '/';
  }
  return path;
}

const saveFile = async (part, filepathPrefix = '/public/images/news') => {
  // Ensure the folder exists, create it if not
  if (!fs.existsSync(`.${filepathPrefix}`)) {
    fs.mkdirSync(`.${filepathPrefix}`, { recursive: true });
  }
  const uniqueFilename = `${Date.now()}-${part.filename}`;
  const filePath = path.join(`.${filepathPrefix}`, uniqueFilename);

  // Save file to the public folder
  await pipeline(part.file, fs.createWriteStream(filePath));

     // Prepare the public URL path by stripping 'public'
     const publicUrlPath = removeStartingPublic(filepathPrefix);

  // Store file details
  let fileData = {
    fieldname: part.fieldname,
    filename: part.filename,
    mimetype: part.mimetype,
    encoding: part.encoding,
    path: `${publicUrlPath}/${uniqueFilename}`
  };
  return fileData;
}

module.exports = saveFile
