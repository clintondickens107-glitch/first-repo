// Calculate the total price of the order
function calculateTotal() {

    const foodItems = document.querySelectorAll(".food");
    const quantities = document.querySelectorAll(".quantity");

    let total = 0;

    for (let i = 0; i < foodItems.length; i++) {

        const price = Number(foodItems[i].value);
        const quantity = Number(quantities[i].value);

        total += price * quantity;
    }

    document.getElementById("total").textContent = total;
}


// Add another food item
function addFoodItem() {

    const container = document.getElementById("extraItems");

    const item = document.createElement("div");

    item.className = "food-item";

    item.innerHTML = `
        <select class="food" onchange="calculateTotal()">
            <option value="0">Select food</option>
            <option value="300">Chicken & Chips - KSh 300</option>
            <option value="250">Beef Burger - KSh 250</option>
            <option value="200">Chicken Burger - KSh 200</option>
            <option value="150">French Fries - KSh 150</option>
            <option value="350">Fried Chicken - KSh 350</option>
            <option value="200">Beef Samosa - KSh 200</option>
            <option value="250">Chicken Wings - KSh 250</option>
            <option value="100">Soda - KSh 100</option>
        </select>

        <input
            type="number"
            class="quantity"
            value="1"
            min="1"
            onchange="calculateTotal()"
        >
    `;

    container.appendChild(item);
}


// Handle order submission
document.getElementById("orderForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const total = document.getElementById("total").textContent;

    if (service === "") {
        alert("Please select Delivery or Pickup.");
        return;
    }

    if (total === "0") {
        alert("Please select at least one food item.");
        return;
    }

    alert(
        "Order received successfully!\n\n" +
        "Customer: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Order type: " + service + "\n" +
        "Total: KSh " + total
    );

});