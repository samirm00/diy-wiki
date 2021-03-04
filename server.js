'use strict';

// require built-in dependencies
const path = require('path');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

// require express-related dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// require local dependencies
const logger = require('./middleware/logger');

// declare local constants and helper functions
const PORT = process.env.PORT || 4600;
const DATA_DIR = 'data';
const TAG_RE = /#\w+/g;
const slugToPath = (slug) => {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
};

// initialize express app
const app = express();

// use middlewares
app.use(cors());
app.use(logger);
app.use(bodyParser.json());
// this commented line of code will statically serve the frontend
// it will not work until you:
// $ cd client
// $ yarn install
// $ yarn build
app.use('/', express.static(path.join(__dirname, 'client', 'build')));

// GET: '/api/page/:slug'
// success response: {status: 'ok', body: '<file contents>'}
// failure response: {status: 'error', message: 'Page does not exist.'}
app.get('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  try {
    const body = await readFile(filename, 'utf-8');
    res.json({ status: 'ok', body });
  } catch (e) {
    res.json({ status: 'error', message: 'Page does not exist.' });
  }
});

// POST: '/api/page/:slug'
//  body: {body: '<file text content>'}
// tries to write the body to the given file
//  success response: {status: 'ok'}
//  failure response: {status: 'error', message: 'Could not write page.'}
app.post('/api/page/:slug', async (req, res) => {
  const filename = slugToPath(req.params.slug);
  const fileText = req.body.body;
  try {
    writeFile(filename, fileText);
    res.json({ status: 'ok' });
  } catch (e) {
    res.json({ status: 'error', message: 'Could not write page.' });
  }
});

// GET: '/api/pages/all'
// sends an array of all file names in the DATA_DIR
// file names do not have .md, just the name!
//  success response: {status:'ok', pages: ['fileName', 'otherFileName']}
//  failure response: no failure response
app.get('/api/pages/all', async (req, res) => {
  try {
    const fileNames = await readDir(DATA_DIR);
    const arrayOfFileNames = [];
    fileNames.forEach((file) => {
      const onlyFileName = file.split('.').splice(0, 1).join('');
      arrayOfFileNames.push(onlyFileName);
    });

    res.json({ status: 'ok', pages: arrayOfFileNames });
  } catch (err) {
    console.error(err);
  }
});

// GET: '/api/tags/all'
// sends an array of all tag names in all files, without duplicates!
// tags are any word in all documents with a # in front of it
// hint: use the TAG_RE regular expression to search the contents of each file
//  success response: {status:'ok', tags: ['tagName', 'otherTagName']}
//  failure response: no failure response
app.get('/api/tags/all', async (req, res) => {
  try {
    const fileNames = await readDir(DATA_DIR);
    // read each file in the array of file names
    const arrayOfTagNames = [];
    fileNames.forEach((file) => {
      const fileContents = fs.readFileSync(`${DATA_DIR}/${file}`, 'utf-8');
      let match;
      if (fileContents.match(TAG_RE)) {
        match = fileContents.match(TAG_RE);
        for (let i = 0; i < match.length; i++) {
          let newName = match[i].replace('#', '');
          if (!arrayOfTagNames.includes(newName)) {
            arrayOfTagNames.push(newName);
          }
        }
      }
    });

    // find tag names in all files

    res.json({ status: 'ok', tags: arrayOfTagNames });
  } catch (err) {
    console.error(err);
  }
});

// GET: '/api/tags/:tag'
// searches through the contents of each file looking for the :tag
// it will send an array of all file names that contain this tag (without .md!)
//  success response: {status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}
//  failure response: no failure response
app.get('/api/tags/:tag', async (req, res) => {
  const tag = req.params.tag;

  try {
    const fileNames = await readDir(DATA_DIR);
    const fileNameWithTag = [];
    fileNames.forEach((file) => {
      const fileNameOnly = file.split('.').slice(0, 1).join('');
      const fileContents = fs.readFileSync(`${DATA_DIR}/${file}`);
      if (fileContents.includes(`#${tag}`)) {
        fileNameWithTag.push(fileNameOnly);
      }
    });
    res.json({ status: 'ok', tag: tag, pages: fileNameWithTag });
  } catch (err) {
    console.error(err);
  }
});

// this needs to be here for the frontend to create new wiki pages
//  if the route is not one from above
//  it assumes the user is creating a new page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Wiki app is serving at http://localhost:${PORT}`);
});
