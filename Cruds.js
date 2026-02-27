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
let filteredData = []; 

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +tax.value + +ads.value - +discount.value;
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
        dataProduct.push({ ...newProduct, id: Date.now() + i });
      }
    } else {
      let index = dataProduct.findIndex(item => item.id === tmp);
      if (index !== -1) {
          dataProduct[index] = { ...newProduct, id: tmp };
      }
      mood = "create";
      submitBtn.innerHTML = `Create`;
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
  
  data.forEach((item) => {
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
                        <button class="btn-icon" onclick="updateData(${item.id})">Edit</button>
                        <button class="btn-icon btn-danger" onclick="deleteData(${item.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
  });
  container.innerHTML = cards;

  let delBtn = document.getElementById("deleteAllBtnContainer");
  
  if (dataProduct.length > 0) {
    let displayCount = (document.getElementById("search").value != "") ? data.length : dataProduct.length;
    delBtn.innerHTML = `<button class="btn-danger" onclick="deleteAll()">Delete All (${displayCount})</button>`;
  } else {
    delBtn.innerHTML = "";
  }
}

function deleteData(id) {
  dataProduct = dataProduct.filter(item => item.id !== id);
  localStorage.product = JSON.stringify(dataProduct);
  let searchVal = document.getElementById("search").value;
  if(searchVal != "") {
      searchData(searchVal);
  } else {
      showData();
  }
}

function deleteAll() {
    let searchInput = document.getElementById("search");

    if (searchInput.value != "") {
        dataProduct = dataProduct.filter(item => !filteredData.find(f => f.id === item.id));
        searchInput.value = ""; 
    } else {
        dataProduct = [];
    }
    
    localStorage.product = JSON.stringify(dataProduct);
    showData();
}

function updateData(id) {
  let item = dataProduct.find(p => p.id === id);
  brand.value = item.brand;
  model.value = item.model;
  price.value = item.price;
  tax.value = item.tax;
  ads.value = item.ads;
  discount.value = item.discount;
  type.value = item.type;
  getTotal();
  count.style.display = "none";
  submitBtn.innerHTML = "Update";
  mood = "update";
  tmp = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function searchData(value) {
  filteredData = dataProduct.filter(
    (item) =>
      item.brand.toLowerCase().includes(value.toLowerCase()) ||
      item.model.toLowerCase().includes(value.toLowerCase()) ||
      item.type.toLowerCase().includes(value.toLowerCase()),
  );
  showData(filteredData);
}

showData();