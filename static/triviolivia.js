const questionDisplay = document.querySelector('.question-container')
const answerDisplay = document.querySelector('.answer-container')

// Initializing game variables
var time_per_question = 10
var time_per_answer = 5
var game_started = false;
var game_paused = false;
var current_question_category = null;
var menu_hidden = false;
var number_of_questions = 10;

//Banned category/difficulty/era lists
var category_list = [];
var difficulty_list = [];
var era_list = [];

// Mapping of category, difficulty, and era numbers to their respective names
var category_number_identities = {
    1:'Art',
    2:'Economics',
    3:'Food',
    4:'Games',
    5:'Geography',
    6:'History',
    7:'Human body',
    8:'Language',
    9:'Literature',
    10:'Math',
    11:'Miscellaneous',
    12:'Movies',
    13:'Music',
    14:'Nature',
    15:'Philosophy',
    16:'Politics',
    17:'Pop culture',
    18:'Science',
    19:'Sports',
    20:'Technology',
    21:'Television',
    22:'Theater',
    23:'Theology',
    24:'Video games',
    25:'Law'
}
var difficulty_number_identities = {
    5:'Genius',
    4:'Sharp',
    3:'Average',
    2:'Easy',
    1:'Casual'
}
var era_number_identities = {
    1:'Pre-1500',
    2:'1500-1800',
    3:'1800-1900',
    4:'1900-1950',
    5:'1950s',
    6:'1960s',
    7:'1970s',
    8:'1980s',
    9:'1990s',
    10:'2000s',
    11:'2010s',
    12:'2020s'
}

// Mapping of category names to their associated colors
var category_colors = {
    'Art': '#dd7e6b',
    'Economics': '#598C58',
    'Food': '#f28500',
    'Games': '#cc5500',
    'Geography': '#331800',
    'History': '#f1c232',
    'Human Body': '#d8965b',
    'Language': '#6693f5',
    'Law': '#1b0000',
    'Literature': '#d99d29',
    'Math': '#65635c',
    'Miscellaneous': '#12A898',
    'Movies': '#660000',
    'Music': '#1DB954',
    'Nature': '#043927',
    'Philosophy': '#975fac',
    'Politics': '#351c75',
    'Pop Culture': '#ff6fff',
    'Science': '#06550d',
    'Sports': '#131e3a',
    'Technology': '#1f5967',
    'Television': '#2d2c29',
    'Theater': '#b70000',
    'Theology': '#3C1321',
    'Video Games': '#9900ff'
}

document.getElementById("demo").innerHTML = 'Press START to begin.'

// Declaring variables for the base URL for fetching questions
var baseUrl = 'https://triviolivia.herokuapp.com/api/questions';
var moddedUrl = '';
var queryParams = [];

// Function to generate a URL with query parameters based on selected options
function url_generator() {
    if (category_list.length > 0) {
        queryParams.push('category=' + category_list.join(','));
    }
    if (difficulty_list.length > 0) {
        queryParams.push('difficulty=' + difficulty_list.join(','));
    }
    if (era_list.length > 0) {
        queryParams.push('era=' + era_list.join(','));
    }
    const urlWithParams = baseUrl + '?questions=10&' + queryParams.join('&');
    return urlWithParams;
}

// Function to fetch data from a URL
// function url_fetcher(generated_url) {
//     fetch(generated_url)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
// }

async function fetchJSON(generated_url) {
    const response = await fetch(generated_url);
    const data = await response.json();
    return data;
}

let globalData;

async function fetchData(moddedUrl) {
  const response = await fetch(moddedUrl);
  const data = await response.json();
  globalData = data;
}

// Function to fetch JSON data asynchronously
function test() {
    if (game_started == true) {
        document.getElementById("demo").innerHTML = 'Game already started.';
    } else {
        game_started = true;
        if (category_list.length > 0) {
            queryParams.push('category=' + category_list.join(','));
        }
        if (difficulty_list.length > 0) {
            queryParams.push('difficulty=' + difficulty_list.join(','));
        }
        if (era_list.length > 0) {
            queryParams.push('era=' + era_list.join(','));
        }
        const urlWithParams = baseUrl + '?questions=10&' + queryParams.join('&');
        moddedUrl = urlWithParams;
        menu_hidden = true;
        hide_menu();
        fetchData(moddedUrl);
        mainGameFunction();
    }
}

// Function to hide the menu
function hide_menu() {
    document.getElementById("menu").style.left = "-1000px";
}

// Function to show the menu
function show_menu() {
    document.getElementById("menu").style.left = "0px";
}

//Function to hide and unhide the options menu
function toggle_menu() {
    if (menu_hidden == true) {
        menu_hidden = false;
        show_menu();
    } else {
        menu_hidden = true;
        hide_menu();
    }
}

//Future function of reset functionality
function confirm_reset() {
    document.getElementById("demo").innerHTML = 'Are you sure you want to reset the game?';
    //Yes/No?
    //Reset function call
}

//Function for indicator light toggle
function toggleIndicator(button) {
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      button.classList.add('inactive');
      console.log(button);
    } else {
      button.classList.remove('inactive');
      button.classList.add('active');
      console.log(button);
    }
  }

//Functions to toggle categories, difficulties, and eras
function toggle_categories(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.push(clicked_id);
        console.log(category_list);

    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log(category_list);
    }
}

function toggle_difficulties(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.push(clicked_id);
        console.log(difficulty_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log(difficulty_list);
    }
}

function toggle_eras(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + era_number_identities[clicked_id] + ' era.';
        era_list.push(clicked_id);
        console.log(era_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + era_number_identities[clicked_id] + ' era.';
        era_list.splice(era_list.indexOf(clicked_id), 1);
        console.log(era_list);
    }
}

//Functions to change number of questions, time per question, and time per answer
function change_number_of_questions(clicked_id) {
    number_of_questions = clicked_id;
    document.getElementById("demo").innerHTML = 'Game set to ' + number_of_questions + ' questions.';
}

function change_time_per_question(clicked_id) {
    time_per_question = clicked_id;
    document.getElementById("demo").innerHTML = 'Questions are now displayed for ' + time_per_question + ' seconds.';
    console.log(time_per_question);
}

function change_time_per_answer(clicked_id) {
    time_per_question = clicked_id;
    document.getElementById("demo").innerHTML = 'Answers are now displayed for ' + time_per_question + ' seconds.';
    console.log(time_per_answer);
}

//Question class declaration
let Question = class {
    constructor(number, category, difficulty, question, answer) {
        this.number = number;
        this.category = category;
        this.difficulty = difficulty;
        this.question = question;
        this.answer = answer;
    }
}

//Arrow function to show question
const showQuestion = (displayed_question) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 1;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_question
    questionDisplay.append(messageElement)
    setTimeout(() => questionDisplay.removeChild(messageElement), time_per_question * 1000 + time_per_answer * 1000)
}

//Arrow function to show answer
const showAnswer = (displayed_answer) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 0.7;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_answer
    answerDisplay.append(messageElement)
    setTimeout(() => answerDisplay.removeChild(messageElement), time_per_answer * 1000)
}

const delay = ms => new Promise(res => setTimeout(res, ms));

//Arrow function for main game start
const mainGameFunction = async () => {
    document.getElementById("demo").innerHTML = 'Put your game face on.';
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Put your game face on..';
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Put your game face on...';
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Game starts now!';
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = '';
    
    for (let i = 0; i < number_of_questions; i++) {
        document.body.style.backgroundColor = category_colors[globalData[i].category_name];
        document.getElementById("demo").innerHTML = 'Category: ' + globalData[i].category_name + ' -  Difficulty: ' + globalData[i].difficulty_name + ' - Author: Mark Mazurek';
        showQuestion(globalData[i].text);
        await delay(time_per_question * 1000);
        showAnswer(globalData[i].answer)
        await delay(time_per_answer * 1000);
      }
    game_started = false;
    document.getElementById("demo").innerHTML = 'Thanks for playing! Press START to play again. Brought to you by MARKADE GAMES and CREATIVENDEAVORS Copyright &copy; 2023';
};

//Variables for ALL/NONE buttons
var all_none_categories = true;
var all_none_difficulties = true;
var all_none_eras = true;
var categoryButtons = document.querySelectorAll('.category');
var difficultyButtons = document.querySelectorAll('.difficulty');
var eraButtons = document.querySelectorAll('.era');

//Functions to disable and enable category, difficulty, era
function disable_category(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        category_list.push(clicked_id);
        console.log(category_list);

    } else {
        console.log(category_list);
    }
}

function enable_category(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        console.log(category_list);

    } else {
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log(category_list);
    }
}

function disable_difficulty(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        difficulty_list.push(clicked_id);
        console.log(difficulty_list);

    } else {
        console.log(difficulty_list);
    }
}

function enable_difficulty(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        console.log(difficulty_list);

    } else {
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log(difficulty_list);
    }
}

function disable_era(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        era_list.push(clicked_id);
        console.log(era_list);

    } else {
        console.log(era_list);
    }
}

function enable_era(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        console.log(era_list);

    } else {
        era_list.splice(era_list.indexOf(clicked_id), 1);
        console.log(era_list);
    }
}

//Functions for ALL/NONE buttons
function allNoneCategoriesButton() {
    if (all_none_categories == true) {
    for (var i = 0; i < categoryButtons.length; i++) {
        categoryButtons[String(i)].classList.remove('active');
        categoryButtons[String(i)].classList.add('inactive');
        disable_category(String(i));
        document.getElementById("demo").innerHTML = 'You must select at least one category before starting the game.';
    }
    all_none_categories = false;
    } else {
    category_list = [];
    for (var i = 0; i < categoryButtons.length; i++) {
        categoryButtons[String(i)].classList.remove('inactive');
        categoryButtons[String(i)].classList.add('active');
        enable_category(String(i));
    }
    all_none_categories = true;
    document.getElementById("demo").innerHTML = 'You have enabled all categories.';
    }
    console.log(categoryButtons);
}

function allNoneDifficultiesButton() {
    if (all_none_difficulties == true) {
    for (var i = 0; i < difficultyButtons.length; i++) {
        difficultyButtons[String(i)].classList.remove('active');
        difficultyButtons[String(i)].classList.add('inactive');
        disable_difficulty(String(i+1));
        document.getElementById("demo").innerHTML = 'You must select at least one difficulty before starting the game.';
    }
    all_none_difficulties = false;
    } else {
    difficulty_list = [];
    for (var i = 0; i < difficultyButtons.length; i++) {
        difficultyButtons[String(i)].classList.remove('inactive');
        difficultyButtons[String(i)].classList.add('active');
        enable_difficulty(String(i+1));
    }
    all_none_difficulties = true;
    document.getElementById("demo").innerHTML = 'You have enabled all difficulties.';
    }
} 

function allNoneErasButton() {
    if (all_none_eras == true) {
    for (var i = 0; i < eraButtons.length; i++) {
        eraButtons[String(i)].classList.remove('active');
        eraButtons[String(i)].classList.add('inactive');
        document.getElementById("demo").innerHTML = 'You must select at least one era before starting the game.';
        disable_era(String(i+1));
    }
    all_none_eras = false;
    } else {
    category_list = [];
    for (var i = 0; i < eraButtons.length; i++) {
        eraButtons[String(i)].classList.remove('inactive');
        eraButtons[String(i)].classList.add('active');
        enable_era(String(i+1));
    }
    all_none_eras = true;
    document.getElementById("demo").innerHTML = 'You have enabled all eras.';
    }
} 