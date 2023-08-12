import axios from "axios";

let baseUrl = "https://pokeapi.co/api/v2/";

class Pokemon {
    constructor(name) {
        this.name = name;
        this.id = null;
        this.hp = null;
        this.weight = null;
        this.height = null;
        this.pictureFront = null;
        this.abilities = [];
        this.types = [];
        this.type1 = null;
        this.type2 = null;
        this.stats = [];
        this.fetchData(); // Corrected call using `this`
        this.getAttackPower1();
        this.getAttackPower2();
    }

    async fetchData() {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/` + this.name;
            const response = await axios.get(url);
            const data = response.data;

            this.id = data.id;
            this.hp = data.stats[0].base_stat;
            this.weight = data.weight;
            this.height = data.height;
            this.pictureFront = data.sprites.other['official-artwork'].front_default;
            this.abilities = data.abilities;
            this.types = data.types;
            this.type1 = data.types[0].type.name;
            
            if (data.types[1]) {
                this.type2 = data.types[1].type.name;
            }else{
                this.type2 = "Has no second type."
            }
            this.stats = data.stats;
            this.attack1 = data.moves[0].move.name;
            this.attack2 = data.moves[1].move.name;
        } catch (error) {
            console.error(`Error fetching data for ${this.name}: ${error}`);
        }
    }

    async getAttackPower1() {
        await this.fetchData();
        try {
            const url = `https://pokeapi.co/api/v2/move/${this.attack1}`;
            const response = await axios.get(url);
            const data = response.data;
            this.attackPower1 = data.power;
        } catch (error) {
            console.error(`Error fetching data for ${this.attack1}: ${error}`);
        }
    }
    async getAttackPower2() {
        await this.fetchData();
        try {
            const url = `https://pokeapi.co/api/v2/move/${this.attack2}`;
            const response = await axios.get(url);
            const data = response.data;
            this.attackPower2 = data.power;
        } catch (error) {
            console.error(`Error fetching data for ${this.attack2}: ${error}`);
        }
    }
}


// (async () => {
//     const pokemon = new Pokemon('pikachu');
//     await pokemon.getAttackPower1(); // Wait for data to be fetched
//     console.log(pokemon.attackPower1);   // Now it won't be null
// })();


export default Pokemon;
