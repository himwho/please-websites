// STOP CHEATING!

var myQuestions = [
    {
        question: "Phil? Peter?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'a'
    },
    {
        question: "Peter? Phil?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'a'
    },
    {
        question: "Phil?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'a'
    },
    {
        question: "Peter?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'a'
    },
    {
        question: "Pededphilip?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'a'
    },
    {
        question: "Phipepe?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'b'
    },
    {
        question: "Pe Phi?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'b'
    },
    {
        question: "phipdeter?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'b'
    },
    {
        question: "Pediphil?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'b'
    },
    {
        question: "philipeder?",
        answers: {
            a: '1',
            b: '2'
        },
        correctAnswer: 'b'
    }
];

var songContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

generatePhilorPeter(myQuestions, songContainer, resultsContainer, submitButton);

function generatePhilorPeter(questions, songContainer, resultsContainer, submitButton){

    function showPs(questions, songContainer){
        // store output and answers
        var output = [];
        var answers;

        // for each song...
        for(var i=0; i<questions.length; i++){

            // first reset the list of answers
            answers = [];

            // for each available answer...
            for(letter in questions[i].answers){

                // ...add an html radio button and audio elements
                answers.push(
                    '<label class="rad">'
                        + '<input type="radio" name="question'+i+'" value="'+letter+'">'
                        + '<img src="res/img/'+letter+i+'.png" height="58" width="42">'
                        + letter + ': '
                        + questions[i].answers[letter]
                    + '</label>'
                );
            }

            // add this song and its answers to the output
            output.push(
                '<div class="question">' 
                + questions[i].question 
                + '<br>'
                + '<audio controls>'
                + '<source src="res/aud/'+i+'.mp3" type="audio/mpeg">'
                + '</div>'
                + '<div class="answers">' + answers.join('') + '</div>'
            );
        }

        // finally combine our output list into one string of html and put it on the page, badoom
        songContainer.innerHTML = output.join('');
    }


    function showResults(questions, songContainer, resultsContainer){
        
        // gather answer containers from our quiz
        var answerContainers = songContainer.querySelectorAll('.answers');
        
        // keep track of user's answers
        var userAnswer = '';
        var numCorrect = 0;
        
        // for each question...
        for(var i=0; i<questions.length; i++){

            // find selected answer
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
            
            // if answer is correct
            if(userAnswer===questions[i].correctAnswer){
                // add to the number of correct answers
                numCorrect++;
                
                // color the answers green
                answerContainers[i].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else{
                // color the answers red
                answerContainers[i].style.color = 'red';
            }
        }

        // show number of correct answers out of total
        resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    }

    // show questions right away
    showPs(questions, songContainer);
    
    // on submit, show results
    submitButton.onclick = function(){
        showResults(questions, songContainer, resultsContainer);
    }

}