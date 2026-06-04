let menu = JSON.parse(localStorage.getItem("menu")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

let bill = [];
let total = 0;

/* DATE */

document.getElementById("currentDate").innerText =
new Date().toLocaleString();

/* MENU */

function saveMenu() {
    localStorage.setItem(
        "menu",
        JSON.stringify(menu)
    );
}

function updateMenuDropdown() {

    const select =
    document.getElementById("menuSelect");

    select.innerHTML = "";

    menu.forEach((item,index)=>{

        const option =
        document.createElement("option");

        option.value = index;

        option.textContent =
        `${item.name} - ₹${item.price}`;

        select.appendChild(option);
    });
}

function addMenuItem() {

    const name =
    document.getElementById("itemName").value;

    const price =
    document.getElementById("itemPrice").value;

    if(!name || !price){
        alert("Enter Item Name & Price");
        return;
    }

    menu.push({
        name:name,
        price:Number(price)
    });

    saveMenu();

    updateMenuDropdown();

    document.getElementById("itemName").value="";
    document.getElementById("itemPrice").value="";
}

/* SEARCH */

function searchItems(){

    const search =
    document.getElementById("searchItem")
    .value
    .toLowerCase();

    const select =
    document.getElementById("menuSelect");

    select.innerHTML = "";

    menu
    .filter(item =>
        item.name
        .toLowerCase()
        .includes(search)
    )
    .forEach(item => {

        const originalIndex =
        menu.indexOf(item);

        const option =
        document.createElement("option");

        option.value =
        originalIndex;

        option.textContent =
        `${item.name} - ₹${item.price}`;

        select.appendChild(option);
    });
}

/* BILL */

function addToBill(){

    const itemIndex =
    document.getElementById("menuSelect").value;

    const qty =
    Number(
        document.getElementById("quantity").value
    );

    if(!qty){
        alert("Enter Quantity");
        return;
    }

    const item = menu[itemIndex];

    const amount =
    item.price * qty;

    bill.push({
        name:item.name,
        qty:qty,
        amount:amount
    });

    total += amount;

    renderBill();
}

function renderBill(){

    const billItems =
    document.getElementById("billItems");

    billItems.innerHTML = "";

    bill.forEach(row => {

        billItems.innerHTML += `
        <div class="bill-row">
            <span>
                ${row.name} x ${row.qty}
            </span>

            <span>
                ₹${row.amount}
            </span>
        </div>
        `;
    });

    document.getElementById("total")
    .innerText = total;
}

function clearBill(){

    bill = [];
    total = 0;

    renderBill();
}

/* SAVE SALE */

function saveSale(){

    if(total === 0){
        alert("Bill Empty");
        return;
    }

    const sale = {
        orderNo:sales.length+1,

        date:
        new Date().toLocaleDateString(),

        month:
        new Date().getMonth(),

        year:
        new Date().getFullYear(),

        total:total,

        items:bill
    };

    sales.push(sale);

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

    updateReports();

    alert("Sale Saved");
}

/* REPORTS */

function updateReports(){

    const today =
    new Date().toLocaleDateString();

    let todayTotal = 0;

    sales.forEach(sale => {

        if(sale.date === today){
            todayTotal += sale.total;
        }

    });

    document.getElementById(
        "todaySales"
    ).innerText = todayTotal;

    const currentMonth =
    new Date().getMonth();

    const currentYear =
    new Date().getFullYear();

    let monthTotal = 0;

    sales.forEach(sale => {

        if(
            sale.month === currentMonth &&
            sale.year === currentYear
        ){
            monthTotal += sale.total;
        }

    });

    document.getElementById(
        "monthlySales"
    ).innerText = monthTotal;
}

/* PRINT */

function printBill(){
    window.print();
}

/* DAILY REPORT */

function printDailySales(){

    const today =
    new Date().toLocaleDateString();

    let report = `
        <h2>EATOPHIYA</h2>
        <h3>Daily Sales Report</h3>
        <hr>
        <p>Date : ${today}</p>
        <hr>
    `;

    let grandTotal = 0;
    let orderCount = 0;

    sales.forEach((sale)=>{

        if(sale.date === today){

            orderCount++;

            report += `
                <h4>Order #${sale.orderNo}</h4>
            `;

            sale.items.forEach(item=>{

                report += `
                    <p>
                    ${item.name} x ${item.qty}
                    = ₹${item.amount}
                    </p>
                `;
            });

            report += `
                <p>
                <strong>
                Order Total : ₹${sale.total}
                </strong>
                </p>
                <hr>
            `;

            grandTotal += sale.total;
        }
    });

    report += `
        <h3>Total Orders : ${orderCount}</h3>
        <h2>Today's Total Sales : ₹${grandTotal}</h2>
    `;

    const win =
    window.open("","","width=500,height=700");

    win.document.write(`
        <html>
        <head>
            <title>Daily Sales Report</title>
        </head>
        <body>
            ${report}
        </body>
        </html>
    `);

    win.document.close();
    win.print();
}

/* MONTHLY REPORT */

function printMonthlySales(){

    const value =
    document.getElementById(
        "monthlySales"
    ).innerText;

    const win =
    window.open("","","width=400,height=600");

    win.document.write(`
        <h2>EATOPHIYA</h2>
        <h3>Monthly Sales Report</h3>
        <hr>

        <p>
        Month :
        ${new Date().toLocaleString(
            'default',
            {month:'long'}
        )}
        </p>

        <p>
        Total Sales :
        ₹${value}
        </p>
    `);

    win.print();
}

/* LOAD */

updateMenuDropdown();
updateReports();

function resetData(){
    if(confirm("All data will be deleted. continue?")){
        localStorage.clear();
        location.reload();
    }
}