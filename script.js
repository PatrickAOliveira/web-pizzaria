let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
   let pizzaItem = c('.models .pizza-item').cloneNode(true);

   // preencher as informações em pizzaItem
   pizzaItem.setAttribute('data-key', index);
   pizzaItem.querySelector('.pizza-item--img img').src = item.img;
   pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

   // evento click no botão +
   pizzaItem.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      let key = e.target.closest('.pizza-item').getAttribute('data-key'); // index da pizza clicada
      modalQt = 1;
      modalKey = key;

      // preencher o modal com as info da pizza clicada
      c('.pizzaBig img').src = pizzaJson[key].img;
      c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
      c('.pizzaInfo--size.selected').classList.remove('selected');
      cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
         if (sizeIndex == 2) {
            size.classList.add('selected');
         }
         size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });

      // preencher e controlar a quantidade de itens do modal
      c('.pizzaInfo--qt').innerHTML = modalQt;

      // efeito ao abrir o modal
      c('.pizzaWindowArea').style.opacity = 0;
      c('.pizzaWindowArea').style.display = 'flex';
      setTimeout(() => {
         c('.pizzaWindowArea').style.opacity = 1;
      }, 200);
   });

   c('.pizza-area').append(pizzaItem);
});

// EVENTOS DO MODAL
function closeModal() {
   c('.pizzaWindowArea').style.opacity = 0;
   setTimeout(() => {
      c('.pizzaWindowArea').style.display = 'none';
   }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
   item.addEventListener('click', closeModal);
});

// eventos dos botões + e - da quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
   if (modalQt > 1) {
      modalQt--;
      c('.pizzaInfo--qt').innerHTML = modalQt;
   }
});
c('.pizzaInfo--qtmais').addEventListener('click', () => {
   modalQt++;
   c('.pizzaInfo--qt').innerHTML = modalQt;
});

// eventos dos botões dos tamanhos das pizzas
cs('.pizzaInfo--size').forEach((size) => {
   size.addEventListener('click', () => {
      c('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
   });
});

// evento do botão adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
   let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

   // identificador única para o cart
   let identifier = pizzaJson[modalKey].id + '@' + size;

   // verifica se em cart o item já existe
   let key = cart.findIndex((item) => item.identifier == identifier);
   if (key > -1) { // caso exista soma mais um
      cart[key].qt += modalQt;
   } else {
      // adicionando a pizza ao carrinho
      cart.push({
         identifier,
         id: pizzaJson[modalKey].id,
         size,
         qt: modalQt
      });
   }

   // atualiza o carrinho
   updateCart();
   closeModal();
});

// evento do botão do carrinho mobile
c('.menu-openner').addEventListener('click', () => {
   if (cart.length > 0) {
      c('aside').style.left = '0';
   }
});
c('.menu-closer').addEventListener('click', () => {
   c('aside').style.left = '100vw';
});

function updateCart() {
   c('.menu-openner span').innerHTML = cart.length;

   if (cart.length > 0) {
      c('aside').classList.add('show');
      c('.cart').innerHTML = '';

      let subtotal = 0;
      let descount = 0;
      let total = 0;

      for (let i in cart) {
         // obtém o item do carrinho e clona .cart--item
         let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
         subtotal += pizzaItem.price * cart[i].qt;
         let cartItem = c('.models .cart--item').cloneNode(true);

         // formatação para nome da pizza
         let pizzaSizeName;
         switch (cart[i].size) {
            case 0:
               pizzaSizeName = 'P';
               break;
            case 1:
               pizzaSizeName = 'M';
               break;
            case 2:
               pizzaSizeName = 'G';
               break;
         }
         let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

         // preenche as informações em cartItem
         cartItem.querySelector('img').src = pizzaItem.img;
         cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
         cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

         // eventos de + e - da quantidade no carrinho
         cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
            if (cart[i].qt > 1) {
               cart[i].qt--;
            } else {
               cart.splice(i, 1);
            }
            updateCart();
         });
         cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
            cart[i].qt++;
            updateCart();
         });

         c('.cart').append(cartItem);
      }

      // calcula os valores dos preços
      descount = subtotal * 0.1; // 0.1 é os 10% de desconto
      total = subtotal - descount;

      // exibe os valores na tela
      c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
      c('.desconto span:last-child').innerHTML = `R$ ${descount.toFixed(2)}`;
      c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
   } else {
      c('aside').classList.remove('show');
      c('aside').style.left = '100vw';
   }
}