const fs = require('fs');

const OUT_DIR = 'data/';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

class FileManager {
  constructor(filename, initialValue = {}) {
    this.filepath = `./${OUT_DIR}${filename}.json`;

    if (fs.existsSync(this.filepath)) {
      const jsonData = fs.readFileSync(this.filepath, 'utf8');
      this.data = JSON.parse(jsonData);
    } else {
      this.data = initialValue;
      this.save();
    }
  }

  save() {
    fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2));
  }
}

module.exports = FileManager;
