// Add another food item
function addFoodItem() {
    const container = document.getElementById("extraItems");
    const item = document.createElement("div");

    item.className = "food-item";
    item.innerHTML = `
        <select class="food" onchange="calculateTotal()">
            ${document.querySelector(".food").innerHTML}
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


// Calculate total price
function calculateTotal() {
    const foods = document.querySelectorAll(".food");
    const quantities = document.querySelectorAll(".quantity");
    let total = 0;

    for (let i = 0; i < foods.length; i++) {
        const price = Number(foods[i].selectedOptions[0]?.dataset.price || 0);
        const quantity = Number(quantities[i].value);
        total += price * quantity;
    }

    document.getElementById("total").textContent = total;
}


document.getElementById("orderForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const foods = document.querySelectorAll(".food");
    const quantities = document.querySelectorAll(".quantity");
    const items = Array.from(foods)
        .map((food, index) => ({
            id: food.value,
            quantity: Number(quantities[index].value)
        }))
        .filter(item => item.id && item.quantity > 0);

    const response = await fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            service: document.getElementById("service").value,
            address: document.getElementById("address").value,
            instructions: document.getElementById("instructions").value,
            items: items
        })
    });

    const result = await response.json();
    if (!response.ok) {
        alert(result.error || "Unable to place the order.");
        return;
    }

    alert(result.message + "\nOrder number: " + result.order_id);
    event.target.reset();
    document.getElementById("total").textContent = "0";
});
