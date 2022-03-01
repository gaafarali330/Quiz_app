let playerName = document.querySelector('#playerName');
let person = window.prompt('Hi Player enter your name please')

playerName.textContent = person;

//
let questions_count = document.querySelector('.questions-count span');
let spans_questions = document.querySelector('.spans-questions');
let questions_wrapper = document.querySelector('.questions-wrapper');
let answers_wrapper = document.querySelector('.answers-wrapper');
let bullets = document.querySelector('.bullets');
let submit_btn = document.querySelector('.submit-btn');
let true_questions = document.querySelector('.result span.true-questions');
let total_questions = document.querySelector('.result span.total-questions');
let reactions = document.querySelector('.reactions');
let count_interval;
let timer = document.querySelector('.timer');



// the first question index variable
let q_index = 0;
let user_answers_true = 0;
let count_down_time = 40;


// first of all we define a function to get questions fromJSON Object
function getQuestions() {
    // first I will create  XMLHttpRequest  to request data from webserver
    let my_request = new XMLHttpRequest();
    // check the request
    // Defines a function to be called when the readyState property changes
    // readyState Holds the status of the XMLHttpRequest.
    // 0: request not initialized
    // 1: server connection established
    // 2: request received
    // 3: processing request
    // 4: request finished and response is ready
    my_request.onreadystatechange = function() {
            //status :Returns the status-number of a request
            // 200: "OK"
            // 403: "Forbidden"
            // 404: "Not Found"
            if (this.readyState === 4 && this.status === 200) {
                // of course we need to convert the jaon to js aobject
                let questions = JSON.parse(this.responseText);
                // now we have a JS object and we can use it 
                // get question count
                let questions_count = questions.length;
                create_bullets(questions_count);

                // the main function in our app is that the function which add data 
                // to the html page
                // first we will add the first question and its answers to the page
                add_data(questions[q_index], questions_count);
                count_down(count_down_time, questions_count);
                total_questions.innerHTML = questions_count;
                // we will check if the answer is true when we click the submit_btn
                submit_btn.onclick = () => {
                    // first we retrive the correct answer of the current question
                    let correct_answer = questions[q_index].right_answer;
                    // call check answer
                    check_answer(correct_answer, questions_count);
                    q_index++;
                    // when we click we also need to go to the next questions
                    // and reomve all related date of the previous questions from HTML
                    questions_wrapper.innerHTML = '';
                    answers_wrapper.innerHTML = '';

                    add_data(questions[q_index], questions_count);
                    // add active class to current bullet
                    update_bullet_state();

                    // here we need to clear interval to avoid any problems in time
                    // because the count down timer will start a new timer
                    clearInterval(count_interval);
                    count_down(count_down_time, questions_count);

                    // show quiz result
                    get_final_result(questions_count);
                };
            }
        }
        // now I need to send the request to the web server 
        // so I use 'open()' function and 'send()' function
        // 'open()' PARAMS : 1- method 2-server or file 3- asynch
    my_request.open("GET", "questions.json", true);
    my_request.send();

}


getQuestions();

// here we will define a function That creates the bullets
function create_bullets(num) {
    // we will use this function after getting the questions from request
    questions_count.innerText = num;
    // create spans 'bullets'
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement('span');
        spans_questions.appendChild(bullet);
        // we will start form the questions number 0 so 
        // we check that
        i === 0 ? bullet.classList.add('active') : console.log();
    }
}

// the main function in our app is that the function which add data 
// to the html page
// so we will define it here
function add_data(one_question_obj, count) {
    if (q_index < count) {
        // the data is consits of questions and four answers
        // first we will create the title
        let q_title = document.createElement('h2');
        q_title.classList.add('question-title');
        q_title.appendChild(document.createTextNode(one_question_obj.title));
        questions_wrapper.appendChild(q_title);
        // now we will create the answers
        for (let itr = 1; itr <= 4; itr++) {
            // we need a div to put the answer inside it
            let answer_div = document.createElement('div');
            answer_div.className = 'answer';
            let radio = document.createElement('input');
            // we can do this
            // radio.setAttribute('type', 'radio');
            // radio.setAttribute('name', 'questions');
            // radio.setAttribute('id', `ans${itr}`);
            // or we can write
            radio.name = 'questions';
            radio.type = 'radio';
            radio.id = `answer_${itr}`;
            radio.dataset.answer = one_question_obj[`answer_${itr}`];
            itr === 1 ? radio.checked = true : '';
            answer_div.appendChild(radio);
            let label = document.createElement('label');
            label.htmlFor = `answer_${itr}`;
            label.appendChild(document.createTextNode(one_question_obj[`answer_${itr}`]));
            answer_div.appendChild(label)
            answers_wrapper.appendChild(answer_div);
        }
    }
}

function check_answer(correct, count) {
    let all_answers = document.getElementsByName('questions');
    let selected_answer;
    for (let i = 0; i < all_answers.length; i++) {
        if (all_answers[i].checked) {
            selected_answer = all_answers[i].dataset.answer;
        }
    }
    if (selected_answer == correct) {
        user_answers_true++;
    }
}


function update_bullet_state() {
    let spans = document.querySelectorAll('.spans-questions span');
    // convert to array
    let arr_spans = Array.from(spans);
    arr_spans.forEach((span, index) => {
        if (q_index === index) {
            span.className = 'active'
        } else {
            span.classList.remove('active')
        }

    });

}


function get_final_result(questions_count) {
    if (q_index === questions_count) {
        questions_wrapper.innerText = 'Questions Are finished';
        answers_wrapper.remove();
        submit_btn.remove();
        bullets.remove();
        questions_wrapper.style.padding = '20px 10px';
        questions_wrapper.style.fontSize = '28px';
        questions_wrapper.style.color = '#538ad6';
        questions_wrapper.style.textAlign = 'center';
        true_questions.innerHTML = user_answers_true;
        if (user_answers_true == questions_count) {
            reactions.classList.add('wow');
            reactions.innerText = 'Wow, All answers id True'
        } else if (user_answers_true >= 6 && user_answers_true < questions_count) {
            reactions.classList.add('awesome');
            reactions.innerText = 'awesome'
        } else if (user_answers_true < 6 && user_answers_true > 3) {
            reactions.classList.add('good');
            reactions.innerText = 'good'
        } else {
            reactions.classList.add('bad');
            reactions.innerText = ' bad'
        }
    }



}

function count_down(duration, count) {
    if (q_index < count) {
        let mins, secs;
        count_interval = setInterval(function() {
            mins = parseInt(duration / 60);
            secs = parseInt(duration % 60);
            mins = mins < 10 ? `0${mins}` : mins;
            secs = secs < 10 ? `0${secs}` : secs;
            timer.innerHTML = `${mins}:${secs}`;
            if (--duration < 0) {
                clearInterval(count_interval);
                submit_btn.click();

            };
        }, 1000);
    }

}