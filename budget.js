//get elements for each of the totals
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");

//get the different tabs in the dashboard
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");

//get the list element for each tab
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

//get the btns 
const expenseBtn = document.querySelector(".tab1")
const incomeBtn = document.querySelector(".tab2")
const allBtn = document.querySelector(".tab3")

//get the tab selection elements
const addExpense = document.querySelector(".add-expense")
const expenseTitle = document.querySelector("#expense-title-input")
const expenseAmount = document.querySelector("#expense-amount-input")

//get the add button for each tab
const addIncome = document.querySelector(".add-income")
const incomeTitle = document.querySelector("#income-title-input")
const incomeAmount = document.querySelector("#income-amount-input")

//variables
let ENTRY_LIST = [];
let balance = 0, outcome = 0, income = 0;

//checks to see if any data is stored in the local storage
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

const DELETE = "delete", EDIT = "edit"

//add an eventlistener that hihglights the selected tab and 
//shows all its elements and hides the others
expenseBtn.addEventListener("click", ()=>{
    show(expenseEl)
    hide( [incomeEl, allEl] )
    active(expenseBtn)
    inactive( [incomeBtn, allBtn])  
})

incomeBtn.addEventListener("click", ()=>{
    show(incomeEl);
    hide( [expenseEl, allEl] ); 
    active(incomeBtn)
    inactive( [expenseBtn, allBtn])  
})

allBtn.addEventListener("click", ()=>{
    show(allEl);
    hide( [incomeEl, expenseEl] ); 
    active(allBtn)
    inactive( [incomeBtn, expenseBtn])  
})

addExpense.addEventListener("click" ,()=>{
    if(!expenseTitle.value || !expenseAmount.value) return;
        let expense ={
            type: "expense",
            title: expenseTitle.value,
            amount: parseFloat(expenseAmount.value)
        }
        ENTRY_LIST.push(expense)
        updateUI();
        clearInput([expenseTitle, expenseAmount])
})

addIncome.addEventListener("click" ,()=>{
    if(!incomeTitle.value || !incomeAmount.value) return;
        let income ={
            type: "income",
            title: incomeTitle.value,
            amount: parseFloat(incomeAmount.value)
        }
        ENTRY_LIST.push(income)
        updateUI();
        clearInput([incomeTitle, incomeAmount])
})


//unhide element
function show(element){
    element.classList.remove('hide') 
}

//hide element
function hide(element){
    element.forEach( element => {
        element.classList.add("hide")
    })
}

//set active
function active(element){
    element.classList.add('active') 
}

//set inactive
function inactive(element){
    element.forEach( element => {
        element.classList.remove("active")
    })
}

//clears input
function clearInput(inputs){
    inputs.forEach( input => {
        input.value = ''
    })
}

incomeList.addEventListener("click", deleteOrEdit)
expenseList.addEventListener("click", deleteOrEdit)
allList.addEventListener("click", deleteOrEdit)

//accesses whether to delete an element or to edit it
function deleteOrEdit(event){
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;

    if(targetBtn.id === DELETE){
        deleteEntry(entry)
    }
    else if(targetBtn.id === EDIT){
        editEntry(entry)
    }
}


//delete an entry
function deleteEntry(entry){
    ENTRY_LIST.splice(entry.id, 1);
    updateUI()
}

//edit an entry
function editEntry(entry){
     let ENTRY  = ENTRY_LIST[entry.id];

    if(ENTRY.type == 'income'){
        incomeAmount.value = ENTRY.amount
        incomeTitle.value = ENTRY.title
    }
    else if(ENTRY.type === "expense"){
        expenseAmount.value = ENTRY.amount
        expenseTitle.value = ENTRY.title
    }

    deleteEntry(entry)
}

function updateUI(){
 
    clearElement( [expenseList, incomeList, allList] )
   
    ENTRY_LIST.forEach((entry,index) => {
        if(entry.type == "expense"){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }
        else if(entry.type == "income"){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    })
    
    income = calculateTotal("income", ENTRY_LIST)
    outcome = calculateTotal("expense", ENTRY_LIST)
    balance =  Math.abs(calculateBalance(income, outcome))
    
    let sign = (income >= outcome)? '$' : '-$';
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`
    incomeTotalEl.innerHTML = `<small>$</small>${income}`
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST))
}

//creates an entry for a tab
function showEntry(list, type, title, amount, id){
    const entry =   `<li id = "${id}" class="${type}">
                        <div class="entry"> ${title}: $${amount}</div>
                        <div id="edit"><i class="uil uil-edit"></i></div>
                        <div id="delete"><i class="uil uil-trash-alt"></i></div>
                    </li>`;

    list.insertAdjacentHTML("afterbegin", entry);
}

//clears an element
function clearElement(elements){
    elements.forEach( element =>{
        element.innerHTML = '';
    })
}


//calculates the total 
function calculateTotal(type, list){
    let sum = 0;
    list.forEach(entry =>{
        if(entry.type == type){
            sum += entry.amount
        }
    })
    return sum
}

//calculates the balance
function calculateBalance(income, outcome){
    return income - outcome;
}











