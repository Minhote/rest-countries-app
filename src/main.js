// Peticion API
let api = "https://restcountries.com/v3.1/";
let body = document.querySelector("body");
let container = document.querySelector(".container");
let show = document.querySelector(".show");

function createBtns(node) {
  let btnsSection = document.createElement("div");
  btnsSection.classList.add("btns-section");
  container.appendChild(btnsSection);
  let btnsWrapper = document.createElement("div");
  btnsWrapper.classList.add("btns-wrapper");
  [...node.children].map((el, i) => {
    btnsWrapper.insertAdjacentHTML(
      "beforeend",
      `
      <button data-id=${i + 1}>${i + 1}</button>
    `
    );
  });
  btnsWrapper.insertAdjacentHTML(
    "afterbegin",
    `
    <button class=prev>prev</button>
  `
  );
  btnsWrapper.insertAdjacentHTML(
    "beforeend",
    `
    <button class=next>next</button>
  `
  );
  btnsSection.appendChild(btnsWrapper);
  btnsWrapper.children[1].classList.add("active");

  let elegido;
  [...btnsWrapper.children].map((el, i) => {
    if (el.classList.contains("prev") || el.classList.contains("next")) {
      el.style.display = "none";
    }
    if (el.classList.contains("active")) {
      elegido = el;
      elegido.style.display = "inline-block";
    } else {
      el.style.display = "none";
    }
  });

  for (
    let i = [...btnsWrapper.children].indexOf(elegido);
    i < [...btnsWrapper.children].indexOf(elegido) + 5;
    i++
  ) {
    if (![...btnsWrapper.children][i]) return;
    [...btnsWrapper.children][i].style.display = "inline-block";
  }

  //Events
  [...btnsWrapper.children].map((el) => {
    el.addEventListener("click", (e) => {
      [...btnsWrapper.children].map((el) => {
        el.classList.remove("active");
      });

      e.target.classList.add("active");

      [...show.children].map((el) => {
        el.style.display = "none";
        el.classList.remove("active");
      });
      show.children[e.target.dataset.id - 1].style.display = "grid";
      show.children[e.target.dataset.id - 1].classList.add("active");

      if (e.target.dataset.id === "1") {
        [...btnsWrapper.children][0].style.display = "none";
        [...btnsWrapper.children].at(-1).style.display = "none";
      } else if (e.target.dataset.id >= [...btnsWrapper.children].length - 6) {
        [...btnsWrapper.children].map((el) => {
          el.style.display = "none";
        });
        for (let i = -2; i >= -6; i--) {
          [...btnsWrapper.children].at(i).style.display = "inline-block";
        }
        [...btnsWrapper.children].at(-1).style.display = "none";
        [...btnsWrapper.children][0].style.display = "inline-block";
      } else {
        [...btnsWrapper.children].map((el) => {
          el.style.display = "none";
        });
        [...btnsWrapper.children][0].style.display = "inline-block";
        [...btnsWrapper.children].at(-1).style.display = "inline-block";
        for (
          let i = parseInt(e.target.dataset.id);
          i < parseInt(e.target.dataset.id) + 5;
          i++
        ) {
          if (![...btnsWrapper.children][i]) return;
          [...btnsWrapper.children][i].style.display = "inline-block";
        }
      }
    });
  });
}

function displayPage(node, id) {
  node.map((el) => {
    el.style.display = "none";
  });
  node[id].style.display = "grid";
}

async function rellenarShow(region) {
  let countries = [];
  let res = await fetch(region);
  let obj = await res.json();
  //Calcular el núnero de cantidadDePaginas
  let cantidadDePaginas = Math.ceil(obj.length / 8);
  for (let i = 0; i < cantidadDePaginas; i++) {
    let d = [];
    countries.push(d);
  }
  // Paises ordenados y asignados
  let arr = obj
    .sort((a, b) => {
      if (a.name.common > b.name.common) {
        return 1;
      } else {
        return -1;
      }
    })
    .map((el) => {
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].length < 8) {
          countries[i].push(el);
          break;
        }
      }
    });

  return countries;
}

function active(node) {}
rellenarShow(`${api}all`).then((res) => {
  res.map((el, i) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add(`page-${i + 1}`);
    el.map((e, x) => {
      let newCard = `
      <div class=card-${x + 1}>
        <figure>
          <img src=${e.flags.png}>    
        </figure>  
        <div>
        <h2 class=country>${e.name.common}</h2>
        <p class=population>Population: ${e.population}</p>
        <p class=region>Region: ${e.region}</p>
        <p class=capital>Capital: ${e.capital}</p>
        </div>
      </div>
      `;
      newDiv.insertAdjacentHTML("beforeend", newCard);
    });
    show.appendChild(newDiv);
  });
  createBtns(show);
  show.children[0].classList.add("active");
  [...show.children].map((el) => {
    if (!el.classList.contains("active")) {
      el.style.display = "none";
    }
  });
});

// Variables
