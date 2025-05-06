const saveFile = require("../imageUploader");

const bodyParser = async (request, filepathPrefix) => {
    let fields = {};
    const parts = request.parts();

    for await (const part of parts) {
        if (part.type === 'file') {
            fields[part.fieldname] = await saveFile(part, filepathPrefix);
        } else {
            fields[part.fieldname] = part.value;
        }
    }
    return fields
}

module.exports = bodyParser;