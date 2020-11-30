<template>
	<div class="admin content">
		<h1>Admin Page</h1>
		<div class="heading">
			<div class="circle">1</div>
			<h2>Add a new page</h2>
		</div>
		<div class="addPage">
			<div class="form">
				<input v-model="pageName" placeholder="Page Name">
				<p></p>
				<textarea v-model="pageText" placeholder="Page Text"></textarea>
				<p></p>
				<h4>Options</h4>
				<div class="option" v-for="s in options" :key="s.index">
					<input v-model="s.optionText" placeholder="Option Text">
					<input v-model="s.optionClick" placeholder="Option OnClick">
					<button @click="removeOption(s.index)">Remove Option</button>
				</div>
				<button @click="addOption">Add Option</button>
				<p></p>
				<input type="file" name="photo" @change="pageFileChanged">
				<button @click="uploadPage">Upload</button>
			</div>
		</div>
		
		<div class="heading">
			<div class="circle">2</div>
			<h2>Edit/Delete a Page and set option on-clicks</h2>
		</div>
		<div class="edit">
			<div class="form">
				<input v-model="findPageName" placeholder="Search">
				<div class="suggestions" v-if="pageSuggestions.length > 0">
					<div class="suggestion" v-for="s in pageSuggestions" :key="s.id" @click="selectPage(s)">{{s.pageName}}</div>
				</div>
			</div>
			<div class="upload" v-if="findPage">
				<h4>{{findPage.pageName}}</h4>
				<p></p>
				<textarea v-model="findPage.pageText"></textarea>
				<p></p>
				<h4>Options</h4>
				<div class="option" v-for="s in findPage.options" :key="s.index">
					<input v-model="s.optionText" placeholder="Option Text">
					<input v-model="s.optionClick" placeholder="Option OnClick">
					<button @click="removeOptionEdit(s.index)">Remove Option</button>
				</div>
				<button @click="addOptionEdit">Add Option</button>
				<p></p>
				<img :src="findPage.path" />
			</div>
			<div class="actions" v-if="findPage">
				<button @click="deletePage(findPage)">Delete</button>
				<button @click="editPage(findPage)">Edit</button>
			</div>
		</div>
		
		<div class="heading">
			<div class="circle">3</div>
			<h2>Add a new enemy</h2>
		</div>
		<div class="addEnemy">
			<div class="form">
				<input v-model="enemyName" placeholder="Enemy Name">
				<p></p>
				<span>
					Attack: <input v-model="attack" placeholder="0"> 
					Defense: <input v-model="defense" placeholder="0"> 
					Health: <input v-model="health" placeholder="10">
				</span>
				<p></p>
				<span>
					Exp on Defeat: <input v-model="expWorth" placeholder="0"> 
					Gold on Defeat: <input v-model="goldWorth" placeholder="0"> 
					Location: <input v-model="locationName" placeholder="Alleys">
				</span>
				<p></p>
				<textarea v-model="enemyText" placeholder="Enemy Text"></textarea>
				<p></p>
				<input type="file" name="photo" @change="enemyFileChanged">
				<button @click="uploadEnemy">Upload</button>
			</div>
		</div>
		
		<div class="heading">
			<div class="circle">4</div>
			<h2>Edit/Delete a Enemy</h2>
		</div>
		<div class="edit">
			<div class="form">
				<input v-model="findEnemyName" placeholder="Search">
				<div class="suggestions" v-if="enemySuggestions.length > 0">
					<div class="suggestion" v-for="s in enemySuggestions" :key="s.id" @click="selectEnemy(s)">{{s.enemyName}}</div>
				</div>
			</div>
			<div class="upload" v-if="findEnemy">
				<h4>{{findEnemy.enemyName}}</h4>
				<p></p>
				<span>
					Attack: <input v-model="findEnemy.attack"> 
					Defense: <input v-model="findEnemy.defense"> 
					Health: <input v-model="findEnemy.health">
				</span>
				<p></p>
				<span>
					Exp on Defeat: <input v-model="findEnemy.expWorth"> 
					Gold on Defeat: <input v-model="findEnemy.goldWorth"> 
					Location: <input v-model="findEnemy.locationName">
				</span>
				<p></p>
				<textarea v-model="findEnemy.enemyText"></textarea>
			</div>
			<div class="actions" v-if="findEnemy">
				<button @click="deleteEnemy(findEnemy)">Delete</button>
				<button @click="editEnemy(findEnemy)">Edit</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Admin',
	data() {
	return {
		pageName: "",
		pageText: "",
		enemyName: "",
		enemyText: "",
		attack: "",
		defense: "",
		health: "",
		expWorth: "",
		goldWorth: "",
		locationName: "",
		pageFile: null,
		enemyFile: null,
		options: [],
		pages: [],
		enemies: [],
		findPageName: "",
		findPage: null,
		findEnemyName: "",
		findEnemy: null
    }
  },
  computed: {
    pageSuggestions() {
      let pages = this.pages.filter(page => page.pageName.toLowerCase().startsWith(this.findPageName.toLowerCase()));
      return pages.sort((a, b) => a.pageName > b.pageName);
    },
	enemySuggestions() {
      let enemies = this.enemies.filter(enemy => enemy.enemyName.toLowerCase().startsWith(this.findEnemyName.toLowerCase()));
      return enemies.sort((a, b) => a.enemyName > b.enemyName);
    }
  },
  created() {
    this.getPages();
	this.getEnemies();
  },
  methods: {
    pageFileChanged(event) {
      this.pageFile = event.target.files[0]
    },
	enemyFileChanged(event) {
      this.enemyFile = event.target.files[0]
    },
	addOption() {
		this.options.push({optionText: "", optionClick: ""});
	},
	removeOption(index) {
		this.options.splice(index, 1);
	},
	addOptionEdit() {
		this.findPage.options.push({optionText: "", optionClick: ""});
	},
	removeOptionEdit(index) {
		this.findPage.options.splice(index, 1);
	},
	async uploadPage() {
		try {
			const formData = new FormData();
			formData.append('photo', this.pageFile, this.pageFile.name)
			let r1 = await axios.post('/api/photos', formData);
			await axios.post('/api/pages', {
				pageName: this.pageName,
				pageText: this.pageText,
				options: this.options,
				path: r1.data.path
			});
			this.getPages();
			this.$alert("", "Upload successful!");
		} catch (error) {
			console.log(error);
		}
	},
	async uploadEnemy() {
		try {
			const formData = new FormData();
			formData.append('photo', this.enemyFile, this.enemyFile.name)
			let r1 = await axios.post('/api/photos', formData);
			await axios.post('/api/enemies', {
				enemyName: this.enemyName,
				enemyText: this.enemyText,
				attack: this.attack,
				defense: this.defense,
				health: this.health,
				expWorth: this.expWorth,
				goldWorth: this.goldWorth,
				locationName: this.locationName,
				path: r1.data.path
			});
			this.getEnemies();
			this.$alert("", "Upload successful!");
		} catch (error) {
			console.log(error);
		}
	},
	async getPages() {
		try {
			let response = await axios.get("/api/pages");
			this.pages = response.data;
			return true;
		} catch (error) {
			console.log(error);
		}
	},
	async getEnemies() {
		try {
			let response = await axios.get("/api/enemies");
			this.enemies = response.data;
			return true;
		} catch (error) {
			console.log(error);
		}
	},
	selectPage(page) {
      this.findPageName = "";
      this.findPage = page;
    },
	selectEnemy(enemy) {
      this.findEnemyName = "";
      this.findEnemy = enemy;
    },
	async deletePage(page) {
      try {
        await axios.delete("/api/pages/" + page.pageName);
        this.findPage = null;
        this.getPages();
		this.$alert("", "Delete successful!");
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	async deleteEnemy(enemy) {
      try {
        await axios.delete("/api/enemies/" + enemy.enemyName);
        this.findEnemy = null;
        this.getEnemies();
		this.$alert("", "Delete successful!");
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	async editPage(page) {
      try {
		console.log(page);
        await axios.put("/api/pages/" + page.pageName, {
			pageName: this.findPage.pageName,
			pageText: this.findPage.pageText,
			options: this.findPage.options
        });
        this.findPage = null;
        this.getPages();
		this.$alert("", "Edit successful!");
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	async editEnemy(enemy) {
      try {
        await axios.put("/api/enemies/" + enemy.enemyName, {
			enemyName: this.findEnemy.enemyName,
			enemyText: this.findEnemy.enemyText,
			attack: this.findEnemy.attack,
			defense: this.findEnemy.defense,
			health: this.findEnemy.health,
			expWorth: this.findEnemy.expWorth,
			goldWorth: this.findEnemy.goldWorth,
			locationName: this.findEnemy.locationName
        });
        this.findPage = null;
        this.getEnemies();
		this.$alert("", "Edit successful!");
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>

body {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  background: #fff;
  padding: 0px;
  margin: 0px;
}

.content {
  padding: 20px 100px;
  min-height: 500px;
}

h1 {
  font-size: 20px;
}

h2 {
  font-size: 14px;
}

.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
}

.circle {
  box-sizing: content-box;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

textarea {
	height: 200px;
	width: 600px;
}

.form {
  text-align: left;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}
.option {
  padding-bottom: 5px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}
</style>