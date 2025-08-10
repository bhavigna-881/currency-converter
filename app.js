const BASE_URL="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
const dropdowns =document.querySelectorAll(".dropdown select");
const btn =document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr =document.querySelector(".to select");
let msg =document.querySelector(".msg");


for(let select of dropdowns){
    for(currCode in countryList){
        let newOpt=document.createElement("option");
        newOpt.innerText =currCode;
        newOpt.value =currCode;
        if(select.name==="from" && currCode==="USD"){
            newOpt.selected="selected";
        }
        else if(select.name==="to" && currCode==="INR"){
            newOpt.selected="selected";
        }
        select.append(newOpt);
    }
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target);
    });
}
const updateFlag=(element)=>{
    let currCode = element.value;
    let countryCode=countryList[currCode];
    newSrc=`https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img =element.parentElement.querySelector("img");
    img.src =newSrc;
}
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    const data = await response.json();
    const rates = data.eur;

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();

    if (!(from in rates) || !(to in rates)) {
      msg.innerText = "Currency not supported";
      return;
    }

    const conversionRate = rates[to] / rates[from];
    const convertedAmount = (amtVal * conversionRate).toFixed(4);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Failed to fetch conversion rate.";
  }
});