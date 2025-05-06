const saveFile = require("../imageUploader");
const uploadCoudinary = require("../uploadCloudinary");

const bodyParser = async (request, filepathPrefix) => {
    let fields = {};
    const parts = request.parts();

    for await (const part of parts) {
        if (part.type === 'file') {
            console.log('in bodyParser', part.fieldname);
            // fields[part.fieldname] = await saveFile(part, filepathPrefix);
            fields[part.fieldname] = await uploadCoudinary(part);
        } else {
            fields[part.fieldname] = part.value;
        }
    }
    return fields
}

module.exports = bodyParser;