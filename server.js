const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/cyoa', {
  useNewUrlParser: true
});

const playerSchema = new mongoose.Schema({
  id: String,
  race: Number,
  raceName: String,
  classId: Number,
  className: String,
  level: Number,
  exp: Number,
  attack: Number,
  defense: Number,
  health: Number,
  maxHealth: Number,
  gold: Number,
  weaponName: String,
  weaponWorth: Number,
  armorName: String,
  armorWorth: Number,
  questTarget: Number,
  questCount: Number,
  questEnemy: String,
  questWorth: Number,
  locationName: String
});

const pageSchema = new mongoose.Schema({
  pageName: String,
  pageText: String,
  path: String,
  options: [{optionText: String, optionClick: String}]
});

const enemySchema = new mongoose.Schema({
  enemyName: String,
  enemyText: String,
  attack: Number,
  defense: Number,
  health: Number,
  expWorth: Number,
  goldWorth: Number,
  locationName: String,
  path: String
});

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Creating models
const Player = mongoose.model('Player', playerSchema);
const Page = mongoose.model('Page', pageSchema);
const Enemy = mongoose.model('Enemy', enemySchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new player
app.post('/api/players', async (req, res) => {
  const player = new Player({
    id: req.body.id,
    race: req.body.race,
    raceName: req.body.raceName,
    classId: req.body.classId,
    className: req.body.className,
    level: req.body.level,
    exp: req.body.exp,
    attack: req.body.attack,
    defense: req.body.defense,
    health: req.body.health,
    maxHealth: req.body.maxHealth,
    gold: req.body.gold,
    weaponName: req.body.weaponName,
    weaponWorth: req.body.weaponWorth,
    armorName: req.body.armorName,
    armorWorth: req.body.armorWorth,
    questTarget: req.body.questTarget,
    questCount: req.body.questCount,
    questEnemy: req.body.questEnemy,
    questWorth: req.body.questWorth,
    locationName: req.body.locationName
  });
  try {
    await player.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Load a player given an id
app.get('/api/players/:id', async (req, res) => {
  try {
    let player = await Player.findOne({
      id: req.params.id
    });
    res.send(player);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the pages.
app.get('/api/pages', async (req, res) => {
  try {
    let pages = await Page.find();
    res.send(pages);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Load a page given a name
app.get('/api/pages/:pageName', async (req, res) => {
  try {
    let page = await Page.findOne({
      pageName: req.params.pageName
    });
    res.send(page);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new page
app.post('/api/pages', async (req, res) => {
  const page = new Page({
    pageName: req.body.pageName,
    pageText: req.body.pageText,
    path: req.body.path,
    options: req.body.options
  });
  try {
    await page.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Editing a specific page
app.put('/api/pages/:pageName', async (req, res) => {
  try {
    let page = await Page.findOne({
      pageName: req.params.pageName
    });
	
	page.pageText = req.body.pageText;
	page.path = req.body.path;
	page.options = req.body.options;
	page.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Deleting a specific page
app.delete('/api/pages/:pageName', async (req, res) => {
  try {
    await Page.deleteOne({
      pageName: req.params.pageName
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the enemies.
app.get('/api/enemies', async (req, res) => {
  try {
    let enemies = await Enemy.find();
    res.send(enemies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new enemy
app.post('/api/enemies', async (req, res) => {
  const enemy = new Enemy({
    enemyName: req.body.enemyName,
    enemyText: req.body.enemyText,
    attack: req.body.attack,
    defense: req.body.defense,
    health: req.body.health,
    expWorth: req.body.expWorth,
    goldWorth: req.body.goldWorth,
	locationName: req.body.locationName,
	path: req.body.path
  });
  try {
    await enemy.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Editing a specific enemy
app.put('/api/enemies/:enemyName', async (req, res) => {
  try {
    let enemy = await Enemy.findOne({
      enemyName: req.params.enemyName
    });
	
	enemy.enemyText = req.body.enemyText;
    enemy.attack = req.body.attack;
    enemy.defense = req.body.defense;
    enemy.health = req.body.health;
    enemy.expWorth = req.body.expWorth;
    enemy.goldWorth = req.body.goldWorth;
	enemy.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Deleting a specific enemy
app.delete('/api/enemies/:enemyName', async (req, res) => {
  try {
    await Enemy.deleteOne({
      enemyName: req.params.enemyName
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
