let brand = document.getElementById("brand");
let model = document.getElementById("model");
let price = document.getElementById("price");
let tax = document.getElementById("tax");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let totalVal = document.getElementById("total-val");
let totalBadge = document.getElementById("total-badge");
let count = document.getElementById("count");
let type = document.getElementById("type");
let submitBtn = document.getElementById("submit-btn");
let mood = "create";
let tmp;

function getTotal() {
    if (price.value != "") {
        let result = (+price.value + +tax.value + +ads.value) - +discount.value;
        totalVal.innerHTML = result;
        totalBadge.style.background = "#059669";
    } else {
        totalVal.innerHTML = "0";
        totalBadge.style.background = "#ef4444";
    }
}

let dataProduct = localStorage.product ? JSON.parse(localStorage.product) : [];

function handleSubmit() {
    let newProduct = {
        brand: brand.value,
        model: model.value,
        price: price.value,
        tax: tax.value || 0,
        ads: ads.value || 0,
        discount: discount.value || 0,
        total: totalVal.innerHTML,
        type: type.value,
    };

    if (brand.value != "" && model.value != "" && price.value != "") {
        if (mood === "create") {
            let loop = +count.value > 0 ? +count.value : 1;
            for (let i = 0; i < loop; i++) {
                dataProduct.push({...newProduct, id: Date.now() + i});
            }
        } else {
            dataProduct[tmp] = newProduct;
            mood = "create";
            submitBtn.innerHTML = `
            <svg  width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
          </svg>Create`;
            count.style.display = "block";
        }
        clearData();
    }

    localStorage.setItem("product", JSON.stringify(dataProduct));
    showData();
}

function clearData() {
    brand.value = "";
    model.value = "";
    price.value = "";
    tax.value = "";
    ads.value = "";
    discount.value = "";
    totalVal.innerHTML = "0";
    count.value = "";
    type.value = "";
    getTotal();
}

function showData(data = dataProduct) {
    let container = document.getElementById("cards-container");
    let cards = "";
    data.forEach((item, i) => {
        cards += `
            <div class="car-card card animate-in">
            <div class="tape"></div>
                <div class="card-header">
                    <h3>${item.brand}</h3>
                    <span class="badge">${item.type}</span>
                </div>
                <p class="model-text">${item.model}</p>
                <div class="price-details">
                    <div class="price-row"><span>Base:</span> <span>$${item.price}</span></div>
                    <div class="price-row"><span>Fees:</span> <span>+$${+item.tax + +item.ads}</span></div>
                    <div class="price-row highlight"><span>Disc:</span> <span>-$${item.discount}</span></div>
                </div>
                <div class="card-footer">
                    <div class="total-price">$${item.total}</div>
                    <div class="actions">
                        <button class="btn-icon" onclick="updateData(${i})">Edit</button>
                        <button class="btn-icon btn-danger" onclick="deleteData(${i})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = cards;

    let delBtn = document.getElementById("deleteAllBtnContainer");
    if (dataProduct.length > 0) {
        delBtn.innerHTML = `<button class="btn-danger" onclick="deleteAll()">Delete All (${dataProduct.length})</button>`;
    } else {
        delBtn.innerHTML = "";
    }
}

function deleteData(i) {
    dataProduct.splice(i, 1);
    localStorage.product = JSON.stringify(dataProduct);
    showData();
}

function deleteAll() {
    localStorage.clear();
    dataProduct = [];
    showData();
}

function updateData(i) {
    brand.value = dataProduct[i].brand;
    model.value = dataProduct[i].model;
    price.value = dataProduct[i].price;
    tax.value = dataProduct[i].tax;
    ads.value = dataProduct[i].ads;
    discount.value = dataProduct[i].discount;
    type.value = dataProduct[i].type;
    getTotal();
    count.style.display = "none";
    submitBtn.innerHTML = "Update";
    mood = "update";
    tmp = i;
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function searchData(value) {
    let filtered = dataProduct.filter(item => 
        item.brand.toLowerCase().includes(value.toLowerCase()) ||
        item.model.toLowerCase().includes(value.toLowerCase()) ||
        item.type.toLowerCase().includes(value.toLowerCase())
    );
    showData(filtered);
}

showData();
