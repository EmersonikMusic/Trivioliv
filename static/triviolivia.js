//Declaring quesiton and answer display
const questionDisplay = document.querySelector('.question-container')
const answerDisplay = document.querySelector('.answer-container')

// Declaring game setting variables
var number_of_questions = 10;
var time_per_question = 5;
var time_per_answer = 5;
var game_started = false;
var menu_hidden = false;
var current_question_category = null;
let pauseFlag = false;

// Declaring banned category/difficulty/era lists
var category_list = [];
var difficulty_list = [];
var era_list = [];

// Declaring variables for ALL/NONE buttons
var all_none_categories = true;
var all_none_difficulties = true;
var all_none_eras = true;
var categoryButtons = document.querySelectorAll('.category');
var difficultyButtons = document.querySelectorAll('.difficulty');
var eraButtons = document.querySelectorAll('.era');

// Declaring of mapping of category, difficulty, and era numbers to their respective names
var category_number_identities = {
    1: 'Art',
    2: 'Economics',
    3: 'Food',
    4: 'Games',
    5: 'Geography',
    6: 'History',
    7: 'Human body',
    8: 'Language',
    9: 'Literature',
    10: 'Math',
    11: 'Miscellaneous',
    12: 'Movies',
    13: 'Music',
    14: 'Nature',
    15: 'Philosophy',
    16: 'Politics',
    17: 'Pop culture',
    18: 'Science',
    19: 'Sports',
    20: 'Technology',
    21: 'Television',
    22: 'Performing arts',
    23: 'Theology',
    24: 'Video games'
}

var difficulty_number_identities = {
    5: 'Genius',
    4: 'Sharp',
    3: 'Average',
    2: 'Easy',
    1: 'Casual'
}

var era_number_identities = {
    1: 'Pre-1500',
    2: '1500-1800',
    3: '1800-1900',
    4: '1900-1950',
    5: '1950s',
    6: '1960s',
    7: '1970s',
    8: '1980s',
    9: '1990s',
    10: '2000s',
    11: '2010s',
    12: '2020s'
}

// Mapping of category names to their associated colors
var category_colors = {
'Art': 'linear-gradient(345deg, rgba(165,50,27,1) 0%, rgba(221,126,107,1) 100%)',

'Economics': 'linear-gradient(345deg, rgba(17,68,16,1) 0%, rgba(89,140,88,1) 100%)',

'Food': 'linear-gradient(345deg, rgba(127,43,11,1) 0%, rgba(242,133,0,1) 100%)',

'Games': 'linear-gradient(345deg, rgba(103,38,24,1) 0%, rgba(204,85,0,1) 100%)',

'Geography': 'linear-gradient(345deg, rgba(61,38,19,1) 0%, rgba(154,123,79,1) 100%)',

'History': 'linear-gradient(345deg, rgba(241,194,50,1) 0%, rgba(241,154,50,1) 100%)',

'Human Body': 'linear-gradient(345deg, rgba(106,77,20,1) 0%, rgba(180,130,32,1) 100%)',

'Language': 'linear-gradient(345deg, rgba(28,60,133,1) 0%, rgba(102,147,245,1) 100%)',

'Law': 'linear-gradient(345deg, rgba(189,76,51,1) 0%, rgba(111,62,51,1) 100%)',

'Literature': 'linear-gradient(345deg, rgba(202,128,39,1) 0%, rgba(217,157,41,1) 100%)',

'Math': 'linear-gradient(345deg, rgba(63,61,54,1) 0%, rgba(101,99,92,1) 100%)',

'Miscellaneous': 'linear-gradient(345deg, rgba(13,109,122,1) 0%, rgba(18,168,152,1) 100%)',

'Movies': 'linear-gradient(345deg, rgba(184,34,34,1) 0%, rgba(102,0,0,1) 100%)',

'Music': 'linear-gradient(345deg, rgba(9,110,62,1) 0%, rgba(29,185,84,1) 100%)',

'Nature': 'linear-gradient(345deg, rgba(8,83,27,1) 0%, rgba(4,57,39,1) 100%)',

'Philosophy': 'linear-gradient(345deg, rgba(89,61,128,1) 0%, rgba(151,95,172,1) 100%)',

'Politics': 'linear-gradient(345deg, rgba(84,30,140,1) 0%, rgba(53,28,117,1) 100%)',

'Pop Culture': 'linear-gradient(345deg, rgba(233,85,148,1) 0%, rgba(255,143,171,1) 100%)',

'Science': 'linear-gradient(345deg, rgba(6,85,83,1) 0%, rgba(11,103,56,1) 100%)',

'Sports': 'linear-gradient(345deg, rgba(44,66,121,1) 0%, rgba(19,30,58,1) 100%)',

'Technology': 'linear-gradient(345deg, rgba(22,134,161,1) 0%, rgba(31,89,103,1) 100%)',

'Television': 'linear-gradient(345deg, rgba(45,44,41,1) 0%, rgba(87,81,78,1) 100%)',

'Theater': 'linear-gradient(345deg, rgba(183,75,0,1) 0%, rgba(183,0,0,1) 100%)',

'Theology': 'linear-gradient(345deg, rgba(64,14,66,1) 0%, rgba(60,19,33,1) 100%)',

'Video Games': 'linear-gradient(345deg, rgba(153,0,255,1) 0%, rgba(60,13,128,1) 100%)'
}

// Declaring variables for the base URL for fetching questions
var baseUrl = 'https://triviolivia.herokuapp.com/api/questions';
var moddedUrl = '';
var queryParams = [];
let globalData;

// Default message in bar
document.getElementById("demo").innerHTML = 'Press START GAME to play.'

// Async JS that kind of scares me, honestly
async function fetchData(moddedUrl) {
    const response = await fetch(moddedUrl);
    const data = await response.json();
    globalData = data.slice(); // Create a copy of the array
    shuffleArray(globalData); // Shuffle the copy
    console.log(globalData);
}

// Function to not fetch JSON data if any of cat/dif/era are all deselected
function dontFetchDataIfAllDeselected() {
    if (category_list.length > 23) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one category.';
    } else if (difficulty_list.length > 4) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one difficulty.';
    } else if (era_list.length > 11) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one era.';
    } else {
        changeButtonText();
        fetchQuestionsAndStartGame();
        const hideAllMenus = () => {
            checkboxes.forEach(checkbox => {
              checkbox.checked = false;
              checkbox.nextElementSibling.classList.remove('active');
            });
          };
        hideAllMenus();
    }
}

// Function to fetch JSON data asynchronously
function fetchQuestionsAndStartGame() {
    if (game_started == true) {
       console.log('Button pressed.');
       console.log("pauseFlag: " + pauseFlag);
        console.log("isPaused: " + isPaused);
    } else {
        game_started = true;
        globalData = [];
        if (category_list.length > 0) {
            queryParams.push('category=' + category_list.join(','));
        }
        if (difficulty_list.length > 0) {
            queryParams.push('difficulty=' + difficulty_list.join(','));
        }
        if (era_list.length > 0) {
            queryParams.push('era=' + era_list.join(','));
        }
        const urlWithParams = baseUrl + '?questions=' + number_of_questions + '&' + queryParams.join('&');
        moddedUrl = urlWithParams;
        menu_hidden = true;
        // hide_menu();
        fetchData(moddedUrl);
        mainGameFunction();
    }
}

// Function to toggle, hide, and show options menu
function toggle_menu() {
    if (menu_hidden == true) {
        menu_hidden = false;
        show_menu();
    } else {
        menu_hidden = true;
        hide_menu();
    }
}

// Function to shuffle returned array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function hide_menu() {
    document.getElementById("menu").style.left = "-1000px";
}

function show_menu() {
    document.getElementById("menu").style.left = "0px";
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

//Function to hide or show menu sections
  const checkboxes = document.querySelectorAll('.toggle');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        checkboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== this) {
            otherCheckbox.checked = false;
            otherCheckbox.nextElementSibling.classList.remove('active');
          }
        });
      }
      this.nextElementSibling.classList.toggle('active', this.checked);
    });
  });


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
    number_of_questions = parseInt(clicked_id);
    document.getElementById("demo").innerHTML = 'Game set to ' + number_of_questions + ' questions.';
}

function change_time_per_question(clicked_id) {
    time_per_question = clicked_id;
    document.getElementById("demo").innerHTML = 'Questions will display for ' + time_per_question + ' seconds.';
    console.log(time_per_question);
}

function change_time_per_answer(clicked_id) {
    time_per_answer = clicked_id;
    document.getElementById("demo").innerHTML = 'Answers will display for ' + time_per_answer + ' seconds.';
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

//Arrow functions to show question and answer
const showQuestion = (displayed_question) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 1;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_question
    questionDisplay.append(messageElement)
    setTimeout(() => questionDisplay.removeChild(messageElement), time_per_question * 1000 + time_per_answer * 1000)
}

const showAnswer = (displayed_answer) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 0.7;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_answer
    answerDisplay.append(messageElement)
    setTimeout(() => answerDisplay.removeChild(messageElement), time_per_answer * 1000)
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const mainGameFunction = async () => {
    document.getElementById("demo").innerHTML = 'Fetching questions.';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Fetching questions..';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Fetching questions...';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Game starts now!';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = '';

    for (let i = 0; i < number_of_questions; i++) {
        if (!pauseFlag) {
            progressBar.style.animationPlayState = "running";
            progressBar.style.animation = "depleteProgress " + time_per_question + "s linear infinite";
            isPaused = false;
            console.log("pauseFlag: " + pauseFlag);
            console.log("isPaused: " + isPaused);
          } else {
            progressBar.style.animationPlayState = "paused";
            progressBar.style.animation = "none";
            progressBar.offsetHeight; // Trigger reflow to reset animation
            progressBar.style.animation = "depleteProgress " + time_per_answer + "s linear infinite";
            console.log("pauseFlag: " + pauseFlag);
            console.log("isPaused: " + isPaused);
          }
        // Check if paused
        while (!pauseFlag) {
            await delay(100); // Check every 10 milliseconds
        }

        document.body.style.background = category_colors[globalData[i].category_name];

        const svg_dictionary = [
            { name: "art", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>' },
            { name: "nature", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="green" /></svg>' },
            { name: "art", svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="10" y1="90" x2="90" y2="10" stroke="blue" stroke-width="5" /></svg>' }
        ];

        document.character = svg_dictionary[globalData[i].category_name]

        // Attempt at character replace upon question change
        function changeToSVG() {
            // Define the SVG content as a string
            const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 390.8 556.2">
            <defs>
              <style>
                .cls-1 {
                  fill: #e67a6c;
                }
          
                .cls-2 {
                  fill: #c45f41;
                }
          
                .cls-3 {
                  fill: #503c43;
                }
          
                .cls-4 {
                  fill: #a51f4b;
                }
          
                .cls-5 {
                  fill: #c05e58;
                }
          
                .cls-6 {
                  fill: #6b1221;
                }
          
                .cls-7 {
                  fill: #f3d5b5;
                }
          
                .cls-8 {
                  fill: #ba3f2f;
                }
          
                .cls-9 {
                  fill: #232323;
                }
          
                .cls-10 {
                  fill: #0d7c86;
                }
          
                .cls-11 {
                  fill: #bec3bf;
                }
          
                .cls-12 {
                  fill: #8e3226;
                }
          
                .cls-13 {
                  fill: #f7b750;
                }
          
                .cls-14 {
                  fill: #a34737;
                }
          
                .cls-15 {
                  fill: #12ac99;
                }
          
                .cls-16 {
                  fill: #1a0d0d;
                }
          
                .cls-17 {
                  fill: #a1a2a3;
                }
          
                .cls-18 {
                  fill: #23110a;
                }
          
                .cls-19 {
                  fill: #b14f3d;
                }
          
                .cls-20 {
                  fill: #281a26;
                }
          
                .cls-21 {
                  fill: #feb083;
                }
          
                .cls-22 {
                  fill: #551610;
                }
          
                .cls-23 {
                  fill: #f0935d;
                }
          
                .cls-24 {
                  fill: #2c1525;
                }
          
                .cls-25 {
                  fill: #bdeded;
                }
          
                .cls-26 {
                  fill: #c12e4b;
                }
          
                .cls-27 {
                  fill: #f58d67;
                }
          
                .cls-28 {
                  fill: #e68d68;
                }
          
                .cls-29 {
                  fill: #dc625f;
                }
          
                .cls-30 {
                  fill: #290e11;
                }
          
                .cls-31 {
                  fill: #e5fdfe;
                }
          
                .cls-32 {
                  fill: #2e643c;
                }
          
                .cls-33 {
                  fill: #fbfbfc;
                }
          
                .cls-34 {
                  fill: #8e4237;
                }
          
                .cls-35 {
                  fill: #ac8577;
                }
          
                .cls-36 {
                  fill: #fcf4e1;
                }
          
                .cls-37 {
                  fill: #74556c;
                }
          
                .cls-38 {
                  fill: #efdd89;
                }
          
                .cls-39 {
                  opacity: .2;
                }
          
                .cls-39, .cls-40 {
                  fill: #7aebe9;
                }
          
                .cls-41 {
                  fill: #c9892d;
                }
          
                .cls-42 {
                  fill: #e6794d;
                }
          
                .cls-43 {
                  fill: #e6704d;
                }
          
                .cls-44 {
                  fill: #3f130b;
                }
          
                .cls-45 {
                  fill: #6d5c6e;
                }
          
                .cls-46 {
                  fill: #511407;
                }
          
                .cls-47 {
                  fill: #de563f;
                }
          
                .cls-48 {
                  fill: #deba9d;
                }
          
                .cls-49 {
                  fill: #17ae9d;
                }
          
                .cls-50 {
                  fill: #d53a5c;
                }
          
                .cls-51 {
                  fill: #962e18;
                }
          
                .cls-52 {
                  fill: #205446;
                }
          
                .cls-53 {
                  fill: #fcfcfc;
                }
          
                .cls-54 {
                  fill: #3d2744;
                }
          
                .cls-55 {
                  fill: #c47258;
                }
          
                .cls-56 {
                  fill: #95409b;
                }
          
                .cls-57 {
                  fill: #532a56;
                }
          
                .cls-58 {
                  fill: #a0898a;
                }
          
                .cls-59 {
                  fill: #353535;
                }
          
                .cls-60 {
                  fill: #ab7ab7;
                }
          
                .cls-61 {
                  fill: #120f12;
                }
          
                .cls-62 {
                  fill: #9f6d64;
                }
          
                .cls-63 {
                  display: none;
                }
          
                .cls-64 {
                  fill: #c95860;
                }
          
                .cls-65 {
                  fill: #320532;
                }
          
                .cls-66 {
                  fill: #1d121b;
                }
          
                .cls-67 {
                  fill: #4e0b1b;
                }
              </style>
            </defs>
            <!-- Generator: Adobe Illustrator 28.7.1, SVG Export Plug-In . SVG Version: 1.2.0 Build 142)  -->
            <g>
              <g id="Layer_2">
                <path class="cls-43" d="M279,413s7.4-5,12-2l-3.7,7-4.6,2-3.7-7Z"/>
                <path class="cls-43" d="M334,398s-8-5-13-2l4,7,5,2,4-7Z"/>
                <g>
                  <g>
                    <path class="cls-13" d="M282.2,527.8c-1,6-1,7.2-2,12-1,5-40.7,16.2-55,16.2,0-1,12-17.2,12-18.2,14.9-1.4,30.9-4.8,45-10Z"/>
                    <path class="cls-3" d="M193.2,428.8c8.6,2.4,12.3,1.9,20.5-1.5.4,1.3,1.3,2.3,2,3.5.9,1.6.9,2.4,1,2.5q-4.1,1.5-8.2,3c-7.9-2-15.8,2.2-26-6-7.3-5.9-8-13.9-9.2-22.5,2.7,2.3,6.3,2.4,6.5,2.7,1.1,1.8-3.8,13.4,13.5,18.2Z"/>
                    <g>
                      <path class="cls-38" d="M234.7,401.8c.5.3,2.4,0,2.5,0,1.5.4,2.9,1.2,4.5,1,.3,1.4.5.9.5,1,1.2,10.2-2.9,10.2-11.5,7,1.2-1.8,1.8-9,4-9Z"/>
                      <g>
                        <path class="cls-28" d="M234.7,401.8c-2.2,0-2.8,7.2-4,9,0,.1-2.2,2.2-2.5,2.5-6.1,5.5-27.5,14.9-35.5,12.5-2-.6-3.1-2.2-4.5-3.5,19,3.7,8.7.6,6.5-6.2-4.3-13.5,4-12.6-6.5-14.7-5.6-1.1-11.5-.5-16.5-3.5,1.1-4.9,15.4-4,20-4.5,4-.4,8-1,12-1.2-2-2.4-4.6-4.2-6.5-6.7,25.1-3.6,35.6,15.5,37.5,16.5Z"/>
                        <path class="cls-55" d="M188.2,401.3c10.5,2.1,2.2,1.2,6.5,14.7,2.2,6.9,12.5,9.9-6.5,6.2-3.1-3-10.6-13.8-3-13.7-4.4-1.9-9.2-2.4-13-5.7,0-.2,0-.3,0-.5,1.3-2.5,12.8,2.1,16-1Z"/>
                        <path class="cls-62" d="M188.2,422.3c1.4,1.3,2.5,2.9,4.5,3.5q.2,1.5.5,3c-17.3-4.9-12.4-16.4-13.5-18.2-.2-.3-3.8-.4-6.5-2.7-.3-1.8-.9-3-1-5,3.8,3.3,8.6,3.8,13,5.7-7.6,0-.1,10.8,3,13.7Z"/>
                        <path class="cls-62" d="M188.2,401.3c-3.2,3.1-14.7-1.5-16,1,0-1.4-.9-2.9-.5-4.5,5,3,10.9,2.4,16.5,3.5Z"/>
                        <path class="cls-55" d="M228.2,413.3c1.2.8,1.4,2.3,2,3.5-2,1.4-7,5.4-8,6-.8.5-8.1,4.3-8.5,4.5-8.2,3.4-11.9,3.9-20.5,1.5q-.2-1.5-.5-3c8,2.4,29.4-7,35.5-12.5Z"/>
                      </g>
                    </g>
                    <g>
                      <path class="cls-53" d="M226.7,428.8q6.2,9.7,12.5,19.5c-.5.1-6,3.3-9.5,4,0-.8-1-.9-1-1-.8-.8-10.7-15.8-12-18,0-.1,0-.9-1-2.5,2.7-1,6.2-1.8,9-2,.7,0,1.3,0,2,0Z"/>
                      <path class="cls-60" d="M222.2,422.8c1.5,2.3,4.7,5,2.5,6-2.8.2-6.3,1-9,2-.7-1.2-1.6-2.2-2-3.5.4-.2,7.7-4,8.5-4.5Z"/>
                    </g>
                    <g>
                      <path class="cls-43" d="M203.2,295.3c-.7,2.1-1.7,4-2.5,6-1.8-.3-1.9,1-2,1-.5.2.2-1.5-3,1.7-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1,2-.2,3.9.9,6,.5-.6,8.8-.2,18.2,6.7,24.5.4,0,3.6-3.9,4.2-4.5,6.8-6.2,12.8-13.3,19.5-19.5.9-.9,2.3-1.4,3-2.5.2.2,1.2.8,1.5,1Z"/>
                      <path class="cls-21" d="M275.1,389s26.1-25.1,29-33c.8-2.1,5-16,3.6-22.2-2.2-8.6-5.3-16.9-11.1-23.7-11.1-13-23.1-9.9-32-12.7-2.1,4.4-4.6,8.6-7.5,12.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-21.1-34.3-27.4-38.3-1,1-4,2-5,1-.5.2-4.1,4.8-7.3,8.1-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1-7.5.6-11.2.9-18.2,5-10.2,5.9-20.9,23-18.2,28.2,3.5,6.9,12.5,17.9,19.5,23.9,1.9,1.6,3.8-.9,4.9-2.9-3.3,7.7-9.1,19.8-7.9,29.9,1.4,11.4,6.9,18,11,21,2.7,2.1,9,4,9,4,0,0,4,5,0,14-1.1,2.6-14,37-17,41,0-.1,1-.3,2.5-.4-8.6,11-10.6,26.9-13.5,55.4-.3,2.1-1.6,5.8-2.5,7.8,14.7,9.9,38.1,13.2,55.5,15,17.2,1.8,34.7,2.6,52,1,14.9-1.4,30.9-4.8,45-10,4.7-1.7,10.2-4,14.5-6.5-2.2-15.6-25.2-75.2-29.5-90.3-.5.2-1.1.5-1.6.7.8-13.7,1.6-29.7,1.6-29.7l6-14Z"/>
                      <g>
                        <path class="cls-27" d="M246.7,278.3c2.5,7.4,9.6,16.3,18,19-2.1,4.4-4.6,8.6-7.5,12.5-3.7,4.9-16.4,18.3-22.7,17.5-5.6-.7-24-26-26.7-32.5,10.7-3.6,21.7-10.1,29-18.7-.3-2.1-.6-4.2-1-6.2,5.7.6,7.9,6.6,11,8.5Z"/>
                        <path class="cls-43" d="M207.7,294.8c2.8,6.5,21.1,31.8,26.7,32.5,6.3.8,19-12.6,22.7-17.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-15-13.5-21.2-17.5-.3-2.4-.8-3.4-1.5-5.5-.4-1.3-1-2.3-1.5-3.5-1.1-2.5-2.4-3.8-2.5-4-1.2-2.2-2.5-4.5-3-7,.1,0-.5-.2,2-1Z"/>
                        <g>
                          <path class="cls-27" d="M191.7,278.8c-1.4-.2-1.7,4.5-2.5,7-2.7,9.1-10.1,26.8-10.5,28.2-.2.6-.2,2.3.5,2.2-.6.6-3.8,4.5-4.2,4.5-7-6.3-7.3-15.7-6.7-24.5,6.5-4,11.2-9.9,15.5-16,2.9-4.1,4.5-9.1,8.5-12.5-.3,3.1-1,8.1-.5,11Z"/>
                          <path class="cls-27" d="M198.7,296.8c-6.7,6.2-12.7,13.3-19.5,19.5-.7,0-.7-1.6-.5-2.2.4-1.5,7.8-19.2,10.5-28.2q4.7,5.5,9.5,11Z"/>
                          <path class="cls-21" d="M191.7,278.8c.6,4,3.6,6.9,6,10,.6.8,3.7,5.3,4,5.5-.7,1.1-2.1,1.6-3,2.5q-4.7-5.5-9.5-11c.8-2.5,1.1-7.2,2.5-7Z"/>
                        </g>
                      </g>
                    </g>
                    <g>
                      <path class="cls-34" d="M233.7,264.3c-9.1,11.6-21.8,20.5-36,24.5-2.4-3.1-5.4-6-6-10-.5-2.9.2-7.9.5-11,0-.7.1-.9.5-1.5,12.4,2.2,27.7-5.1,38.5-11,1.2,2.9,1.7,6,2.5,9Z"/>
                      <path class="cls-28" d="M235.7,269.8c.4,2.1.7,4.2,1,6.2-7.3,8.7-18.3,15.1-29,18.7-2.5.8-1.9,1-2,1-.7.2-.4.7-2.1-.3s-.2-.1-.4-.2c-.3-.2-1.3-.8-1.5-1-.3-.2-3.4-4.7-4-5.5,14.2-4,26.9-12.9,36-24.5.7,2.4,1.9,5.2,2,5.5Z"/>
                    </g>
                  </g>
                  <path class="cls-13" d="M237.2,537.8c0,1-11,18.1-12,18.2-24,1-60-1-67-7-3.8-3.3-7.8-20-8-21-4.2-16.8,69.8,11.4,87,9.8Z"/>
                  <path class="cls-23" d="M246.6,179.3l5,23s2.5,3.6,4,3c4.1-1.7,7-9,7-17s-4-14-4-14l-12,5Z"/>
                  <g>
                    <g id="Background" class="cls-63">
                      <path class="cls-17" d="M186.7,540c-76.7,0-153.3,0-230,0V28h512v512c-62.8,0-125.7,0-188.5,0q1-6,2-12c4.7-1.7,10.2-4,14.5-6.5,3.4-2,7.1-3.8,8.5-7.7-.6-6.9-2.4-13.6-4-20.2,78.7-56.2,100.3-140.9,35-218.5.4-.1,3.7,0,8.7-3,11.3-6.9,14-20.6,8.7-32.2,19.7-4.1,26.7-27,11.5-40.5,1.3-4.6,0-9.7-3.5-13,18.1-14.9,14.3-39.8-6.5-49.5,3.4-16.5-13-29.2-28.5-28,4-21.1-13.4-38.6-33.7-28.2-17-18-45.8-26.5-68.5-14.5-20.8-21.1-68.8-14-83,12-16.5-13.3-43.4,1.7-37.7,22.7q-5.9,5.1-11.7,10.2c-15.4,1.6-25.4,19.2-18.2,33.2-16.5,8.4-18.6,31.5-2,41-18.5,4.8-26.8,31.5-8,41.5-3.3,17.4,13.6,21.6,14,23-2.9,8-1.6,15.4,4,21.7-35.1,28.1-51.5,75.2-45,119.2,7.3,49.2,46.1,86.2,86.5,111.2-.7,4.4-1.8,8.7-1.5,13.2,2.5,2.9,4.9,4.7,8,6.7,14.7,9.9,38.1,13.2,55.5,15q.7,1.5,1.5,3Z"/>
                    </g>
                    <g>
                      <g>
                        <path class="cls-61" d="M281.7,180c-3.1-1.8-1.7,4.8-11,5.5,0-7.6-1.4-10.5-7-15.7l.7-.7c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4Z"/>
                        <path class="cls-61" d="M281.7,180c.5,1.8.2,4.9,1,5.5-1.1.3-8.9,8-12.5,7.5.5-2.2.5-5.2.5-7.5,9.3-.7,7.9-7.3,11-5.5Z"/>
                      </g>
                      <g>
                        <path class="cls-61" d="M129.2,112.5c-1.6,2-3.6,3.8-5,6,.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-.3-.4-2-8.5-2-9.2.1-4,3-8.2,6-10.7-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7Z"/>
                        <path class="cls-61" d="M343.7,127c4.3,7.1,2.9,10.5,0,18.2,4.7,1.1,5.4.4,10,2.7l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7Z"/>
                        <path class="cls-20" d="M94.2,223.5c-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-1.7-8.4,2.7-11.1,3.5-12.5q7-4.6,14-9.2-.5-4.6-1-9.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2,1.4-2.2,3.4-4,5-6,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7Z"/>
                        <path class="cls-20" d="M346.2,220c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
                        <path class="cls-66" d="M87.7,203c-.8,1.4-5.2,4.1-3.5,12.5-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2Z"/>
                        <path class="cls-66" d="M100.7,184.5q.5,4.6,1,9.2-7,4.6-14,9.2c.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2Z"/>
                        <g>
                          <path class="cls-61" d="M133.2,180q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5l10-4.5Z"/>
                          <path class="cls-49" d="M144.7,176c-1.4,3.7-2.8,5.7-3,10-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2Z"/>
                        </g>
                        <g>
                          <path class="cls-66" d="M356.7,204.2c1.6-17.5-7.8-17.6-8.5-18.5-3.1-4.3,5.8-3.9,10.5-9.5,7.1-8.4,5-23.2-5-28.2l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7-4-6.7-11.3-9.8-18.7-6.5-2.9-.6,1-6.1-10.2-12.2,8.8-16.2-11.8-29.4-22.2-14.2-18.4-20.7-44.2-29.9-70-16-17.5-19.9-50.6-17.5-68.7.2-1.8,1.7,0,4.2-13.2,9.7-2.1,0-10.4-11.3-22.2-1.5-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8,0-1.6,0-2.3.1.7,0,1.5,0,2.3-.1-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-1.2.2-2.4.9-3.5,1.5-.6.9-1.1,1.8-1.5,2.7.4-.9.9-1.8,1.5-2.7-8,4.4-5.4,3.6-9.2,11.5-19.2-1.6-26.4,17.1-12.7,30.2-2.7.9-5.4,1.2-8,2.2-2.1.9-3.3,1.4-5,3-9.5,8.9-5.1,21.5,6,26.2.7,1.9-4.1,4.6,0,14-18.9-2.2-25.7,19.2-8,27.5-3.8,9.2,3,21.4,13.2,17.7,8.3,8.1-2.1,8.2-.2,19.7,1.4,9,14.2,14.7,21.7,9.2,10.7,4.5,5.5,5.2,9.2,10.2,4.7,6.5,16.4,5.9,21.7.2,1.4.3.7,14.1,20,11.5,4.7-8.2,6.2-2.5,13.5-6,5.4-2.6,5.4-9.9,10.7-5,2.9-4.1,4.5-9.1,8.5-12.5,0-.7.1-.9.5-1.5-7.7-1.4-26.9-15.7-33.1-21.2-10.4-9.2-16.6-17.4-16.4-31.5.2-.6-.4-8.4-1.5-10.7-.4-.9-.3-9.4,0-17-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2c.2-.4,1.4-3.3,1.5-3.5,1.4-2.6,2.5-7,6.5-5.7q-1-1.4-2-2.7c1.1-9.4,7.9-32.2,17.5-36.5,5.6-2.5,11,1.2,17.7-8.5,22.9,12.9,31.8-2.3,33.5-3,6.9-2.6,8.8,5.3,9.2,5.7,7.9,9,16.1,5.6,23,18,2.7,4.9,3.6,11.3,6.5,16,1.2,2-.8,16.6.4,19.5,4.6,10.3,4,21,1.1,25.7,6.7-10.7,1.7,3.7,8-2,.6-1.3,2.4-5.3,2.5-6,.5-2.2.5-5.2.5-7.5,0-7.6-1.4-10.5-7-15.7l.8-.8c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4,.5,1.8.2,4.9,1,5.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2-6.2,8.9-16.6,15.4-26,20.5,1.2,2.9,1.7,6,2.5,9,.7,2.4,1.9,5.2,2,5.5,5.7.6,7.9,6.6,11,8.5.6.4,3.6.9,4.7,1,7,13.8,25.6,10.6,30-4,9.6,10.2,24.4,12.2,28.5-4,7.3,0,12.5.8,17.5-5.5,18.4,2,25.3-16.4,12.2-28.7q3.1-4.1,6.2-8.2c6.2,1.5,12,.1,15.2-5.5,4.1-7.1,2.1-14.6-4.5-19.2ZM108.1,113.3c-.3.8-.5,1.6-.7,2.4.2-.8.4-1.6.7-2.4ZM91.4,122.5c.6-.2,1.1-.4,1.7-.5.6,0,1.2-.1,1.7-.1-.6,0-1.2,0-1.7.1-.6,0-1.1.2-1.7.5-.4.2-.8.4-1.2.6.4-.3.8-.5,1.2-.6ZM86.7,128.9c.1-.5.3-1.1.4-1.6-.2.5-.3,1-.4,1.6-.2.8-.2,1.6-.1,2.5,0-.8,0-1.7.1-2.5ZM346.2,220c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
                          <g>
                            <path class="cls-20" d="M235.4,80c12.6-1.2,21.7,20.4,45.5,12.5,11.5,15.3,21.3,10.6,16.2,29.2,2.6,1.3,12.5,10,13.2,10.2,5.5,2,21.8-2.9,16.7,17.2,4.7,1.6,21.4,8.2,23.5,12,2.4,4.4.7,13-4.2,14.7-11.6,4-.9-9.6-1.2-11.2-12.5-11.5-29.9-.8-23-24.5l-13.2-1.2c-8.4-11.1-13.2-8.1-16.2-11.7-8-9.7,12.5-22.6-19.7-18.2q-1.2-4.2-2.5-8.5c-12.3.4-23-6.6-32.5-13.5-4.2-.3-17.2,8.1-14.2-.7.6-1.9,9.6-6,11.7-6.2Z"/>
                            <path class="cls-65" d="M282.4,98.5c3.1-.2-2.6,2.2-3.5,2.5-12,4.4-3.5-2,3.5-2.5Z"/>
                          </g>
                        </g>
                      </g>
                      <g>
                        <g>
                          <g>
                            <path class="cls-12" d="M233.7,264.5c-9.1,11.6-21.8,20.5-36,24.5-2.4-3.1-5.4-6-6-10-.5-2.9.2-7.9.5-11,0-.7.1-.9.5-1.5,12.4,2.2,27.7-5.1,38.5-11,1.2,2.9,1.7,6,2.5,9Z"/>
                            <path class="cls-42" d="M235.7,270c.4,2.1.7,4.2,1,6.2-7.3,8.7-18.3,15.1-29,18.7-2.5.8-1.9,1-2,1-.7.2-.4.7-2.5-.5-.3-.2-1.3-.8-1.5-1-.3-.2-3.4-4.7-4-5.5,14.2-4,26.9-12.9,36-24.5.7,2.4,1.9,5.2,2,5.5Z"/>
                          </g>
                          <path class="cls-42" d="M259.7,226c-6.4,16.8-49,37.4-61.2,37-15.6-.5-46.6-25.9-50.2-42.2,5.5,1.1,11.2,1.2,16.5-.2.6.9,3,3,6.5,8.5,7,11,11.1,22.4,27,20.5,12.7-1.5,15.7-10.1,19.5-14.5,3.2-3.7,6.8-7.3,10-11,3.6.9,7.6,1.5,11.2,1,2.1-.3,11.8-4.1,10.7-6,2.3-1.1,8.3-5.6,10-7.5,2,4.5,1.8,9.8,0,14.5Z"/>
                          <path class="cls-5" d="M249.7,219c1.1,1.9-8.6,5.7-10.7,6-3.6.5-7.7-.1-11.2-1,.4-.5.6-1.4,1-2,6.8,1.4,14.8,0,21-3Z"/>
                          <g>
                            <path class="cls-42" d="M257.2,235c-1.7-1.6,4.7-6.1,2.5-9,1.8-4.7,2-10,0-14.5,1.7-1.8,5.9-9.8,6.9-12.2.6-1.3,3.4-5.6,3.6-6.3,3.6.5,11.4-7.2,12.5-7.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2Z"/>
                            <path class="cls-14" d="M284.7,204.5c1.9,7-4.8,7.9-7.2,6.5-2.5-1.4-3.7-10.3-2.2-13.5,4.2,1.7,8.6,10.7,9.5,7Z"/>
                            <path class="cls-46" d="M284.7,204.5c-.9,3.7-5.3-5.3-9.5-7,2-4.5,16.9-7.5,14.2,4.5-1.4-9.8-9.5-5.7-9.7-4.7-.2.8,4.1,4.1,5,7.2Z"/>
                          </g>
                          <path class="cls-23" d="M226.7,222.5c-1.7.4-3.3,2-5.5,2.5-19,4.1-34.9,5.3-52.5-4.5-1-.5-2-1-3-1.5,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2Z"/>
                          <g>
                            <path class="cls-67" d="M165.7,219c1,.5,2,1,3,1.5,2.3,3.6,7.4,6.7,11,10,.2.2,1,2.6,2.5,4.2.7.7,1.7,1.2,2.5,1.7-3.9,1.9-9.8-5.6-13.5-7.5-3.5-5.5-5.9-7.6-6.5-8.5,0,0,0-.7-.5-1.5.5,0,1,0,1.5,0Z"/>
                            <path class="cls-67" d="M228.7,222c-.4.6-.6,1.5-1,2-3.2,3.7-6.8,7.3-10,11-1.5.2-6.1,1.2-7,1.5,2.3-2.6,4.7-5,7-7.5,1.2-1.2,2.7-2.5,3.5-4,2.2-.5,3.8-2.1,5.5-2.5l2-.5Z"/>
                            <path class="cls-50" d="M217.7,235c-3.8,4.4-6.8,13-19.5,14.5-9.5-.5-18.3-11.2-13-12.5,11.9,7.1,20.2,1.4,25.5-.5.9-.3,5.5-1.3,7-1.5Z"/>
                            <path class="cls-26" d="M184.7,236.5c.6.4.5.5.5.5-5.3,1.3,3.5,12,13,12.5-15.9,1.9-20-9.5-27-20.5,3.7,1.9,9.6,9.4,13.5,7.5Z"/>
                            <path class="cls-26" d="M221.2,225c-.8,1.5-2.3,2.8-3.5,4-12.3,4.4-25.5,5.6-38,1.5-3.6-3.3-8.7-6.4-11-10,17.6,9.8,33.5,8.6,52.5,4.5Z"/>
                            <path class="cls-33" d="M217.7,229c-2.3,2.5-4.7,4.9-7,7.5-5.3,1.9-13.6,7.6-25.5.5,0,0,0-.1-.5-.5-.8-.6-1.8-1.1-2.5-1.7-1.5-1.6-2.3-4.1-2.5-4.2,12.5,4.1,25.7,2.9,38-1.5Z"/>
                          </g>
                        </g>
                        <g>
                          <g>
                            <path class="cls-33" d="M242.7,197.5c1.8-1.9,1-1.5,1.5-3.5,0-.4,0-1,0-1.5,0-.1,1.3-.4,0-3,3,.6,7,4.5,7,6.5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.7-3.5,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2Z"/>
                            <path class="cls-31" d="M244.2,189.5c1.3,2.6,0,2.9,0,3l-1.5,1.5c-6.6,1.4-5-5.9,1.5-4.5Z"/>
                            <path class="cls-40" d="M244.2,194c-.5,2,.3,1.6-1.5,3.5-3-1.7,0-1.5.5-3.5h1Z"/>
                            <path class="cls-32" d="M244.2,194h-1c-.2,0-.3,0-.5,0l1.5-1.5c0,.5,0,1.1,0,1.5Z"/>
                          </g>
                          <g>
                            <path class="cls-66" d="M155.6,165.3c-6.8,8.7-8.2,31.1-8,30,.5.7-4.6,20.7-5,20-4-7-10-22-2-38s9.4-11.7,15-12Z"/>
                            <path class="cls-23" d="M259.7,201c4.8-11-8.2-5-8.5-5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.8-3.5-.6-4.6,3.2-8.1,6.9-10.2s6-1,9-1,7,3,9.6,5.7c.8,1,14-18.9,14.2-19,.2,0,1.8-4,1.8-4.7-.2-1.8-5.8-6.5-7-8.5-2.9-4.7-3.8-11.1-6.5-16-6.9-12.4-15.1-9-23-18-.4-.5-2.4-8.3-9.2-5.7-1.7.7-10.6,15.9-33.5,3-6.7,9.7-12.1,6-17.7,8.5-8.6,10.8-21.6,44.5-21.4,44.2-1,4-3.1,9-3.1,13.6-.5,3.7-.6,13-1,14-4,9-1,19,0,21,.1.3,14.7-.3,21.6-1.3.5,0,1,0,1.5,0,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2l2-.5c6.8,1.4,14.8,0,21-3,2.3-1.1,8.3-5.6,10-7.5,1.7-1.8,6.9-10.1,8-12.5-6.3,5.7-1.2-8.6-8,2ZM182.2,190c-1.9-.4-.6,3.1-1,3.7-.9,1.3-3.3-1.6-4,1.2,0,.6.1,1.6,0,2,5,1.1-4,12-5.8,12-1.4,0-2.7-5-7-4.5-2,.2-10.5-1.6-15.4-9,.5-2.8,1-7.6,1.1-8,.1-.3-.2-1.6.5-2.7,4.3-7.5,20.8-9.1,28.5-8.7,2.1,4,3.2,9.5,3,14ZM230.3,156c-1.2,0-2.4,0-3.5.2,1.1-.1,2.3-.2,3.5-.2ZM220.4,157.7c-.5.2-1,.5-1.3.8.4-.3.8-.6,1.3-.8Z"/>
                            <path class="cls-33" d="M167.2,187c-16.7,4,1.1,19.8,5,7.5.6-2,.6-3.5.5-5.5.5,0,3.4,2.9,4,4.5,0,.3.5,1.4.5,1.5,0,.3,0,.6,0,1s0,.8,0,1c-1.7,5.9-18.6,5.3-25.5,3s-2.8-3.5-2.5-5.5c.9-6.8,16.1-10.5,18-7.5Z"/>
                            <path class="cls-42" d="M179.2,176c-7.7-.3-24.2,1.3-28.5,8.7-.7,1.2-.4,2.4-.5,2.7,6.8-9.9,27.7-7.3,26.5,6,0,.2.9,1.7,0,4.5-3.3,4.8-19.2,3.6-25,2-.4-.1-2.7-1.1-1.5.5,3.4,4.8,11.7,7.1,14.4,7.8,4,1,5.4,1.2,6.8.7,8.2-2.7,10.2-14.7,10.7-19s-.9-10-3-14Z"/>
                            <path class="cls-25" d="M172.2,194.5c-2.2,2.7-4.9,1.4-3.5-2,2-.5,2.9-3.5,4-3.5,0,2,.1,3.5-.5,5.5Z"/>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                  <path class="cls-61" d="M146.6,201.3"/>
                  <path class="cls-2" d="M143.6,210.3c5,5.2,13.7,9.7,20.6,8.7.6.8.5,1.4.5,1.5-5.3,1.5-11,1.4-16.5.2,3.7,16.3,34.7,41.8,50.2,42.2,12.3.4,54.9-20.2,61.2-37,2.2,2.9-4.2,7.4-2.5,9-6.2,8.9-16.6,15.4-26,20.5-10.8,5.9-26.1,13.2-38.5,11-7.7-1.4-28.1-14-34.2-19.5-9.8-8.7-17.9-23.6-17.8-37.7,0,0,2.9,1,3,1Z"/>
                  <path class="cls-2" d="M155.7,161c-1.7.9-7.5,10.1-9.1,11.3,1.1-9.4,11-42,21.6-44.8s-4.5,4.5-10.5,24.2c-.9,2.9-.9,6.3-2,9.2Z"/>
                  <g>
                    <path class="cls-42" d="M194.7,219.5c-4.1-.2-7.8-2.9-10.5-5.5-1.9-10.3,3.4-.9,5.7.5,6.2,3.7,18-.3,4.7,5Z"/>
                    <path class="cls-46" d="M184.2,214c2.7,2.6,6.4,5.3,10.5,5.5,3.7.2,14.5-5.7,8.7-1-10.8,8.8-26.9-6.9-21-7,.5,0,.4,1.2,1.7,2.5Z"/>
                  </g>
                  <path class="cls-42" d="M228.7,169c3-.3.8.7-3.1,2.3-6.1,2.5-10,7-6.9,20.5.1.5-.4.4-.7.7l-9.2-3c-.4-15.9,5.9-19.2,20-20.5Z"/>
                  <path class="cls-2" d="M282.6,214.3l1,2c1,2-3,3-3,3-1.2.4-2,1-3,0l1-5c1-2,3.7-.5,4,0Z"/>
                  <path class="cls-42" d="M265.6,164.3c-.2-3.9-4.1-3.8-7-8-2.4-3.5-3.9-11.5-4-12-3-10-12-14-12-14,0,0,14,17,9,40-.6-.1-4.1-2.2-4.9-2.3-5.5.7-1.1,1.7,1.5,6.2,3.4,6,5.2,13.4,3.5,20.2,0,.3,0,1.8,0,1.8,0,0-1,2.2-2,3-5,4-14.9,2.8-18,2-2-.5-5-2-5-2,0,0,3,9,20,9s14.4-12.9,15-16c.9-4.5,0-10-3-16-.1-.2,7.1-10.1,7-12Z"/>
                  <g>
                    <path d="M145.6,173.7c0,.3.5,0,1-.4,6-4,9-6,11-7,4-2,6.6-2.1,7-2.1,3.7-1.2,17.6,3.6,12.7-3.7-4.5-6.7-17.1-1.6-22.5,1.2-1.7.9-9.3,7.6-9.3,12.1Z"/>
                    <path d="M245.9,168.7c.6.6.8-2.4.2-4-4.1-10.9-27.4-9-28.7-4.2-2,7.1,10.4,1.2,21.5,4,2.8.9,3.8.9,7,4.2Z"/>
                  </g>
                  <g>
                    <path class="cls-25" d="M283.6,222.3c0-2,0-5-1-6s-1.8-2-3-1-1.8,4.6-2,7c0,.8.4,3.4,1.1,4,2,1.5,3.3,1.3,4,.2,2-3.2,1-2.8,1-4.2Z"/>
                    <path class="cls-40" d="M284.2,221.5c-.2-2.8-.5-4.8-1.6-5.2-3-1-1,3-4,5s-.6,3.3,0,4c3.4,4.1,5.8-1,5.6-3.8Z"/>
                  </g>
                  <path class="cls-2" d="M252.1,185.2c0,.3-.4.6-.5.4-4-7.3-17.2-9.1-22.3-6.7-3.1,1.5,7.5-8.2,17.3-3.6,4.9,2.3,5.2,7.9,5.5,10Z"/>
                  <path class="cls-18" d="M258.4,189c-4.4,1.3-7.2.8-8.8-.8-.4-.4-.8-.7-1.1-1.1-6.9-9.9-25.9-4.9-24.9,6.3,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2-3-1.7,0-1.5.5-3.5-.2,0-.3,0-.5,0-6.6,1.4-5-5.9,1.5-4.5,3,.6,7,4.5,7,6.5.4,1.3-.6,2.4-.6,2.3,1-1,2-3,1-3.7,2.3,0,6.7-5.5,6.7-5.5Z"/>
                  <path class="cls-2" d="M149.6,186.3s4.3-5.6,8-7c5.6-2.2,19-4,22-3s-11.7-4.6-21.2-1c-1.3.5-3.5,1.7-4.8,3-4,4-4,8-4,8Z"/>
                  <path class="cls-18" d="M150.8,186.6h0c-3.2,2.7-7.4.4-7.4.4,0,0,1.4,3.6,4.7,4.3.1,0,.3,0,.5.1,0,1.8,0,2.3.6,3,.9-6.8,16.1-10.5,18-7.5.1.1.2.2.3.3.2.3.2.4,0,.5.2,0,.2-.2,0-.5,0,0-.2-.2-.3-.3-16.7,4,1.1,19.8,5,7.5-2.2,2.7-4.9,1.4-3.5-2-.9-.3-1.5-.5-2.1-.7.5.2,1.2.4,2.1.7,2-.5,2.9-3.5,4-3.5.5,0,3.4,2.9,4,4.5,1.2-12.9-18.4-15.7-25.8-6.8Z"/>
                  <g>
                    <path class="cls-39" d="M183.6,188.3c0,15.7-15.3,27-28,27s-19-10.3-19-26,9.3-22,22-22,25,5.3,25,21Z"/>
                    <path class="cls-39" d="M262.6,189.5c0,22.8-17.9,29.8-32.8,29.8s-22.2-11.3-22.2-28.7,10.9-24.3,25.7-24.3,29.3,5.8,29.3,23.2Z"/>
                    <g>
                      <path d="M267.6,198.3c5.8-9.6-3.8-18.8-5-22-3-8-6.8-10-10-11s-6-1-13-1-29-3-34.5,13.7c-7.2-3.1-12.6-2.6-20-1-1.5-2.7-5.5-11.7-20.5-12.7-1.9-.1-9.2-.7-16,1-8,2-7.9,2.9-10,5-2.2,2.2-4.6,9.8-5,18-.3,7,2,17,3,19s3,6,5.8,7.5c13.2,7.5,15,5,21.2,4.5,15-1,26.3-18.5,26-32.8,21.2-1.9,7.5,3.4,18.2,22.7,2.6,4.6,9.8,11,16.8,13,4.9,1.4,14.8,1.8,23-2,13-6,17-17,20-22ZM181.4,191c-.3,7.5-3.3,13.5-8.1,17.3-6.2,5-15.2,6.5-24.9,3.7-5.8-1.7-7.8-6.3-8.8-8.7-4-10,0-24,1-27,1.9-5.8,10.4-7.7,16-8,8.6-.5,17.3.2,21.7,8.7,2.1,4,3.2,9.5,3,14ZM214.4,209.3c-3.5-4.7-5.4-13.9-5.5-19.7-.4-15.9,5.2-19.1,20-20.5,5.6-.5,11.5-.9,17,0,.8.1,2.4.4,3,.5,2.1.6,4.2,1.3,5.8,2.8s4.4,6,6,16.9c.5,3.4,0,8-1.7,12.7,0,0,0,0,0,0-8.9,20.4-36.1,18.5-44.5,7.2Z"/>
                      <path class="cls-59" d="M282.2,175c-.6-.6-13.7-6.3-16-7-2.6-.7-8.2-.1-8.6.3,4.7,4.4,2.9,14.9,7,19s3.7-1.2,5.8-2.2l.2.2h2v-.8c9.1-.7,11.9-3,15-1.2-.4-1.6-4.5-7.2-5.4-8.3Z"/>
                      <g>
                        <path class="cls-9" d="M134.9,179l-10,4.5c-.5-1.1-2.6-9.7-1.2-10.5,22.8-3.4,17.7-10.3,11.2,6Z"/>
                        <path d="M134.9,179q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5l10-4.5Z"/>
                      </g>
                      <path d="M283.6,185.3c-.8-.6,4.5-1.2,4-3-2.9-1.7-6,.8-13.6,2-9.5.8-12.4-2-12.4-2l1,3c0,.5.5,2.5,1,4.4l-2.1.7,2.1,6.9c5.4-5.4,8.4-3.5,15-9,2.4-1.8,4.5-2.9,5-3Z"/>
                    </g>
                  </g>
                </g>
                <path class="cls-41" d="M210.5,556.2l-1.3-10.7s2.7,10.7,4,10.7h-2.7Z"/>
                <path class="cls-56" d="M138.1,389"/>
                <g>
                  <g id="Background-2" data-name="Background" class="cls-63">
                    <path class="cls-11" d="M-43.7-83q0,285.1,0,570.2,285.1,0,570.2,0,0-285.1,0-570.2H-43.7Z"/>
                    <path class="cls-11" d="M179.6,397.6c3.5-2.7,24.5-15.8,25.1-18.1-1.5-10.1-6.2-19.3-6.7-29.5l-1.4-1.4c-9.4-.1-13.1-2.8-14.5-12.3-30.8,5-15.3-22.4-14.2-29.2,5.5-33.4-26.1-18.3-40.9-21.4-30.1-6.3-22.9-58.6-20.9-80.5-32.4-6.1-31.6-43.7-27.8-69.6,4.3-29.7,16.8-38,17.3-41.8,1-7.4-10.2-14.9-12.3-26.2-6.4-35.2,39-35.6,59.3-49.8,15.2-10.6,29-34.2,54.9-46.8-1.1-12.2-11.1-3-12-2.8-6.5,2-8.1-.5-12.8,4.5-10.9,0-19.1,8.8-29.5,11.7-16.2,10.7-42.8,23.9-55.4,37.6-18.3,19.8-21.3,43.5-25.6,69.1-6.4,9.7-5.8,21.9-8.9,32.9-1.9,23.7.7,46.3,4.5,69.6,3.8,11.1,6.6,23,9.5,34.5,4.2,6,7,20.5,9.5,25.6,1.3,2.8,2.9,3.1,3.3,3.9.7,1.1,1,3.7,1.1,3.9,1.1,1.5,3.2,2.3,4.5,3.9,6.2,8.4,12.8,15.9,19.5,23.9,13.1,8,13.3,12.7,14.2,13.6,1,1,19.1,13.8,22.3,16.1,6.6,7.3,13.7,14.8,17,24.2,1.1,1.6,6.7,2.6,8.9,13.9q3.3,4.2,6.7,8.4c.6,10.8,3.2,14.8,3.3,15.6.6,3.9-1.3,8.4,2.2,16.4Z"/>
                    <path class="cls-11" d="M351.7.5c.6,1.2,12.2,12.5,17.8,19.8,3.8,4.8,34.7,48.5,36.2,51.2,6.1,11.1,9.9,24.6,8.9,37.3-2.2,27.9-25.2,28.5-37,33.7-26,11.5-7.5,22.7-23.7,43.7-8.9,11.5-24.6,15.7-27,17.5-13.7,10.5,14.4,26.3,17,56,3.8,43.3-24.7,44.3-25.6,48.4,18.3,31.7-6.7,30.9-28.4,42.3-1.5,8.4-4.5,16.7-5.6,25.1.6,2.2,23.1,14.8,26.7,17.5,2.9,0,.7-14.6,2.2-22,3.5-16.7,37.6-49.7,46.8-66.3,1.4-2.5,1.8-5.6,3.9-7.8,5.1-13.3,6.1-27,8.9-41.2-.6-50.2-5.5-58.5,32.9-94.1,8.1-11,14.9-16.5,18.9-30.6,2.4-16.3,3.2-32.5,1.1-49-9-31.2-31.5-60.5-52.6-84.4-10.7-1.2-5.4-8.5-11.1-11.7-4.1-2.3-5.9,1.1-6.7,1.1-.8,0-7.2-5.6-5.3,3.6-7.9,4.8,5.8,3.7,6.1,5,.8,3.3-7.9-1.9-4.5,4.7Z"/>
                    <path class="cls-11" d="M240.6,362.5c-11.1-3,.2,20.1,1.4,27,1,5.8,2.2,32.4,2.8,34,.7,1.9,4.3,1.8,5,0,.8-2.2.1-37.5,3.3-47.9-1.4-1.8-11.7-12.9-12.5-13.1Z"/>
                  </g>
                  <g>
                    <path class="cls-4" d="M222.5,5.2c16,.4,25.6,2.5,40.5,7.5.2,0,.4,0,.6,0,6.6,2.3,12.9,5.4,19.3,8.1-10.1-19.9-53.1-26.4-60.5-15.6Z"/>
                    <g>
                      <path class="cls-64" d="M91.6,85.6c-11,2.4-56.3,16.3-47.4,33.4,4.8,9.2,55.7,32.3,68.3,35.9,2.2,3.8-21-6.3-21.5-3.7,10.2,3.5,20.9,5.7,31.2,8.7.5-2.6.9-5.5,2.5-7.8.2-2.7-5.1-6.8-1.2-15.6-22.1-16.8,8-50.4,34.9-53.9,0-.4.2-1.1-.3-1.2-1.6-.5-29.3-.2-33,0-10.9.6-22.7,2-33.4,4.4Z"/>
                      <path class="cls-21" d="M159.5,66.3c-15.2-.2-30.3,1.5-45.5,1.2-2,.3-5.2,1.4-6.2,0-.6.3-.7,1.3-2.8,1.9-22,.5-86.4,15.3-67.7,48.6,2.2-2-.5-4.2,0-7.8,2-15.4,42.2-24.3,54.9-27.1,41.1-9.3,51.5-5.7,92.6-5,43.4,5.9,105.6,19.4,144,39.9,3.6,1.9,16.2,9.3,13.4,10,9.2,4.4,40,23.9,44.3,32.1,2.9,5.7,1,9,3.1,8.4,6.8-20.2-17.2-40.2-33.7-48-.2,0-.5,1.4-3.4,0-53.4-24.4-96.1-39.9-154.3-51.1-12.8-2.5-25.7-3-38.7-3.1Z"/>
                      <path class="cls-21" d="M266.8,75c17.3,4.9,73.6,25.2,85.4,35.5.8,0,.8-1,.6-1.6-2.8-10.5-22.9-44.6-30.6-54.2-11.9-15-23.3-23.8-39.3-34-6.4-2.7-12.7-5.8-19.3-8.1,3.7,20.6,3.2,41.5,3.1,62.4Z"/>
                      <path class="cls-27" d="M221.9,6.4c-38.8-1.3-79.9,28-104.8,56.1,15.6-4.5,50.5-4.3,67.3-3.1,10.8-19,24.5-39.8,42.4-52.7-.3-.6-4-.3-5-.3Z"/>
                      <path class="cls-27" d="M198.2,69.4c58.2,11.2,100.9,26.8,154.3,51.1,3,1.4,3.3,0,3.4,0,0-.8.1-1.7,0-2.5-18.2-12.1-46.3-24.6-67-31.8-15.2-5.3-70.7-20.3-83.9-20.6-4.1,0-5.6-.8-6.9,3.7Z"/>
                      <path class="cls-1" d="M386.5,160.1c-4.3-8.2-35-27.7-44.3-32.1-5.9-2.8-17.6-8.4-17.5-5,2.7.9,3.5,3,3.7,3.1,8.6,4.9,48.5,30.8,51.1,37.7,4.2,11-15.6,19.5-31.6,22.1,2,0,3,2,6,4,16-1.6,31.2-8.3,35.6-21.5-2.1.6-.2-2.7-3.1-8.4Z"/>
                      <path class="cls-1" d="M37.3,118c8.6,15.3,37.4,27.4,53.6,33,.5-2.5,23.7,7.6,21.5,3.7-12.6-3.6-63.5-26.7-68.3-35.9-8.9-17,36.4-30.9,47.4-33.4q.3-1.2.6-2.5c-12.7,2.9-52.9,11.8-54.9,27.1-.5,3.6,2.2,5.8,0,7.8Z"/>
                      <path class="cls-22" d="M205,65.7c13.2.3,68.7,15.3,83.9,20.6,20.7,7.2,48.8,19.7,67,31.8-.8-4.3-.4-4.6-3.7-7.5-11.8-10.3-68.1-30.7-85.4-35.5-1.3-.4-1.8-.6-1.9-.6-15.3-4.2-43.1-10.4-58.6-12.5l-1.2,3.7Z"/>
                      <path class="cls-6" d="M117.1,62.5c-10.3,3-8.9,4.7-9.4,5,1.1,1.4,4.3.3,6.2,0,7.7-1.2,40.1-4.3,45.2-2.5.5.2.3.8.3,1.2,13,.2,25.9.6,38.7,3.1,1.2-4.5,2.7-3.8,6.9-3.7l1.2-3.7c-7.1-1-14.7-2-21.8-2.5-16.8-1.2-51.7-1.4-67.3,3.1Z"/>
                      <path class="cls-64" d="M332.9,129.2c.7.3,1.4.7,2,1.1.4.2.9.5,1.3.7.3.1.7.3,1,.5-3.8-2.4-6.9-4.3-8.7-5.3,0,0,0,.2,0,.2,1.6.7,3.1,1.7,4.4,2.8Z"/>
                      <path class="cls-64" d="M379.6,163.9c-1.9-5.1-24.1-20.5-39-30.2,2.1,1.7,6.4,5.3,2.4,11.3,12,2,16.3,8.1,18,12,2.5,5.6,2.4,14.3-3,20-4,3-9,2-11,7,.2.4.8,1.6,1,2,16.1-2.7,35.8-11.1,31.6-22.1Z"/>
                      <path class="cls-27" d="M92.2,83.1q-.3,1.2-.6,2.5c10.6-2.3,22.5-3.8,33.4-4.4,3.8-.2,31.5-.5,33,0,.5.2.3.8.3,1.2,36.7-4.8,130.3,22.1,166.5,40.5-.1-3.4,11.5,2.1,17.5,5,2.7-.6-9.8-8-13.4-10-38.5-20.5-100.6-34-144-39.9-41.1-.7-51.5-4.3-92.6,5Z"/>
                      <path class="cls-29" d="M114,67.5c15.2.2,30.3-1.4,45.5-1.2,0-.4.2-1.1-.3-1.2-5.1-1.8-37.5,1.3-45.2,2.5Z"/>
                      <g>
                        <path class="cls-21" d="M222.5,5.2c-.2.3-.5.8-.6,1.2,1,0,4.7-.3,5,.3-17.9,12.8-31.6,33.7-42.4,52.7,7.2.5,14.7,1.5,21.8,2.5,15.5,2.1,43.3,8.2,58.6,12.5-.1-20.6.7-41.2-1.9-61.7-14.9-5-24.5-7.1-40.5-7.5Z"/>
                        <path class="cls-43" d="M264.9,74.4c0,0,.5.2,1.9.6.1-20.9.5-41.7-3.1-62.4-.2,0-.4,0-.6,0,2.6,20.5,1.7,41.1,1.9,61.7Z"/>
                      </g>
                    </g>
                  </g>
                </g>
                <path class="cls-43" d="M274.7,442.3c-4.9-7-4.7-26.6-3.5-39.5,2.3-3,4.3-6.8,5-10.2,1-3.6.4-15.8-2.8-24.7-1.6.2,4.6,12.7-.8,23.9-2.1,3-4.9,6.9-9.4,9.9-2.2,1.3-4.8,2.6-7.9,3.6-5.9,1.6-13.7,1.7-24.2-1.3.6.2,35.3,40.1,43,56,7.5,15.4,16.2,62.8,15,67,.5-.1,6.8-3.4,10-5s-2.7-48.6-24.5-79.7Z"/>
                <path class="cls-43" d="M30.5,371.1s-9.5-26.1,35.5-48.4c0,0,18.8,13.1,15.9,18.3-3.8,6.9-8.4,12.6-16,22-4.8,6-21.7,8.2-24,11s-11.5-2.9-11.5-2.9Z"/>
                <path class="cls-43" d="M168.2,406.3c5,0,10-3,10-3-6,3-16,1.7-16,1.7,0,0,1.1,1.8,1,5-.1,3.3-1.5,8.1-4,12.3-4,7-7.1,12.9-9.6,17.9-2.8,4.8-4.9,10.2-6.1,13.6-.9,2.3-1.3,3.5-1.3,3.5-4.9,19.1-9.3,45.1-12,64.7,6.6,4,7,4,7,4,0,0-3.2-21.9,2-42.4,7.5-29,19.6-41.2,23-46.6,15-24,6-30.7,6-30.7Z"/>
                <path class="cls-43" d="M137.1,345s7,3,13-1c6.1-4.1-3,13-3,13,0,0-6.1-5.3-10-12Z"/>
                <path class="cls-27" d="M202,295s.6,49.4,2,68c1.7,22.3,1,57-1,81-1.8,21.8,3,95,3,95l2,1s-3.2-44-3.1-70.2c.1-29.8,1.9-48.9,2.1-63.8s-2-61-2-71-.8-24.6,0-34c.5-5.5,2-5,2-5l-5-1Z"/>
                <g>
                  <g>
                    <path class="cls-42" d="M37.7,296.2c-.7,19.2-6.1,39.1-2.1,67,17.5,7.7,32.2,6,33.2-15.5.1-2.8-.1-5.7,0-8.5.4-11,.4-21.4,1.4-32.5-8.7-8.3-20.9-9.7-32.5-10.6Z"/>
                    <path class="cls-14" d="M60.2,284.9c-7.1,4.9-14.2,9.3-23.3,9.2,2.2,1.6.7,1,.7,2.1,11.6.9,23.7,2.3,32.5,10.6,1.3-15.2,1.4-21.2,5.6-36.7-5.7,4.1-8.8,11.4-14.5,15.5-.8.6-1-.7-1.1-.7Z"/>
                  </g>
                  <path class="cls-53" d="M166,293.3c-5.3-2.6-10.9-5-16.9-5.6-2.3,5.7-5.8,9.6-9.9,14.1,11.9-4.8,20.1-5.1,25-5.3.5-1.1,1.1-2.2,1.7-3.2Z"/>
                  <g>
                    <path class="cls-27" d="M25.7,217.2c11.5,1.1,15.4-1.4,16.2-1.4-.4-11.1,3.9-1.7,13.4.7-.3-1-3-9.7-2.5-9.9q4.1,3.9,8.1,7.8c1-.9,5.7,3,2.1-9.9,0-.2-1.7-1.2-1.4-3.2.5-.7,1.4,1.9,2.1,2.5,4.5,4,6,5.7,12,4.9-3.1-.3-8-12-6.7-12.7q6.5,5.3,13.1,10.6c1.3-.7,3.2,1.3,1.4-4.2-.4-1.1-5-5.2-3.2-6.3l12.3,3.5c-1.4-2.9-1.1-5-3.5-7.8-39.9-8.4-49.5,15.3-63.5,25.4Z"/>
                    <path class="cls-27" d="M92.7,199.5c1.1,2.4,3.1,4.3,3.5,7.1.9,0,1.9,2,4.9-.7.6-.5,1.5-3.6,2.8-4.9-4.6-3.6-4.4-4.3-5.6-5.6,0,0-.8.2-.7-.7-2.2,0-6.1-2.3-8.5-2.8,2.4,2.7,2.1,4.9,3.5,7.8Z"/>
                    <path class="cls-8" d="M55.3,216.5c.2.7.7.8.7,1.4.2,0-.9.7,3.5.7-.3-3.1-.1-2.8,1.4-4.2q-4.1-3.9-8.1-7.8c-.5.2,2.2,8.9,2.5,9.9Z"/>
                    <path class="cls-44" d="M41.9,215.8c.4,0,1.3-1.1,3.9-.7,3.3,1.3,6.7,2.3,10.2,2.8,0-.6-.5-.7-.7-1.4-9.5-2.4-13.8-11.8-13.4-.7Z"/>
                    <path class="cls-43" d="M83.5,202.4c5.8,1.1,6.7,3.9,12.7,4.2-.4-2.7-2.4-4.7-3.5-7.1l-12.3-3.5c-1.8,1.2,2.8,5.2,3.2,6.3Z"/>
                    <path class="cls-47" d="M75.8,208.7c1.1-.1,5.4-1.6,6.3-2.1q-6.5-5.3-13.1-10.6c-1.3.7,3.6,12.4,6.7,12.7Z"/>
                    <path class="cls-51" d="M63.1,204.5l.7-.7c-.7-.6-1.6-3.2-2.1-2.5-.3,2,1.4,3,1.4,3.2Z"/>
                  </g>
                  <path class="cls-16" d="M176.2,280.2c-3.9-2.2-7.8-4.6-10.2-5.9-.4.3-1.1-1.2-1.8-.7q-4.8,4.2-9.5,8.5c-1.1,1.9-2.4,4.7-4.9,4.2,0,0,0-.1-.7,1.4,6,.6,11.5,3,16.9,5.6,2.8-4.9,6.1-9.4,10.3-13.1Z"/>
                  <g>
                    <path class="cls-21" d="M327.4,421.1c8.2-25-10.7-93.1-31.6-112-1.4-.3-1.6-1-2.3-1.8-4.2,3.6-8.9,6.4-13.4,9.6-5.1,3.7-10.3,7.5-15.7,10.9.4,3.4,0,7-1.6,10.3-.4.8-.8,1.7-1.1,2.6,0,.3-.1.8-.3,1.3-.1,1.6-.4,3.2-.5,4.8,0,.2.2,3.6.3,4.1.2,2.5.5,5,.8,7.4.5,4.1,1,8.1,1.3,12.2,2.9-2.1,6.3-4.7,7.7-5.6-.7-26.9-3.6-32.9,8.9-7.3,1.5.8,10.1-4.8,12.7-5.3,0,0,.3-.6,1.5-.9-2,18.6-4,43.6-2.2,61.3,4.1,2,29.1,14.9,30.9,14.9,2.5,0,2.4-5.8,4.7-6.4Z"/>
                    <path class="cls-21" d="M155.1,313.8c.7.1,1.4.9,2.2,2.1,1.8-6.7,4-13.3,7-19.4-4.9.2-13.1.5-25,5.3-2.9,1.2-7.3,4.1-10.6,5.6-17.9,8.6-34.6,20-52.2,28.9-1.3,6.9-.4,7.2-6.3,11.3,16.6-3.7,8.2,27.4-3.2,35.3-10.7,7.4-20.3,4.2-27.9-5.6,7.6,20.4,22,23.6,41.6,17.6,2.1-7,6-5.7,10.2-8.5,16.1-10.6,31.3-23.4,42.7-39.2,11.3-15.6,8.8-18.8,11.6-37.7l3.2,30.3c2.6-11.6,1.5-27.1,6.7-26.1Z"/>
                    <path class="cls-14" d="M70.1,347.7h-1.4c-1,21.5-15.6,23.2-33.2,15.5.7,5.1,1.7,9.2,3.5,14.1,7.5,9.8,17.1,13,27.9,5.6,11.4-7.9,19.7-39,3.2-35.3Z"/>
                    <path class="cls-43" d="M80.7,394.9c15.1-4.6,51.9-28.1,66.3-37.9,0-3.2.4-12.5,1.4-17.1q-1.6-15.2-3.2-30.3c-2.9,18.9-.3,22.1-11.6,37.7-11.4,15.7-26.6,28.5-42.7,39.2-4.2,2.8-8.1,1.4-10.2,8.5Z"/>
                    <path class="cls-21" d="M292.5,352.2c1.1,3.5-9.8,8.3-14.6,12.5,4.9,20.3,4.2,20.9,9.1,41.2.9.8-2.6,8.3,4,12s8.9.7,14,1c-18.4-1-8.5-49.3-11-67.6-1.3.3-1.4.9-1.5.9Z"/>
                    <path class="cls-43" d="M287.6,405.4q-4.9-20.3-9.7-40.7c4.8-4.2,15.7-9,14.6-12.5-2.6.5-11.2,6.1-12.7,5.3-12.5-25.6-9.6-19.6-8.9,7.3-1.3,1-4.8,3.5-7.7,5.6,0,.9.2,1.8.2,2.8,3.3-1.5,4.3-2,9.1-4.2,3.1,16.1,9.3,31.8,10.3,48.2.5.6,8.6-.8,9.1-.2-.4-2.4-3-3-4.4-11.6Z"/>
                    <path class="cls-27" d="M68.7,339.2c-.1,2.8.1,5.7,0,8.5h1.4c6-4.1,5-4.4,6.3-11.3-2.3,1.2-5.2,2.1-7.8,2.8Z"/>
                  </g>
                  <g>
                    <path class="cls-15" d="M112.5,192.5c-2.6-.2-6.8,1.9-9.2,0-1,.6-1.8.8-2.8,1.4-.1,0-.4.8-2.1,1.4,1.2,1.3,1,2.1,5.6,5.6,5.5,4.3,11.8,7.5,15.2,14.1.8.2,7.6-3.8,15.9-5.6-6.7-9.5-10.1-15.9-22.6-16.9Z"/>
                    <path class="cls-52" d="M97.6,194.6c0,.9.7.7.7.7,1.7-.6,2-1.3,2.1-1.4-1.8-.4-2.3.7-2.8.7Z"/>
                    <path class="cls-37" d="M194.3,222.1c-.1-.2-1.5-3-2.1-4.2-1.7-1.7-3.4-3.5-5.1-5.4-4.1-1.2-5.9-6-11.2-7.4-.4,0-7.4,0-7.8,0-.6.1-5.7,4.1-10.2,5.6-10.4,3.6-23.8,9.1-32.8,12,15.2,2.9,29.3,16,33.2,31q19-11.6,38.1-23.3c-.1-.4.6-2-2.1-8.5Z"/>
                    <path class="cls-24" d="M101.2,205.9c2,.9,3.3,2.2,4.9,3.5,12.7,10.4,2.9,9.5-9.2,17.6,1.4,3.4-.4,2.8-2.8,5.6,11.2-8.4,22-7,31-9.9,9-2.9,22.4-8.3,32.8-12,4.5-1.6,9.7-5.5,10.2-5.6v-.7c-10.9,2.1-22.3,2.6-33.2,4.9-8.3,1.8-15.1,5.9-15.9,5.6-3.4-6.6-9.6-9.8-15.2-14.1-1.3,1.3-2.3,4.4-2.8,4.9Z"/>
                    <g>
                      <path class="cls-15" d="M41.9,215.8c-.8,0-4.7,2.5-16.2,1.4-8.1,5.9-15,4.7-21.2,15.9-14,25.1,6.7,60.7,32.5,61,9.1.1,16.2-4.3,23.3-9.2,7.1-6.1,13.1-32.3,12.7-39.9-.3-6.3-8.8-14.1,6-3.2,1.4-1,1-2,1.1-2.1-3.2-6.3-8.4-18.8-14.1-21.9-1.9,1.1-4.2.7-6.3.7-4.4,0-3.3-.7-3.5-.7-3.5-.5-6.9-1.5-10.2-2.8-2.6-.4-3.5.7-3.9.7Z"/>
                      <path class="cls-30" d="M28.1,222.1c-36.1-3.2-24.7,58.7,6.3,66.3,41.4,10.1,28.7-63.2-6.3-66.3Z"/>
                    </g>
                    <path class="cls-45" d="M65.9,217.9c5.8,3,10.9,15.5,14.1,21.9,6.5-4.9,9.5-7.7,16.9-12.7,12.1-8.1,21.9-7.2,9.2-17.6-6.6-1.6-38.4,3.2-40.2,8.5Z"/>
                    <path class="cls-54" d="M80,239.7c0,0,.4,1.1-1.1,2.1-14.8-11-6.3-3.1-6,3.2.4,7.5-5.6,33.7-12.7,39.9,0,0,.2,1.3,1.1.7,5.7-4.2,8.7-11.4,14.5-15.5,1-3.5,2.4-5.9,3.5-9.2,5.7-16.4,2.8-14,14.8-28.2,2.4-2.8,4.3-2.2,2.8-5.6-7.4,5-10.4,7.8-16.9,12.7Z"/>
                    <path class="cls-30" d="M83.5,202.4c1.8,5.5,0,3.5-1.4,4.2-1,.5-5.3,2-6.3,2.1-6,.8-7.5-1-12-4.9l-.7.7c3.6,12.9-1.1,9-2.1,9.9-1.5,1.4-1.7,1.1-1.4,4.2,2.1,0,4.4.4,6.3-.7,1.8-5.3,33.6-10.1,40.2-8.5-1.6-1.3-2.9-2.6-4.9-3.5-3.1,2.7-4,.8-4.9.7-6-.3-6.9-3.1-12.7-4.2Z"/>
                    <path class="cls-57" d="M158.3,253.9c.2.8-.2,2,0,2.8,1.8,9.6,1.7,16.7-3.5,25.4q4.8-4.2,9.5-8.5c.7-.5,1.3,1,1.8.7,4.6-2.9,9.5-5.5,14.1-8.5,2.2-1.4,5.5-2.8,6.3-3.5,4-3.1,11.7-12.2,12.7-16.9.1-.5.7-4,.7-4.2,0-2.7-2.8-7.9-3.5-10.6q-19,11.6-38.1,23.3Z"/>
                    <g>
                      <path class="cls-10" d="M149.8,286.3c2.5.5,3.8-2.3,4.9-4.2,5.2-8.7,5.3-15.8,3.5-25.4-8.3.3-4,16.4-8.5,29.6Z"/>
                      <g>
                        <path class="cls-15" d="M94.1,232.7c-12,14.2-9.1,11.8-14.8,28.2,2.5,27.2,20.1,49.4,49.4,46.6,3.3-1.6,7.7-4.5,10.6-5.6,4.1-4.6,7.6-8.4,9.9-14.1.6-1.5.7-1.3.7-1.4,4.5-13.2.2-29.3,8.5-29.6-.2-.9.2-2,0-2.8-3.9-15-17.9-28.2-33.2-31-9.1,2.9-19.8,1.5-31,9.9Z"/>
                        <g>
                          <path class="cls-30" d="M112.1,232c-39.4-5.4-29.6,59,4.2,68.4,42.9,11.9,33.8-63.2-4.2-68.4Z"/>
                          <path class="cls-24" d="M90.2,261.6c-5.9-1.4,3.2,20.4,11.3,28.2,1,1,10.7,8.2,11.3,7.8,2.8-2-7.6-8.7-13.8-18-5.4-8.3-7.8-17.8-8.8-18Z"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
                <path class="cls-64" d="M203.9,348.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M204.9,369.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M204.9,388.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M204.9,408.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M203.9,328.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-27" d="M30.2,370.2s22,5.6,39.4-33.8l7.6-4.7s15.7,15,9.5,24,3.5,20.3-18.1,27.9c-21.6,7.6-17.8,6.2-23.4,4.9-11.6-2.7-14.9-18.3-14.9-18.3Z"/>
                <path class="cls-64" d="M203.9,430.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M203.9,448.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M203.9,468.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M203.9,488.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <path class="cls-64" d="M204.9,509.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
                <g>
                  <path class="cls-66" d="M114.3,105.9c.4.5,9,7.2,10.5,7.7.2,1.5-.3,2.8-.5,4.2-.2,1.3-1.5,6.7-2,7.2-1.3,1.4-16.8,3.5-16,14.7-25.4,1.7-21.1-15.5-14.7-18,4.5-1.8,9.5,1.3,14,.5,1.5-1.2.5-7.5,5.2-15,1.1-.6,2.3-1.3,3.5-1.5Z"/>
                  <path class="cls-61" d="M106.3,139.9c.3,4.2,2.5,9.7,2.5,10.2,0,6.5-11.1,4.3-20,8.2,1.2-1.7,3.1-1.5,2.5-2.2-5.1-.5-6-.2-3.2-4.7-4.7-.8-7.4,2.4-7.2,0,2.6-1.1,5.3-1.4,8-2.2-13.6-13.1-6.5-31.8,12.7-30.2,3.8-7.9,1.2-7.1,9.2-11.5-4.8,7.5-3.7,13.8-5.2,15-4.5.8-9.5-2.3-14-.5-6.4,2.5-10.7,19.7,14.7,18Z"/>
                  <path class="cls-66" d="M80.8,151.4c-.2,2.4,2.5-.8,7.2,0-2.7,4.6-1.9,4.2,3.2,4.7.6.7-1.3.6-2.5,2.2-3.1,4.2-4.2,9.9-2,14.5-1-.7-1.8-.3-1.7-2-2.6.2-7.5-3.3-8.2-5.2-.9-2.4-.2-5.1-.5-7.5-.2-1.5-2.5-1.2-.5-3.7,1.7-1.6,2.9-2.1,5-3Z"/>
                  <path class="cls-61" d="M129.3,111.9c-1.6,2-3.6,3.8-5,6,.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-.3-.4-2-8.5-2-9.2.1-4,3-8.2,6-10.7-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7Z"/>
                  <path class="cls-20" d="M106.6,180.1c-3.8-7.1-12.8-9.5-15.1-12.2-3.4-4.2,9.2-4.4,14-6.5,16.7-7.2,4.8-18,7.2-24.2,22.9-12,14.4-10.8,17.5-17.5.5-1.1,8.2-7.7,8.5-8.5,1.1-3.1-3.1-7.7,5.7-13.7,18,2.3,32.5,10.2,36.5-13.5,3.6,5.3,3.2,11,7,8,4.1-3.2,1.5-15.7-8.5-14-7.2,1.2-7.1,15.7-10.5,16.5-22.5-2.9-21.6-9.7-37.7,8.2,1.7,8.8.3,6.4-2,9.2-1.6,2-3.6,3.8-5,6-.2,1.3-1.5,6.7-2,7.2-1.3,1.4-16.8,3.5-16,14.7.3,4.2,2.5,9.7,2.5,10.2,0,6.5-11.1,4.3-20,8.2-3.1,4.2-4.2,9.9-2,14.5,5.6,3.8,14.1,8.1,14,11,0,.9.2,1.6.2,2.2,1,.2,2,.4,2.9.7.4,0,.7.2,1,.3.4-2.3.9-4.6,1.6-6.9Z"/>
                  <path class="cls-66" d="M101,186c0-.6-.1-1.3-.2-2.2l-14.5.2c0,.4,0,.7,0,1.1,5-.4,9.9-.1,14.8.8Z"/>
                  <path class="cls-61" d="M81.8,180.6c.4,1.1-1.1,2.5-1.5,5.4,2-.4,4-.7,6-.8,0-.4,0-.7,0-1.1q7.2-.1,14.5-.2c.1-2.9-8.4-7.2-14-11-1-.7-1.8-.3-1.7-2-2.6.2-7.5-3.3-8.2-5.2-.9-2.4-.2-5.1-.5-7.5-.2-1.5-2.5-1.2-.5-3.7-9.5,8.9-5.1,21.5,6,26.2Z"/>
                  <path class="cls-66" d="M221.7,76.5c-26.7-18.5-50.1-16.3-67.9,1.1-1.8,1.7,0,4.2-13.2,9.7-2.1,0-10.4-11.3-22.2-1.5-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.2,2.8,11.2,5.2,15.1,12.2,2.6-8.3,13.8-14.5,19.4-20.1,5.6-5.6,6.5-11.7,14.3-14.2,9.6-16.4,23.3-30.3,40.3-39.3,1.1-.6,2.3-1.2,3.4-1.7.2-.8.3-1.4.5-1.4.2.3.4.6.5.9,12.7-6.1,45.3-6.8,58.9-9.3-1.6-4.9-17.7-15.3-22.3-18.5Z"/>
                </g>
                <g>
                  <path class="cls-35" d="M211.9,509.7c1.4.5,5.6,2.1,6.5,2.6,1.2.7,4.6,2,1.6,3.1-5.8,2.2-19.9-6.1-25.2-8.4-1.4-.6-1.6-1.3-2.2-1,0-.4.2-.5.2-.8,6.4.9,13,2.3,19.2,4.5Z"/>
                  <path class="cls-7" d="M220,515.5l.6,2.2c-9.7,2.5-18.9-4.6-25.8-10.7,5.3,2.3,19.4,10.6,25.2,8.4Z"/>
                  <path class="cls-48" d="M294.7,290.9c-3.4,10.9-8.8,21-12.7,31.6-7,19.2-42.7,121.7-44,133-.1,1.2-7.9,19.9-9,23-3.8,11.2-6.5,22.7-10.6,33.8,1.2.7,4.6,2,1.6,3.1l.6,2.2c1-.3,2.1-.5,3.1-.8q.4-.5.7-1c3.5-10.5,14.7-72.8,27.2-110.2,6-18.1,31.7-67.5,38.4-87.3,2-5.8,6.9-18.8,7.5-21.1.3-1.3.9-2.6.9-4-.1-.2-3.2-2-3.7-2.4ZM248.9,445.1c0,0-.1,0-.2-.1,0-.2.2-.5.3-.7,0,.3,0,.6,0,.9Z"/>
                  <path class="cls-7" d="M292.3,289.2c-.6-.3-10.2-2.6-11.3-3.1-9.6,29-14.6,70.4-15.2,66.6-3.1,9.1-6.4,17.5-11.6,25.1,0,0-16.6,34-15.4,50.2,0,0-.2,0-.3,0-3.7,15-20.6,66-25.2,79.5-.2.7-.7,2.1-1.4,2.1,1.4.5,5.6,2.1,6.5,2.6,4.1-11.1,26.5-76.2,28-84.2,4.2-13.2,16.3-47.2,16.4-47.3,7.4-19.1,12.2-39.2,19.2-58.3,3.9-10.6,9.3-20.8,12.7-31.6-.8-.5-1.6-1.3-2.4-1.7Z"/>
                  <path class="cls-36" d="M276.4,283.5c-.8-.2-6.8-1.1-7.1-.9-.5,1.6-1.5,2.9-2.2,4.5-.8,1.9-1.5,5.7-2.3,8-.5,1.5-9,46.5-25.7,94.2-18.9,53.8-46.2,111.2-46.5,112.5-.2,1-.4,1.9-.9,2.8.2.2.9.4,1,.7,6.4.9,13,2.3,19.2,4.5.8,0,1.2-1.5,1.4-2.1,4.4-13,20-59.9,24.6-77.2.1,0,.3.1.4.2q2.5-11,5-22c-1.6.2,18.4-43.7,22.6-55.9,3.5-10.2,6.5-22,9.7-32.4,1.3-4.2,3.4-8.3,4.6-12.5,1.8-5.8,3.8-19.1,6.5-20.6-2.5-1-8-3.1-10.3-3.6Z"/>
                </g>
                <g>
                  <g>
                    <path class="cls-2" d="M264.3,394.8c-.1.6-1.2.8-1.2,1-.5,2.9,5.3,4.6-2.4,20.7-2.3,4.8-4.6,7.6-7.9,11.7-.9,1.2-8.8,8.7-8.2,9.6,20.2,12.6,76.1,38.2,87.5,7.1-.4,6.1-.8,12.5-2.5,18.4-1.2,4.2-3,8.2-6.7,10.9-13.1,9.9-40.8-3.4-53.2-10.7-3.3-2-24.1-16.5-27.2-19-11.2-9.1-11.6-11.2-9.3-25.7,1.4-.5,4.2,3.6,7.3,5.5,4.3-4.7,18.1-10,19.9-14.8.3-.9,1.7-13.1,1.7-14.2.9-.5,1.2-.5,2.2-.6Z"/>
                    <path class="cls-42" d="M329.9,408.9c1.5,13.4,3.2,21.5,2.2,36.1-11.4,31.1-67.3,5.4-87.5-7.1-.5-1,7.3-8.5,8.2-9.6,3.8,1.9,4.2.8,4.4.8,10.6,2.5,21.2,4.3,31.8,6.6,3.4.7,7.3,1.3,9.8,1.9,7.2,1.7,14.7,3.2,21.1,6.9-4.3-6.3-12.2-8.1-18.8-11,7.4-12,17-17.2,28.6-24.5Z"/>
                    <path class="cls-2" d="M329.9,408.9c-11.6,7.4-21.2,12.5-28.6,24.5-.8,1.3-2.1,2.5-2.3,4.1-2.6-.6-6.4-1.1-9.8-1.9-2.1-4.2-2.7-11.6-3.8-14.5,10-1.2,14.1-2,23.4-5.2,7.5-2.6,14.3-5.8,21.2-9.7,0,.2-.1,1.3,0,2.5Z"/>
                    <path class="cls-2" d="M298.9,437.6c.2-1.7,1.5-2.8,2.3-4.1,6.6,2.8,14.4,4.7,18.8,11-6.4-3.7-13.9-5.2-21.1-6.9Z"/>
                    <g>
                      <path class="cls-42" d="M262.2,395.4c0,1.1-1.4,13.3-1.7,14.2-1.8,4.8-15.5,10-19.9,14.8-3.1-1.8-5.9-6-7.3-5.5.3-2.1.8-4.3,1.2-6.4,15.5,10.5-1,.6,2.3-5.2,16.9,9.3,14.4,4.3-.5-1.6.1-.5.2-1,.3-1.5,0-.3.1-.7.2-1,.8-.7.6-1.3.9-1.9,5.8,1.3,11.3,5,17.7,5.7-12.7-8.6-18.6-2.2-9.7-11.8,18.7,14.6,13.3,7.3-.4-3.1l.6-4.5c2.1-2.4,2.4-1.6,3.5-2.4,2.5-1.9-2.4-4.7,10.3.5-.1-6.6,2.4,3.8,2.5,9.6Z"/>
                      <path class="cls-2" d="M234.5,412.5c0-.2,0-.3,0-.5.3-1.4,1.2-4.3,1.7-6.3,14.8,5.9,17.3,10.9.5,1.6-3.3,5.8,13.2,15.6-2.3,5.2Z"/>
                      <path class="cls-19" d="M237.6,401.4c2-4.4,5.8-7.4,6.4-12.3.9-1.3,1.7-1.3,1.8-1.4l-.6,4.5c13.7,10.4,19.1,17.8.4,3.1-8.9,9.6-3,3.2,9.7,11.8-6.5-.7-11.9-4.4-17.7-5.7Z"/>
                      <path class="cls-19" d="M253.2,390.6c5.9,6.3,5.2,9.5-.4.7v-.5q.2,0,.4-.2Z"/>
                    </g>
                  </g>
                  <path class="cls-58" d="M279.1,378.1c.1-1,.3-2.1.3-3.1,0-1,.1-1.9.1-2.6,0,.7,0,1.6-.1,2.6,0,1-.2,2-.3,3.1,0,.7-.2,1.4-.3,2.1.1-.7.2-1.4.3-2.1Z"/>
                  <g>
                    <path class="cls-43" d="M313,431s-9,4-28.2-2-1.4-1.6-1.6-5.5c12.2,7,10.8-6.5,11.3-5.6-2.2-4,18.5,13,18.5,13Z"/>
                    <path class="cls-27" d="M334,398c-11.5,13.9-24.6,15.8-37.2,15.8-.5,0-1.2.4-3.4.3,0,0,0,0,0,0-3.8-.3-10.6-.2-14.4-1,.3,3.8,2,12,5,16,10,2,14.2,6,12.4-8,3.6,3.5,9.4,8,12.6,11,8-1.4,15.6-4.6,23.3-9.1.2-2.9,2.1-13.7,2.6-19.4,0-3.8-1-5.2-1-5.5Z"/>
                  </g>
                </g>
              </g>
            </g>
          </svg>
            `;
            
            // Get the div element by its ID
            const characterDiv = document.getElementById('character');
            
            // Set the innerHTML of the div to the SVG content
            characterDiv.innerHTML = svgContent;

            // Log to console for verification
            console.log('SVG content has been set.');
        }

        // Call the function to change the content
        changeToSVG();
        
        
        let questionTimeRemaining = time_per_question * 10; // Convert to tenths of a second
        let answerTimeRemaining = time_per_answer * 10; // Convert to tenths of a second
        
        showQuestion(globalData[i].text);

        while (questionTimeRemaining > 0) {
            if (!pauseFlag) {
                await delay(100);
                continue;
            }
            await delay(100); // Update ten times a second
            questionTimeRemaining--;
            let question_seconds = Math.floor(questionTimeRemaining / 10);
            let question_tenths = questionTimeRemaining % 10;
            document.getElementById("demo").innerHTML = 'Q' + (i + 1) + ' - ' + globalData[i].category_name.toUpperCase() + ' - ' + globalData[i].difficulty_name.toUpperCase() + ' - Mark Mazurek - ' + question_seconds + '.' + question_tenths + 's';
            console.log(question_seconds,question_tenths);
        }
        showQuestion(""); // Clear question display
        showAnswer(globalData[i].answer);

        while (answerTimeRemaining > 0) {
            if (!pauseFlag) {
                await delay(100);
                continue;
            }
            await delay(100); // Update ten times a second
            answerTimeRemaining--;
            let answer_seconds = Math.floor(answerTimeRemaining / 10);
            let answer_tenths = answerTimeRemaining % 10;
            document.getElementById("demo").innerHTML = 'Q' + (i + 1) + ' - ' + globalData[i].category_name.toUpperCase() + ' - ' + globalData[i].difficulty_name.toUpperCase() + ' - Mark Mazurek - ' + answer_seconds + '.' + answer_tenths + 's';
            console.log(answer_seconds, answer_tenths);
        }
        showAnswer(""); // Clear answer display
    }
    game_started = false;
    pauseFlag = false;
    showQuestion("Thanks for playing!");
    progressBar.style.animationPlayState = "paused";
    // isPaused = true;
    document.getElementById('start-pause').textContent = 'START GAME';
    document.getElementById("demo").innerHTML = 'Press START GAME to play again. Brought to you by MARKADE GAMES and CREATIVENDEAVORS Copyright &copy; 2024. Contact us at mark.mazurek@triviolivia.com';
};



// Function to pause the game
function pauseGame() {
    pauseFlag = true;
}

// Function to resume the game
function resumeGame() {
    pauseFlag = false;
    mainGameFunction(); // Resume execution
}

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
            disable_category(String(i+1));
            document.getElementById("demo").innerHTML = 'You must select at least one category before starting the game.';
        }
        all_none_categories = false;
    } else {
        category_list = [];
        for (var i = 0; i < categoryButtons.length; i++) {
            categoryButtons[String(i)].classList.remove('inactive');
            categoryButtons[String(i)].classList.add('active');
            enable_category(String(i+1));
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
            disable_difficulty(String(i + 1));
            document.getElementById("demo").innerHTML = 'You must select at least one difficulty before starting the game.';
        }
        all_none_difficulties = false;
    } else {
        difficulty_list = [];
        for (var i = 0; i < difficultyButtons.length; i++) {
            difficultyButtons[String(i)].classList.remove('inactive');
            difficultyButtons[String(i)].classList.add('active');
            enable_difficulty(String(i + 1));
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
            disable_era(String(i + 1));
        }
        all_none_eras = false;
    } else {
        category_list = [];
        for (var i = 0; i < eraButtons.length; i++) {
            eraButtons[String(i)].classList.remove('inactive');
            eraButtons[String(i)].classList.add('active');
            enable_era(String(i + 1));
        }
        all_none_eras = true;
        document.getElementById("demo").innerHTML = 'You have enabled all eras.';
    }
}

// Slider functions
const questionSlider = document.getElementById('questionSlider');
const perQuestionSlider = document.getElementById('perQuestionSlider');
const perAnswerSlider = document.getElementById('perAnswerSlider');

questionSlider.addEventListener('input', function () {
    updateLabel('questionLabel', this.value, ' QUESTIONS');
    change_number_of_questions(this.value);
});

perQuestionSlider.addEventListener('input', function () {
    updateLabel('perQuestionLabel', this.value, 's / QUESTION');
    change_time_per_question(this.value);
});

perAnswerSlider.addEventListener('input', function () {
    updateLabel('perAnswerLabel', this.value, 's / ANSWER');
    change_time_per_answer(this.value);
});

function updateLabel(labelId, value, unit) {
    document.getElementById(labelId).textContent = value + unit;
}

//Function to change START GAME text
function changeButtonText() {
    var button = document.getElementById('start-pause');
    if (pauseFlag === false) {
        button.textContent = 'PAUSE GAME';
        progressBar.style.animationPlayState = "running";
        pauseFlag = true;
    } else if (pauseFlag === true && game_started === true) {
        button.textContent = 'RESUME GAME';
        progressBar.style.animationPlayState = "paused";
        pauseFlag = false;
        console.log('Game paused.');
        document.getElementById("demo").innerHTML = 'Game paused. Press RESUME GAME to continue.';
    } else {
        button.textContent = 'START GAME';
        pauseFlag = false;
    }
}


//Dynamic question and answer timer bar attempt
let progressBar = document.getElementById("progress");
let startButton = document.getElementById("startButton");
let pauseButton = document.getElementById("pauseButton");
let isPaused = true;

startButton.addEventListener("click", function() {
    if (isPaused) {
    //   progressBar.style.animationPlayState = "paused";
      progressBar.style.animation = "depleteProgress " + time_per_question + "s linear infinite";
      isPaused = false;
    } else {
    //   progressBar.style.animationPlayState = "running";
      progressBar.style.animation = "none";
      progressBar.offsetHeight; // Trigger reflow to reset animation
      progressBar.style.animation = "depleteProgress " + time_per_answer + "s linear infinite";
    }
});

  pauseButton.addEventListener("click", function() {
    if (!isPaused) {
      progressBar.style.animationPlayState = "running";
      isPaused = false;
    } else {
      progressBar.style.animationPlayState = "paused";
      isPaused = true;
    }
  });

  progressBar.addEventListener("animationiteration", function() {
    if (!isPaused) {
        progressBar.style.animation = "replenishProgress " + time_per_answer + "s linear forwards, shrinkProgress " + time_per_question + "s linear forwards";
    }
  });



  const progressElement = document.getElementById('progress');
  

  
  