// HTML elements
const addBtn = document.getElementById("add-item");
const itemSelect = document.getElementById("item");
const qtyInput = document.getElementById("qty");
const invoiceBody = document.getElementById("invoice-body");
const cashInput = document.getElementById("cash");
const balanceDisplay = document.getElementById("balance-display");
const resetBtn = document.getElementById("reset-invoice");

// Add to Invoice
addBtn.addEventListener("click", () => {
  const selectedOption = itemSelect.options[itemSelect.selectedIndex];
  const selectedItem = selectedOption.value;
  const quantity = parseInt(qtyInput.value);

  if (!selectedItem || quantity < 1) return;

  const price = parseFloat(selectedOption.dataset.price);
  const subtotal = (price * quantity).toFixed(2);

  const row = `
    <tr>
      <td>${selectedItem}</td>
      <td>${quantity}</td>
      <td>Rs.${price.toFixed(2)}</td>
      <td>Rs.${subtotal}</td>
      <td class="no-print"><button class="remove-btn">🗑️ Remove</button></td>
    </tr>
  `;

  invoiceBody.insertAdjacentHTML("beforeend", row);
  qtyInput.value = "1";

  addRemoveEvents(); // enable remove buttons
  updateTotal();
});

// Update subtotal, discount, and total
function updateTotal() {
  let subtotal = 0;

  document.querySelectorAll("#invoice-body tr").forEach((row) => {
    const cell = row.querySelectorAll("td")[3]; // Subtotal column
    const value = cell.textContent.trim().replace("Rs.", "");
    const amount = parseFloat(value);

    if (!isNaN(amount)) {
      subtotal += amount;
    }
  });

  const discount = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal - discount).toFixed(2));

  document.querySelector(".totals").innerHTML = `
    <p>Discount (10%): Rs.${discount.toFixed(2)}</p>
    <p><strong>Total: Rs.${total.toFixed(2)}</strong></p>
  `;

  calculateBalance();
}

// Recalculate balance
function calculateBalance() {
  const cashValue = cashInput.value.trim();
  const cash = parseFloat(cashValue);

  const totalText = document.querySelector(".totals strong").textContent.trim();
  const total = parseFloat(totalText.replace("Total: Rs.", "").trim());

  if (!isNaN(cash) && !isNaN(total)) {
    const balance = (cash - total).toFixed(2);
    balanceDisplay.innerHTML = `<p><strong>Balance to Return: Rs.${balance}</strong></p>`;
  } else {
    balanceDisplay.innerHTML = `<p><strong>Balance to Return: Rs.0.00</strong></p>`;
  }
}

// Listen for cash typing
cashInput.addEventListener("input", () => {
  calculateBalance();
});

// Add remove functionality to all "Remove" buttons
function addRemoveEvents() {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.onclick = function () {
      this.closest("tr").remove();
      updateTotal(); // Recalculate totals after removing
    };
  });
}

// Reset / New Invoice functionality
resetBtn.addEventListener("click", () => {
  invoiceBody.innerHTML = "";
  document.querySelector(".totals").innerHTML = `
    <p>Discount (10%): Rs.0.00</p>
    <p><strong>Total: Rs.0.00</strong></p>
  `;
  cashInput.value = "";
  balanceDisplay.innerHTML = `<p><strong>Balance to Return: Rs.0.00</strong></p>`;
});
