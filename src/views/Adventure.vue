<template>
	<CombatPage v-if="isCombat"/>
	<AdventurePage v-else :pageName="pageName"/>
</template>

<script>
import CombatPage from "../components/CombatPage.vue"
import AdventurePage from "../components/AdventurePage.vue"
import axios from 'axios';

export default {
  name: 'Adventure',
  components: {
    CombatPage,
	AdventurePage,
  },
  computed: {
	isCombat() {
		if (this.$root.$data.enemyName != "") {
			return true;
		}
		else {
			return false;
		}
	},
	
	pageName() {
		return this.$root.$data.player.Location;
	}
  },
  methods: {
	changePage(page) {
		this.$root.$data.player.Location = page;
	},
	addEnemy(enemy) {
		this.$root.$data.enemyName = enemy;
	},
	removeEnemy() {
		this.$root.$data.enemyName = "";
	},
	async save() {
		let saveId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		try {
			await axios.post('/api/players', {
				id: saveId,
				race: this.$root.$data.player.Race,
				raceName: this.$root.$data.player.RaceName,
				classId: this.$root.$data.player.Class,
				className: this.$root.$data.player.ClassName,
				level: this.$root.$data.player.Level,
				exp: this.$root.$data.player.Exp,
				attack: this.$root.$data.player.Attack,
				defense: this.$root.$data.player.Defense,
				health: this.$root.$data.player.Health,
				maxHealth: this.$root.$data.player.MaxHealth,
				gold: this.$root.$data.player.Gold,
				weaponName: this.$root.$data.player.WeaponName,
				weaponWorth: this.$root.$data.player.WeaponWorth,
				armorName: this.$root.$data.player.ArmorName,
				armorWorth: this.$root.$data.player.ArmorWorth,
				questTarget: this.$root.$data.player.QuestTarget,
				questCount: this.$root.$data.player.QuestCount,
				questEnemy: this.$root.$data.player.QuestEnemy,
				questWorth: this.$root.$data.player.QuestWorth,
				locationName: this.$root.$data.player.Location
			});
			
			this.$alert("Your save id is: " + saveId, "Save Successful!");
		} catch (error) {
			console.log(error);
		}
	
	},
	
	// I really dislike doing it like this, as this function is poorly decomposed, but I was having lots of bugs trying to put it in other files :/
	// Function handles the onCLick changes
	handleClick(option) {
	
		//Races page
		if (option == "human") {
			this.$root.$data.player.Race = 0;
			this.$root.$data.player.RaceName = "Human";
			this.$root.$data.player.Attack += 1;
			option = "classes"
		}
		else if (option == "elf") {
			this.$root.$data.player.Race = 1;
			this.$root.$data.player.RaceName = "Elf";
			this.$root.$data.player.Health += 10;
			this.$root.$data.player.MaxHealth += 10;
			option = "classes"
		}
		else if (option == "dwarf") {
			this.$root.$data.player.Race = 1;
			this.$root.$data.player.RaceName = "Dwarf";
			this.$root.$data.player.Defense += 1;
			option = "classes"
		}
		
		// Classes Page
		else if (option == "rogue") {
			this.$root.$data.player.Class = 0;
			this.$root.$data.player.ClassName = "Rogue";
			this.$root.$data.player.Attack += 2;
		}
		else if (option == "mage") {
			this.$root.$data.player.Class = 1;
			this.$root.$data.player.ClassName = "Mage";
			this.$root.$data.player.Attack += 1;
			this.$root.$data.player.Defense += 1;
		}
		else if (option == "warrior") {
			this.$root.$data.player.Class = 2;
			this.$root.$data.player.ClassName = "Warrior";
			this.$root.$data.player.Defense += 2;
		}
		else if (option == "backRace") {
			//Resetting race defaults
			this.$root.$data.player.Race = -1;
			this.$root.$data.player.RaceName = "N/A";
			this.$root.$data.player.Health = 10;
			this.$root.$data.player.MaxHealth = 10;
			this.$root.$data.player.Attack = 1;
			this.$root.$data.player.Defense = 1;
			option = "landing"
		}
		
		//Starting city selection
		else if (option == "backClass") {
			//Resetting before class
			this.$root.$data.player.Class = -1;
			this.$root.$data.player.ClassName = "N/A";
			
			this.$root.$data.player.Health = 10;
			this.$root.$data.player.MaxHealth = 10;
			this.$root.$data.player.Attack = 1;
			this.$root.$data.player.Defense = 1;
			
			if (this.$root.$data.player.Race == 0) {
				this.$root.$data.player.Attack += 1;
			}
			else if (this.$root.$data.player.Race == 1) {
				this.$root.$data.player.Health += 10;
				this.$root.$data.player.MaxHealth += 10;
			}
			else {
				this.$root.$data.player.Defense += 1;
			}
			
			option = "classes"
		}
		
		// change page
		this.changePage(option);
	}
  },
};
</script>