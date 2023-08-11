// game logic
import chalk from 'chalk'
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from 'gradient-string'
import { createSpinner } from "nanospinner";
import Pokemon from './pokemon.js';
import imageToAscii from 'image-to-ascii';
import blessed from 'blessed';
import terminalImage from 'terminal-image';
import got from 'got';
import axios from 'axios';
//import excludeVariablesFromRoot from '@mui/material/styles/excludeVariablesFromRoot.js';

const resolveAnimations = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
const spinner = createSpinner('process loading. . .')
const pokeApi = 'https://pokeapi.co/api/v2/';



let trainerName
let trainerPokemon
let selectedPokemon
let opponent

async function startGame() {
    //welcome message utilizing the chalk animation package
    const welcomeMsg = chalkAnimation.rainbow(`Welcome to your CLI Pokemon Adventure\n`);
     //call helper
    await resolveAnimations();
    //stop the animation
    welcomeMsg.stop();
    //prompt for the game
    
};

async function trainerInfo() {
    const answers = await inquirer.prompt({
        name: 'trainerName',
        type: 'input',
        message: 'Hello, please enter your name.'
    });
    trainerName = answers.trainerName;
}
async function getTrainersPokemon() {
    const answers = await inquirer.prompt({
        name: 'trainerPokemon',
        type: 'input',
        message: 'Please enter your first pokemon.'
    });
    trainerPokemon = answers.trainerPokemon;
    await retrieveAndDisplayPokemonData();    
}

async function retrieveAndDisplayPokemonData() {
    // Create a new Pokemon instance
    let selectedPokemon = new Pokemon(trainerPokemon);
    // Print the information about the created Pokemon instance
    await selectedPokemon.fetchData();

    const body = await got(selectedPokemon.pictureFront).buffer();
    const formattedInfo = `
    ${selectedPokemon.name}'s Stats:
    ID: ${selectedPokemon.id}
    Name: ${selectedPokemon.name}
    Type 1: ${selectedPokemon.type1}
    Type 2: ${selectedPokemon.type2}
    Weight: ${selectedPokemon.weight}
    Height: ${selectedPokemon.height}
    `;
    console.log(formattedInfo)
    console.log(await terminalImage.buffer(body))
    battle(selectedPokemon);
}

async function battle(selectedPokemon) {
    const answers = await inquirer.prompt({
        name: 'battle',
        type: 'list',
        message: 'Would you like to battle a random pokemon?',
        choices:[
            {name: `Yes, I believe in ${trainerPokemon}`, value: 'Yes'},
            {name: `No, I don't believe in ${trainerPokemon}`, value: 'No'}
        ],
    });
    //trainerPokemon = answers.trainerPokemon;
    //await retrieveAndDisplayPokemonData();
    if(answers.battle == 'Yes'){
        await randomPokemon(selectedPokemon);
    }
    else{
        console.log(`${chalk.bgRed('You are not a true pokemon trainer')}`)
    }
}

async function randomPokemon(selectedPokemon){

    const randomPokemonID = Math.floor(Math.random() * 1118) + 1;
    const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}`);
    const randomPokemonName = data.data.name;
    const opponent = new Pokemon(randomPokemonName);
    await opponent.fetchData();

    console.log(`You have encountered a wild ${opponent.name}\n`)

    const body = await got(opponent.pictureFront).buffer();
    console.log(await terminalImage.buffer(body))
    console.log(`Prepare to battle!`)
    await battleSequence(opponent, selectedPokemon);
}


async function battleSequence(opponent, selectedPokemon) {
    
    await opponent.fetchData();
    await selectedPokemon.fetchData();


    const answers = await inquirer.prompt({
        name: 'battle',
        type: 'list',
        message: 'What would you like to do?',
        choices:[
            {name: `Fight ${opponent.name}`, value: 'Fight'},
            {name: `Run away`, value: 'Run'}
        ],
    });
    if(answers.battle == 'Fight'){
        await attack(opponent,selectedPokemon);
    }
    else{
        console.log(`${chalk.bgRed(`You ran away from ${opponent.name}`)}`)
    }

}


async function attack(opponent, selectedPokemon) {
    
    

    const answers = await inquirer.prompt({
        name: 'attack',
        type: 'list',
        message: 'What attack would you like to use?',
        choices:[
            {name: `${trainerPokemon} use ${selectedPokemon.attack1}`, value: 'Attack1'},
            {name: `${trainerPokemon} use ${selectedPokemon.attack2}`, value: 'Attack2'}
        ],
    });
    if(answers.attack == 'Attack1'){
        
        console.log(`${trainerPokemon} used ${selectedPokemon.attack1}!`)
        console.log(`${opponent.name} currently has ${opponent.hp} health!`)
        await selectedPokemon.getAttackPower1();
        console.log(`${opponent.name} lost ${selectedPokemon.attackPower1} health!`)
        //subtract power of that move from the oppeonent's health
        opponent.hp = opponent.hp - selectedPokemon.attackPower1;
        if(opponent.hp <= 0){
            console.log(`${opponent.name} has fainted!`)
            console.log(`${chalk.bgGreen(`${trainerPokemon} has won the battle!`)}`)
        }else{
            
            console.log(`${opponent.name} has ${opponent.hp} health left!`)
            await opponentsTurn(opponent, selectedPokemon);
        }
        
    }
    else{
        console.log(`${trainerPokemon} used ${selectedPokemon.attack2}!`)
        console.log(`${opponent.name} currently has ${opponent.hp} health!`)
        await selectedPokemon.getAttackPower2();
        console.log(`${opponent.name} lost ${selectedPokemon.attackPower2} health!`)
        //subtract power of that move from the oppeonent's health
        opponent.hp = opponent.hp - selectedPokemon.attackPower1;
        if(opponent.hp <= 0){
            console.log(`${opponent.name} has fainted!`)
            console.log(`${chalk.bgGreen(`${trainerPokemon} has won the battle!`)}`)
        }else{
            console.log(`${opponent.name} has ${opponent.hp} health left!`)
            console.log(`${chalk.bgYellow(`${opponent.name} is ATTACKING`)}`)
            await opponentsTurn(opponent, selectedPokemon);
        }
    }

}



async function main() {
    await  startGame();
    await trainerInfo();
    await getTrainersPokemon();
    
 }
 
 main()
