// BUDGET CONTROLLER
var budgetController = (function() {

    // constructors for our input data
    var Expense = function(id, description, value) {
       this.id = id,
       this.description = description,
       this.value = value
    };

    var Income = function(id, description, value) {
       this.id = id,
       this.description = description,
       this.value = value
    };

    //main data container
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
    }

    var calculateTotal = function(type) {
            var sum = 0;
            data.allItems[type].forEach(function(item) {
                sum += item.value;
            })
            data.totals[type] = sum;
        }

    return {
        // add new item to our data, public function
        addItem: function(type, des, val) {
            var newItem, ID;
            // create new id for new items
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // create a new element
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            };
            // add new element to our data
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.totals.inc - data.totals.exp;
            // calculate percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = 0;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
}) ();


// UI CONTROLLER
var UIController = (function() {
    // dom elements container
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value ',
        inputBtn: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budget: '.budget__value',
        resultExpenses: '.budget__expenses--value',
        resultIncomes: '.budget__income--value',
        percentage: '.budget__expenses--percentage'
    }

    return {
        // get input data from UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription)
                    .value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue)
                    .value),
            }
        },
        // access to dom elements in public
        getDOMStrings: function() {
            return DOMStrings;
        },
        addListItem: function(obj, type) {
            var html
            // create html string with text
            if (type === 'inc') {
                element = DOMStrings.incomesContainer;
                 html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>
                    <div class="right clearfix"><div class="item__value">+ %value%</div>
                    <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">
                    </i></button></div></div></div>`;
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>
                 <div class="right clearfix"><div class="item__value">- %value%</div>
                 <div class="item__percentage">21%</div><div class="item__delete">
                 <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                 </div></div></div>`
            }

            // replace the text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert it is to the DOM
            document.querySelector(element).insertAdjacentHTML(
                'beforeend', newHtml
            );
        },
        clearFields: function() {
            fields = document.querySelectorAll(DOMStrings.inputDescription +
                ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        set_start_parameters: function() {
            document.querySelector(DOMStrings.budget).innerHTML = 0;
            document.querySelector(DOMStrings.resultExpenses).innerHTML = '-' + 0;
            document.querySelector(DOMStrings.resultIncomes).innerHTML = '+' + 0;
            document.querySelector(DOMStrings.percentage).innerHTML = 0 + '%';
        },
        setBudget: function(budget) {
            // total
            if (budget.budget >= 0) {
                document.querySelector(DOMStrings.budget).innerHTML = '+' + budget.budget;
            } else {
                document.querySelector(DOMStrings.budget).innerHTML = budget.budget;
            };
            // income only
            document.querySelector(DOMStrings.resultIncomes).innerHTML = '+' + budget.totalInc;
            // expense only
            document.querySelector(DOMStrings.resultExpenses).innerHTML = '-' + budget.totalExp;
            // percentage
            document.querySelector(DOMStrings.percentage).innerHTML = budget.percentage + '%';
        }
    }

}) ();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    // our event listeners
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        // click on button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        // press 'enter'
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
     };

    var updateBudget = function() {
        //1. calculate budget
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();

        // 2. display budget on the UI
        UICtrl.setBudget(budget)
     };

    // add item to the controllers
    var ctrlAddItem = function() {
        var inp, newItem;

        // 1. get input date
        inp = UICtrl.getInput();

        if (inp.description !== '' && !isNaN(inp.value) &&
                inp.value > 0) {
            // 2. add item to the budget controller
            newItem = budgetCtrl.addItem(inp.type, inp.description, inp.value);
            console.log(newItem)
            // 3. add new item to UI
            UICtrl.addListItem(newItem, inp.type);

            // 4. clear fields
            UICtrl.clearFields();

            //5. calculate and update budget
            updateBudget();
        }
    };

    return {
        // main initialization function
        init: function() {
            console.log('start application');
            UICtrl.set_start_parameters();
            setupEventListeners();
        }
    };

}) (budgetController, UIController);

controller.init();