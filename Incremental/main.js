var money = 10;
var generators = [];
var lastUpdate = Date.now();

//Creating the individual generators
for(let i = 0; i < 10; i++){
    let generator = {
        cost: Math.pow(Math.pow(10, i), i) * 10,
        bought: 0,
        amount: 0,
        multiplier: 1

    }
    generators.push(generator);
}
//Convenience function for formatting
function format(amount){
    let power = Math.floor(Math.log10(amount));
    let mantissa = amount / Math.pow(10,power);
    if(power < 3){return amount.toFixed(2)};
    return mantissa.toFixed(2) + "e" + power;
}
//Function to buy generators
function buyGenerator(i){
    let g = generators[i - 1];
    if(g.cost > money){
        return;
    } else{
        money -= g.cost;
        g.amount++;
        g.bought++;
        g.multiplier*=1.05;
        g.cost *= 1.5;
    }
}
//Function to update GUI
function updateGUI(){
    document.getElementById("currency").textContent = "You have $" + format(money);
    for(let i = 0; i < 10; i++){
        let g = generators[i];
        document.getElementById("gen" + (i+1)).innerHTML = "Amount: " + format(g.amount) + "<br>Bought: " + g.bought + "<br>Multiplier: " + format(g.multiplier) + "x<br>Cost: " + format(g.cost);
        if(g.cost > money){
            document.getElementById("gen" + (i + 1)).classList.add("locked"); //Locks generators if money is insufficient
        } else{
            document.getElementById("gen" + (i + 1)).classList.remove("locked"); // Removes locked status if money is sufficient
        }
    }
}
//Incremental feedback loop
function productionLoop(diff){
    money += generators[0].amount * generators[0].multiplier * diff;
    for(let i = 1; i < 10; i++){
        generators[i-1].amount += generators[i].amount * generators[i].multiplier * diff / 5;
    }
}
//Main loop, diff is time difference between last update and current tiem
function mainLoop(){
    var diff = (Date.now() - lastUpdate) / 1000;
    productionLoop(diff);
    updateGUI();

    lastUpdate = Date.now();
}
setInterval(mainLoop, 50) // Runs it every 50ms
updateGUI();
