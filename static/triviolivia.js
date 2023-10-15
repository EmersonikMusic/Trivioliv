const questionDisplay = document.querySelector('.question-container')
const answerDisplay = document.querySelector('.answer-container')

// Initializing game variables
var time_per_question = 5
var time_per_answer = 5
var game_started = false;
var game_paused = false;
var current_question_category = null;
var menu_hidden = false;
var start_or_pause_game = 'Start';
var difficulty_list = [];
var category_list = [];
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
    24:'Video games'
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

// Declaring variables for the base URL for fetching questions
var baseUrl = 'https://triviolivia.herokuapp.com/api/questions';
var moddedUrl = '';
var queryParams = [];
// var fetched_data = new_game_starter();
// console.log(fetched_data);

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
function url_fetcher(generated_url) {
    fetch(generated_url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function fetchJSON(generated_url) {
    const response = await fetch(generated_url);
    const data = await response.json();
    return data;
}
  
// function new_game_starter() {
//     var generated_url = url_generator();
//     console.log(generated_url);
//     var response_data = url_fetcher(generated_url);
//     console.log(response_data);
//     var new_response_data = fetchJSON(generated_url)
//     return new_response_data;
// }

let globalData;

async function fetchData(moddedUrl) {
  const response = await fetch(moddedUrl);
  const data = await response.json();
  globalData = data;
}

// Function to fetch JSON data asynchronously
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
    moddedUrl = urlWithParams;
    menu_hidden = true;
    hide_menu();
    fetchData(moddedUrl);
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error(error));
    yourFunctionNew();
}



//ChatGPT attempt at making custom stuff work

// fetchData('https://triviolivia.herokuapp.com/api/questions?questions=10')
//   .then(() => {
//     console.log(globalData);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// end ChatGPT

// Function to hide the menu
function hide_menu() {
    document.getElementById("menu").style.left = "-1000px";
}

// Function to show the menu
function show_menu() {
    document.getElementById("menu").style.left = "0px";

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

//Function to start or pause game NEED TO ADD PAUSE/UNPAUSE FUNCTIONALITY
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

function toggle_categories(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.push(clicked_id);
        console.log('Banned Categories:' + category_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log('Banned Categories:' + category_list);
    }
}

function toggle_difficulties(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.push(clicked_id);
        console.log('Banned Difficulties:' + difficulty_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log('Banned Difficulties:' + difficulty_list);
    }
}

function toggle_eras(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + era_number_identities[clicked_id] + ' era.';
        era_list.push(clicked_id);
        console.log('Banned eras:' + era_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + era_number_identities[clicked_id] + ' era.';
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
    
    for (let i = 0; i < 10; i++) {
        document.body.style.backgroundColor = category_colors[globalData[i].category_name];
        document.getElementById("demo").innerHTML = 'Category: ' + globalData[i].category_name + ' -  Difficulty: ' + globalData[i].difficulty_name + ' - Author: Mark Mazurek';
        showQuestion(globalData[i].text);
        await delay(time_per_question * 1000);
        showAnswer(globalData[i].answer)
        await delay(time_per_answer * 1000);
      }
    
    document.getElementById("demo").innerHTML = 'Thanks for playing! Press START to play again. Brought to you by MARKADE GAMES and CREATIVENDEAVORS Copyright &copy; 2023';
  };




  all_none_categories = true;
  all_none_difficulties = true;
  all_none_eras = true;


  function allNoneCategoriesButton() {
    var categoryButtons = document.querySelectorAll('.category');
      if (all_none_categories == true) {
        for (var i = 0; i < categoryButtons.length; i++) {
            categoryButtons[i].classList.remove('active');
            categoryButtons[i].classList.add('inactive');
            document.getElementById("demo").innerHTML = 'You must select at least one category before starting the game.';
        }
        all_none_categories = false;
        } else {
        for (var i = 0; i < categoryButtons.length; i++) {
            categoryButtons[i].classList.remove('inactive');
            categoryButtons[i].classList.add('active');
        }
        all_none_categories = true;
      }
  }

  function allNoneDifficultiesButton() {
    var difficultyButtons = document.querySelectorAll('.difficulty');
      if (all_none_difficulties == true) {
        for (var i = 0; i < difficultyButtons.length; i++) {
            difficultyButtons[i].classList.remove('active');
            difficultyButtons[i].classList.add('inactive');
            document.getElementById("demo").innerHTML = 'You must select at least one difficulty before starting the game.';
        }
        all_none_difficulties = false;
        } else {
        for (var i = 0; i < difficultyButtons.length; i++) {
            difficultyButtons[i].classList.remove('inactive');
            difficultyButtons[i].classList.add('active');
        }
        all_none_difficulties = true;
      }
  } 
  
  function allNoneErasButton() {
      var eraButtons = document.querySelectorAll('.era');
      if (all_none_eras == true) {
        for (var i = 0; i < eraButtons.length; i++) {
            eraButtons[i].classList.remove('active');
            eraButtons[i].classList.add('inactive');
            document.getElementById("demo").innerHTML = 'You must select at least one era before starting the game.';
        }
        all_none_eras = false;
        } else {
        for (var i = 0; i < eraButtons.length; i++) {
            eraButtons[i].classList.remove('inactive');
            eraButtons[i].classList.add('active');
        }
        all_none_eras = true;
      }
  } 