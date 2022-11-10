// 이 아래 3 변수는 임의로 데이터를 추가하기 위한 변수임
const addBtn = document.querySelector('.addBtn');
const bookName = document.querySelector('.bookName');
const bookPrice = document.querySelector('.bookPrice');
const buyBtn = document.querySelector('.buy');
const bookId = document.querySelector('.bookId');

const cartList = document.querySelector('.list'); // 전체 장바구니 목록을 포함하는 ul
const selectDelBtn = document.querySelector('.selectDelBtn'); //선택 삭제 버튼
const totalPrice = document.querySelector('.totalPrice1');
const selectAllBtn = document.querySelector('.selectAll');
const allDelBtn = document.querySelector('.allDelBtn');

let checkList = [];
let totalPriceValue = 0;
let carts = JSON.parse(localStorage.getItem('carts')) || {};
carts = new Map(Object.entries(carts));

function template(img, name, price, count, id) {
  //상품 리스트 템플릿
  return `<li class="product" id=${id}>
    <div>
      <button class="select"><i class="fa-solid fa-check sel"></i></button>
    </div>
    <div class="imgBox">
      <img class="bookImg" src="smp1.jpg" />
    </div>
      <div class="info">
        <div class="bookName">${name}</div>
        <div class="price">${price}</div>
      </div>
    <div class="countContainer">
      <span class="totalPrice">${price * count} </span>
      <span>원</span>
      
      <div class="countBtn">
        <button class="minusBtn">-</button>
        <input class="count"  maxlength="3" type="number" value="${count}"}/>
        <button class="plusBtn" >+</button>
      </div>
    </div>
    <div>
      <button class="deleteBtn"><i class="fa-solid fa-x"></i></button>
    </div>
  </li>`;
}
addAllEvents();
rednerCarts();

function addAllEvents() {
  selectDelBtn.addEventListener('click', clickSelDelBtn);
  addBtn.addEventListener('click', add);
  selectAllBtn.addEventListener('click', function () {
    allSelect(allCartItems);
  });
  document.addEventListener('mousedown', function () {
    inputPrice(eventCartItem);
  });
  buyBtn.addEventListener('click', function () {
    localStorage.removeItem('orderId');
    localStorage.removeItem('cart');
    if (checkList.length === 0) {
      alert('1개 이상의 상품은 필수입니다');
    } else {
      const newCarts = new Map();
      checkList.forEach((val) => {
        const cartItem = carts.get(val);
        newCarts.set(val, cartItem);
      });
      localStorage.setItem(
        'carts',
        JSON.stringify(Object.fromEntries(newCarts))
      );

      location.replace('/order');
    }
  });
  allDelBtn.addEventListener('click', clickAllDelBtn);
}

function setItem(id, type) {
  if (type == 'plus') {
    carts.get(id).count += 1;
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  } else if (type == 'minus') {
    carts.get(id).count -= 1;
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  } else {
    carts.get(id).count = Number(type);
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  }
}

function add(e) {
  e.preventDefault();
  const name = bookName.value;
  const price = bookPrice.value;
  const id = bookId.value;
  let check = true;
  const cartItem = {
    title: name,
    price: price,
    count: carts.count || 1,
    imgaes: 'url',
  };

  if (carts.has(id)) {
    carts.get(id).count += 1;
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  } else {
    carts.set(id, cartItem);
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  }
}
function minusCount(cartItem) {
  const input = cartItem.querySelector('.count');
  const inputVal = input.value;
  const id = cartItem.id;
  const selCheck = cartItem.querySelector('.selected');
  const totalPrice1 = cartItem.querySelector('.totalPrice');
  const price = cartItem.querySelector('.price');

  if (inputVal <= 1) {
    return (totalPrice1.innerHTML = `${price.innerHTML} `);
  }
  input.value = Number(inputVal) - 1;
  totalPrice1.innerHTML = `${Number(price.innerHTML) * Number(input.value)} `;
  if (selCheck !== null) {
    totalPriceValue = totalPriceValue - Number(price.innerHTML);
    totalPrice.innerHTML = totalPriceValue;
  }

  setItem(id, 'minus');
}

function addCount(cartItem) {
  const input = cartItem.querySelector('.count');
  const inputVal = input.value;
  const selCheck = cartItem.querySelector('.selected');
  console.log(selCheck);
  const id = cartItem.id;
  const totalPrice1 = cartItem.querySelector('.totalPrice');
  const price = cartItem.querySelector('.price');

  if (inputVal >= 999) {
    input.value = 999;
  } else {
    input.value = Number(inputVal) + 1;
    totalPrice1.innerHTML = `${Number(price.innerHTML) * Number(input.value)} `;
    if (selCheck !== null) {
      totalPriceValue = totalPriceValue + Number(price.innerHTML);
      totalPrice.innerHTML = totalPriceValue;
    }

    setItem(id, 'plus');
  }
}

function inputPrice(cartItem) {
  if (cartItem === undefined) {
    return;
  }

  const totalPrice1 = cartItem.querySelector('.totalPrice');
  const inputBox = cartItem.querySelector('.count');
  const selCheck = cartItem.querySelector('.selected');
  const id = cartItem.id;
  const price = carts.get(id).price;
  inputBox.value = Number(inputBox.value);
  if (inputBox.value.length > 3) {
    inputBox.value = 999;
  } else if (inputBox.value <= 0) {
    inputBox.value = 1;
  }
  const a =
    Number(price) * Number(inputBox.value) - Number(totalPrice1.innerHTML);

  if (a != 0 && selCheck !== null) {
    totalPriceValue += a;
    totalPrice.innerHTML = totalPriceValue;
  }
  totalPrice1.innerHTML = `${Number(price) * Number(inputBox.value)} `;
  setItem(id, inputBox.value);
}

function clickDelBtn(cartItem) {
  const id = cartItem.id;
  const totalPrice1 = cartItem.querySelector('.totalPrice');
  const selCheck = cartItem.querySelector('.selected');
  cartItem.style.display = 'none';
  if (confirm('삭제 하시겠습니까?')) {
    carts.delete(id);
    if (selCheck !== null) {
      totalPriceValue -= Number(totalPrice1.innerHTML);
      totalPrice.innerHTML = totalPriceValue;
    }
    localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
  }
}

function clickSelBtn(cartItem) {
  const selectBtn = cartItem.querySelector('.select');
  const id = cartItem.id;
  const count = cartItem.querySelector('.count').value;
  const price = carts.get(id).price;
  if (selectBtn.classList.contains('selected')) {
    selectBtn.classList.remove('selected');
    totalPriceValue -= count * price;
    totalPrice.innerHTML = totalPriceValue;
    checkList = checkList.filter((val) => {
      return val != id;
    });
  } else {
    selectBtn.classList.add('selected');
    checkList.push(id);
    totalPriceValue += count * price;
    totalPrice.innerHTML = totalPriceValue;
  }
  console.log(checkList);
}

function clickSelDelBtn(e) {
  e.preventDefault();
  if (confirm('삭제 하시겠습니까?')) {
    checkList.forEach((id) => {
      carts.delete(id);

      localStorage.setItem('carts', JSON.stringify(Object.fromEntries(carts)));
    });
    location.reload();
  }
}

function clickSelBtn2(cartItem, check) {
  const selectBtn = cartItem.querySelector('.select');
  const id = cartItem.id;
  const count = cartItem.querySelector('.count').value;
  const price = carts.get(id).price;
  if (selectBtn.classList.contains('selected') || check === true) {
    selectBtn.classList.remove('selected');
    totalPriceValue -= count * price;
    totalPrice.innerHTML = totalPriceValue;
    checkList = checkList.filter((val) => {
      return val != id;
    });
  } else {
    selectBtn.classList.add('selected');
    checkList.push(id);
    totalPriceValue += count * price;
    totalPrice.innerHTML = totalPriceValue;
  }
  console.log(checkList);
}
function allSelect(allCartItems) {
  if (selectAllBtn.classList.contains('selected')) {
    selectAllBtn.classList.remove('selected');
    checkList = [];
    allCartItems.forEach((cartItem) => {
      clickSelBtn2(cartItem, true);
    });
  } else {
    selectAllBtn.classList.add('selected');
    checkList = [];
    allCartItems.forEach((cartItem) => {
      clickSelBtn2(cartItem, false);
    });
  }
}

function clickAllDelBtn(e) {
  e.preventDefault();
  if (confirm('삭제 하시겠습니까?')) {
    localStorage.removeItem('carts');
    location.reload();
  }
}

function rednerCarts() {
  let tem = ``;
  for (let [cartItemId, cartItem] of carts) {
    tem +=
      template(
        cartItem.imgaes[0],
        cartItem.title,
        cartItem.price,
        cartItem.count,
        cartItemId
      ) + '\n';
  }
  cartList.insertAdjacentHTML('beforeend', tem);
}

totalPrice.innerHTML = totalPriceValue;
const allCartItems = document.querySelectorAll('.product');
let eventCartItem;
cartList.onclick = (event) => {
  const cartItem = event.target.closest('.product');
  if (event.target.classList.contains('plusBtn')) {
    addCount(cartItem);
  } else if (event.target.classList.contains('minusBtn')) {
    minusCount(cartItem);
  } else if (event.target.classList.contains('deleteBtn')) {
    clickDelBtn(cartItem);
  } else if (
    event.target.classList.contains('select') ||
    event.target.classList.contains('sel')
  ) {
    clickSelBtn(cartItem);
  }
};
cartList.onmousedown = (event) => {
  const cartItem = event.target.closest('.product');
  if (event.target.classList.contains('count')) {
    eventCartItem = cartItem;
  }
};

allSelect(allCartItems);
