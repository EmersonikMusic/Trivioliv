const questionDisplay = document.querySelector('.question-container')
const answerDisplay = document.querySelector('.answer-container')

var time_per_question = 5
var time_per_answer = 5
var game_started = false;
var game_paused = false;
var current_question_category = null;
var menu_hidden = true;
var start_or_pause_game = 'Start';
var difficulty_list = [];
var category_list = [];
var era_list = [];

var active_categories = {
    'art': true,
    'economics': true,
    'food': true,
    'games': true,
    'geography': true,
    'history': true,
    'human body': true,
    'language': true,
    'literature': true,
    'math': true,
    'miscellaneous': true,
    'movies': true,
    'music': true,
    'nature': true,
    'philosophy': true,
    'politics': true,
    'pop-culture': true,
    'religion': true,
    'science':true,
    'sports': true,
    'technology': true,
    'television': true,
    'theater': true,
    'video-games': true
}

var active_difficulties = {
    'genius': true,
    'sharp': true,
    'average': true,
    'basic': true,
    'insulting': true
}

var category_colors = {
    'Art': '#dd7e6b',
    'Economics': '#315303',
    'Food': '#99000',
    'Games': '#134f5c',
    'Geography': '#91774C',
    'History': '#f1c232',
    'Human Body': '#f6b26b',
    'Human body': '#f6b26b',
    'Language': '#9fc5e8',
    'Literature': '#CC5500',
    'Math': '#434343',
    'Miscellaneous': '#674ea7',
    'Movies': '#660000',
    'Music': '#0b5394',
    'Nature': '#93c47d',
    'Philosophy': '#76a5af',
    'Politics': '#351c75',
    'Pop Culture': '#cc4125',
    'Pop culture': '#cc4125',
    'Religion': '#ff00ff',
    'Science': '#a64d79',
    'Sports': '#999999',
    'Technology': '#cc0000',
    'Television': '#3c78d8',
    'Theater': '#7f6000',
    'Theology': '#c27ba0',
    'Video Games': '#9900ff',
    'Video games': '#9900ff'
}

var baseUrl = 'https://triviolivia.herokuapp.com/api/questions';
var queryParams = [];

function test() {
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
    console.log(urlWithParams);
    fetch(urlWithParams)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function hide_menu() {
    document.getElementById("menu").style.left = "-1000px";
}

function show_menu() {
    document.getElementById("menu").style.left = "0px";

}

function display_fetched_data() {
    for (let i = 0; i < 10; i++) {
  fetch(urlWithParams)
  .then(response => response.text())
  .then(html => console.log(html))
  .catch(error => console.error(error));
}
}

let results = [];

async function fetchJsonTenTimes(url) {
    for (let i = 0; i < 5; i++) {
      const response = await fetch(url);
      const data = await response.json();
      results.push(data);
      console.log(data);
      console.log(results[i][0].text);
      console.log(results[i][0].answer);
      console.log("\n");
    }
    
  }

function start_or_pause_game() {
    if (game_started == false) {
        game_started = true;
        hide_menu();
        document.querySelector('#start-pause').textContent = 'PAUSE';
        document.getElementById('big-buttons').opacity = 0.3;
        fetchJsonTenTimes('https://triviolivia.herokuapp.com/api/questions/');
        yourFunctionNew();
        console.log(results);
    } else if (game_paused == false) {
        game_paused = true;
        document.getElementById("demo").innerHTML = 'Game paused.';
        document.querySelector('#start-pause').textContent = 'UNPAUSE';
    } else {
        game_paused = false;
        document.getElementById("demo").innerHTML = 'Game unpaused.';
        document.querySelector('#start-pause').textContent = 'PAUSE';
    }
}

function toggle_menu() {
    if (menu_hidden == true) {
        menu_hidden = false;
        show_menu();
    } else {
        menu_hidden = true;
        hide_menu();
    }
}

function confirm_reset() {
    document.getElementById("demo").innerHTML = 'Are you sure you want to reset the game?';
}

function toggle_categories(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + clicked_id + ' category.';
        category_list.push(clicked_id);
        console.log('Banned Categories:' + category_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + clicked_id + ' category.';
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log('Banned Categories:' + category_list);
    }
}

function toggle_difficulties(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + clicked_id + ' difficulty.';
        difficulty_list.push(clicked_id);
        console.log('Banned Difficulties:' + difficulty_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + clicked_id + ' difficulty.';
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log('Banned Difficulties:' + difficulty_list);
    }
}

function toggle_eras(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + clicked_id + ' era.';
        era_list.push(clicked_id);
        console.log('Banned eras:' + era_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + clicked_id + ' era.';
        era_list.splice(era_list.indexOf(clicked_id), 1);
        console.log('Banned eras:' + era_list);
    }
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

let Question = class {
    constructor(number, category, difficulty, question, answer) {
        this.number = number;
        this.category = category;
        this.difficulty = difficulty;
        this.question = question;
        this.answer = answer;
    }
  }

const showQuestion = (displayed_question) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_question
    questionDisplay.append(messageElement)
    setTimeout(() => questionDisplay.removeChild(messageElement), time_per_question * 1000 + time_per_answer * 1000)
}

const showAnswer = (displayed_answer) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_answer
    answerDisplay.append(messageElement)
    setTimeout(() => answerDisplay.removeChild(messageElement), time_per_answer * 1000)
}

// showQuestion('Q: ' + question000001.question)

// var timeLeft = time_per_question;
// var elem = document.getElementById('Timer');
// var timerId = setInterval(countdown, 1000);

// function countdown() {
//     if (timeLeft == 0) {
//         clearTimeout(timerId);
//         showAnswer('A: ' + question000001.answer)
//     } else {
//         elem.innerHTML = timeLeft;
//         timeLeft--;
//     }
// }


const delay = ms => new Promise(res => setTimeout(res, ms));

const yourFunctionNew = async () => {
    document.getElementById("demo").innerHTML = 'Put your game face on.';

    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Put your game face on..';

    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Put your game face on...';
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = 'Game starts now!';
  
    await delay(1 * 1000);
    document.getElementById("demo").innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        document.body.style.backgroundColor = category_colors[results[i][0].category_name];
        document.getElementById("demo").innerHTML = 'Category: ' + results[i][0].category_name + ' -  Difficulty: ' + results[i][0].difficulty_name + ' - Author: Mark Mazurek';
        showQuestion(results[i][0].text);
        await delay(time_per_question * 1000);
        showAnswer(results[i][0].answer)
        await delay(time_per_answer * 1000);
      }
    
    document.getElementById("demo").innerHTML = 'Thanks for playing! Refresh to play again. Brought to you by MARKADE GAMES and CREATIVENDEAVORS Copyright &copy; 2023';
  };
