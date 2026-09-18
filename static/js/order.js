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
    calculateTotal();
}


// Calculate total price
function calculateTotal() {
    const foods = document.querySelectorAll(".food");
    const quantities = document.querySelectorAll(".quantity");
    let total = 0;

    for (let i = 0; i < foods.length; i++) {
        const selectedOption = foods[i].selectedOptions[0];
        const rawPrice = selectedOption ? selectedOption.getAttribute("data-price") : null;
        const price = Number(rawPrice) || 0;
        const quantity = Number(quantities[i]?.value || 0);
        total += price * quantity;
    }

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.textContent = total;
    }
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

    window.location.href = `/order/confirmation/${result.order_id}`;
});
