<template>
 <div class="load">
	<div class="load_text">Please enter your character's save id: <input v-model="id" placeholder="Save-Id"></div>
	<button @click="load">Load Save</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Load",
  data() {
	return {
      id: "",
    }
  },
  methods: {
    async load() {
		try {
			let response = await axios.get('/api/players/' + this.id);
			
			this.$root.$data.player.Race = response.data.race;
			this.$root.$data.player.RaceName = response.data.raceName;
			this.$root.$data.player.Class = response.data.classId;
			this.$root.$data.player.ClassName = response.data.className;
			this.$root.$data.player.Level = response.data.level;
			this.$root.$data.player.Exp = response.data.exp;
			this.$root.$data.player.Attack = response.data.attack;
			this.$root.$data.player.Defense = response.data.defense;
			this.$root.$data.player.Health = response.data.health;
			this.$root.$data.player.MaxHealth = response.data.maxHealth;
			this.$root.$data.player.Gold = response.data.gold;
			this.$root.$data.player.WeaponName = response.data.weaponName;
			this.$root.$data.player.WeaponWorth = response.data.weaponWorth;
			this.$root.$data.player.ArmorName = response.data.armorName;
			this.$root.$data.player.ArmorWorth = response.data.armorWorth;	
			this.$root.$data.player.QuestTarget = response.data.questTarget;
			this.$root.$data.player.QuestCount = response.data.questCount;
			this.$root.$data.player.QuestEnemy = response.data.questEnemy;
			this.$root.$data.player.QuestWorth = response.data.questWorth;
			this.$root.$data.player.Location = response.data.locationName;
			
			this.$alert("Click on 'Adventure' to continue!", "Load Successful!");
			
		} catch (error) {
			this.$alert("", "Invalid Save ID!");
		}
	}
  }
};
</script>

<style>

.load_text {
	padding-top: 15px;
	padding-bottom: 15px;
    font-family: 'Lucida Console';
}

</style>