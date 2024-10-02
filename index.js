import store from "./store.js";

const creditsInput = document.querySelector("#credits");
const quotaInput = document.querySelector("#quota");
const storeTable = document.querySelector("#store");
const cartTable = document.querySelector("#cart");
const totalElement = document.querySelector("#total");
const sellAmountElement = document.querySelector("#sellAmount");
const overtimeElement = document.querySelector("#overtime");

function calculateSellAmount(current, desired, quota) {
    desired -= current
 
    let overtimeNeeded = Math.max(0, desired - quota - 75);
    let creditsForOvertime = overtimeNeeded / 1.2;

    return Math.ceil(desired - overtimeNeeded + creditsForOvertime);
}

function calculateTotal() {
    let total = 0;

    for (let item of store) {
        let discountedPrice = Math.floor(item.price * (100 - item.discount) / 100);
        total += item.amount * discountedPrice;
    }

    return total;
}

function calculateOvertime(sold, quota) {
    return Math.max(0, Math.floor((sold - quota) / 5) - 15);
}

function updateResults() {
    let total = calculateTotal();
    let sellAmount = Math.max(quotaInput.value, calculateSellAmount(creditsInput.value, total, quotaInput.value));

    totalElement.textContent = total;
    sellAmountElement.textContent = sellAmount;
    overtimeElement.textContent = calculateOvertime(sellAmount, quotaInput.value); 
}

function updateItem(item) {
    let discountedPrice = Math.floor(item.price * (100 - item.discount) / 100);

    item.storeRow.querySelector(".name").innerHTML = item.name;
    item.storeRow.querySelector(".price").innerHTML = discountedPrice;

    if (item.amount > 0) {
        item.cartRow.classList.remove("hidden");

        item.cartRow.querySelector(".name").innerHTML = item.name;
        item.cartRow.querySelector(".price").innerHTML = discountedPrice;
        item.cartRow.querySelector(".amount").innerHTML = item.amount;
        item.cartRow.querySelector(".total").innerHTML = item.amount * discountedPrice;
    } else {
        item.cartRow.classList.add("hidden");
    }

    if (calculateTotal() > 0) {
        cartTable.classList.remove("hidden");
    } else {
        cartTable.classList.add("hidden");
    }

    updateResults();
}

function createRows() {
    for (let item of store) {
        let storeRow = document.createElement("tr");
        storeTable.querySelector("tbody").appendChild(storeRow);

        let cartRow = document.createElement("tr");
        cartTable.querySelector("tbody").appendChild(cartRow);

        storeRow.innerHTML = `
        <td class="name"></td>
        <td>
            <select class="discounts">
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="60">60%</option>
                <option value="70">70%</option>
                <option value="80">80%</option>
            </select>
        </td>
        <td class="price"></td>
        <td class="actions">
            <button class="add">Add</button>
        </td>
        `;

        cartRow.innerHTML = `
        <td class="name"></td>
        <td class="price"></td>
        <td class="amount"></td>
        <td class="total"></td>
        <td class="actions">
            <button class="remove">Remove</button>
        </td>
        `;

        item.storeRow = storeRow;
        item.cartRow = cartRow;

        item.amount = 0;
        item.discount = 0;

        if (!item.discountable) {
            item.storeRow.querySelector(".discounts").classList.add("hidden");
        }

        item.storeRow.querySelector(".discounts")
        .addEventListener("input", event => {
            item.discount = parseInt(event.target.value);
            updateItem(item);
        });

        item.storeRow.querySelector(".add")
        .addEventListener("click", event => {
            item.amount++;
            updateItem(item);
        });

        item.cartRow.querySelector(".remove")
        .addEventListener("click", event => {
            item.amount--;
            updateItem(item);
        });

        updateItem(item);
    }
}

addEventListener("load", createRows);
creditsInput.addEventListener("input", updateResults);
quotaInput.addEventListener("input", updateResults);