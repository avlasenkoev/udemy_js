/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).

8. After you display the result, display the next random question, so that the game never ends (Hint: write a function for this and call it right after displaying the result)

9. Be careful: after Task 8, the game literally never ends. So include the option to quit the game if the user writes 'exit' instead of the answer. In this case, DON'T call the function from task 8.

10. Track the user's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'm going to use the power of closures for this, but you don't have to, just do this with the tools you feel more comfortable at this point).

11. Display the score in the console. Use yet another method for this

*/

var Question = function(question, answers, correctAnswer) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
    this.numberOfCorrectAnswer  = function() {
        if (this.answers[0] ===  this.correctAnswer) {
            return 0;
        } else {
            return 1;
        }
    }
    this.checkAnswer = function(numberOfAnswer) {
        if (numberOfAnswer == this.numberOfCorrectAnswer()) {
            console.log('true')
            return 1;
        } else {
            console.log('false')
            return 0;
        }
    }
    this.askQuestion = function() {
        console.log(this.question);
        console.log('0. ' + this.answers[0]);
        console.log('1. ' + this.answers[1]);
    }
}


function game() {
    var score = 0;
    var questionOne = new Question('Do you want a coffee?', ['Yes', 'No'], 'Yes');
    var questionTwo = new Question('What do you do at home?', ['Study', 'Nothing'], 'Study');
    var questionThree = new Question('Do you by a train tickets?', ['Not yet', 'Done'], 'Done');
    var questions = [questionOne, questionTwo, questionThree];
    while (true) {
        var i = Math.floor(Math.random() * (questions.length));
        questions[i].askQuestion();
        var answer = prompt('Please write the correct answer. Or type exit to quit');
        if (answer === 'exit') {
            console.clear();
            break;
        }
        score += questions[i].checkAnswer(answer);
        console.log('Your score is ' + score + '\n--------------');
    }

}


game()
