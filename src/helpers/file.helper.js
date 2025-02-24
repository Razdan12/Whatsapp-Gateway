import fs from "fs"
export function removeFile(filepath) {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return true
}
