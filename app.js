const currencyHolder=document.getElementById("currency");
const balanceHolder=document.getElementById("balance");
const tnxNameHolder=document.getElementById("name");
const txnAmountHolder=document.getElementById("amount");
const income=document.getElementById("income");
const expense=document.getElementById("expense");
const saveButton=document.getElementById("save");
const displayList=document.getElementById("list_of_transactions");
const cancelButton=document.getElementById("cancel");

let symbol="$";
let listOfTransactions=[];
let currentBalance=0;
let editIndex=-1;


function edit(i){
   cancelButton.style.display="block";
   editIndex=i;
   tnxNameHolder.value=listOfTransactions[i].name;
   tnxAmountHolder.value=listOfTransactions[i].amount;
   if(listOfTransactions[i].type==income){
    income.checked=true;
   }
   else{
    expense.checked=true;
   }
//    When we are clicking edit the button Cancel Transaction should appear
//    cancelButton.style.display=block;
}


function del(i){
   listOfTransactions=listOfTransactions.filter((e,index)=>i!=index);
   render();//Always after delete we have to render to show the updates 
}



function saveData(){
    //local storage saves only the string
    localStorage.setItem("symbol",symbol);
    localStorage.setItem("balance",currentBalance);
    localStorage.setItem("lists",JSON.stringify(listOfTransactions));
}



//after saving the data we have to load the data as well
function loadData(){
    symbol=localStorage.getItem("symbol");
    listOfTransactions=JSON.parse(localStorage.getItem("lists"));
    currentBalance=Number(localStorage.getItem("balance"));
}


function render(){
    currentBalance=listOfTransactions.reduce((total,value)=>{return value.type=="expense" ? total-value.amount : total+value.amount},0)
    //updating transaction
    displayList.innerHTML="";
    if(listOfTransactions.length==0){
        displayList.innerHTML+="No Transaction found"
    }
    else{
        listOfTransactions.forEach((e,i)=>{
            displayList.innerHTML+=`
            <li class="transaction ${e.type}">
            <p>${e.name}</p>
            <div class="right_side">
                <p>${symbol}${e.amount}</p>
                <button onclick=edit(${i})><i class="fas fa-edit"></i></button>
                <button onclick=del(${i})><i class="fa fa-trash" aria-hidden="true"></i></button>
            </div>
        </li>
        `;
        })
    }
    currencyHolder.innerHTML=symbol;
    balanceHolder.innerHTML=currentBalance;
    //on each render we will save our data
    saveData();
}


cancelButton.addEventListener("click",()=>{
    editIndex=-1; 
    tnxNameHolder.value="";
    txnAmountHolder.value="";
    cancelButton.style.display="none";
})


saveButton.addEventListener("click",()=>{
    if(tnxNameHolder.value==""|| Number(txnAmountHolder.value)<=0){
        alert("Can't do that!,Kindly Enter details");
        return;
    }
    let transaction={
        name:tnxNameHolder.value,
        amount:Number(txnAmountHolder.value),
        type:income.checked?"income":"expense"
    };
    //while saving check for the edit index
    if(editIndex==-1)
    listOfTransactions.push(transaction);
    else
    listOfTransactions[editIndex]=transaction;
    // console.log(transaction);
    //We have to clear the values before rendering
    //reset the edit index
    editIndex=-1; 
    tnxNameHolder.value="";
    txnAmountHolder.value="";
    render();
    //After saving display will be none
    cancelButton.style.display="none";
})

//in render we are saving the data ,before saving we have to see if previous data is present or not
loadData();
render();