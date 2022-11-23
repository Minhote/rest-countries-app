let api = "https://restcountries.com/v3.1/";
let body = document.querySelector("body");
let container = document.querySelector(".container");
let show = document.querySelector(".show");
let search = document.querySelector(".search");
let select = document.querySelector("select");
let childrens = [];
let toggle = document.querySelector(".toggle");

// Numero Random
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Crea Botones
function creaBotones(nodes, cantidadDeCards) {
  let btnsSection =
    document.querySelector(".btns-section") || document.createElement("div");
  btnsSection.classList.add("btns-section");
  container.appendChild(btnsSection);
  let btnsWrapper =
    document.querySelector(".btns-wrapper") || document.createElement("div");
  btnsWrapper.classList.add("btns-wrapper");
  let btns = Math.ceil(nodes.length / cantidadDeCards);
  btnsWrapper.innerHTML = "";
  for (let i = 0; i < btns; i++) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pag");
    btn.innerHTML = `${i + 1}`;
    btn.setAttribute("data-id", `${i + 1}`);
    btnsWrapper.appendChild(btn);
  }

  // Añadir clase active al primer botón
  [...btnsWrapper.children][0].classList.add("active");

  btnsSection.innerHTML = "";
  btnsSection.appendChild(btnsWrapper);

  // Prev and Next btns
  btnsSection.insertAdjacentHTML(
    "afterbegin",
    `
  <button class=prev-btn>Prev</button>
`
  );

  btnsSection.insertAdjacentHTML(
    "beforeend",
    `
  <button class=next-btn>Next</button>
`
  );

  let prev = document.querySelector(".prev-btn");
  prev.style.display = "none";
}

// Paginación
function displayList(items, wrapperCards, cardsPerPage, page) {
  wrapperCards.map((el) => (el.style.display = "none"));
  page--;

  let start = cardsPerPage * page;
  let end = start + cardsPerPage;
  let paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    paginatedItems[i].style.display = "flex";
  }
}

// Busqueda usada para los spans de los modal
async function findForCode(url, code) {
  let res = await fetch(`${url}/alpha/${code}`);
  let obj = await res.json();

  return obj;
}

// Busqueda usada para la busqueda individual de las cards
async function singleCountry(url) {
  let res = await fetch(url);
  let obj = await res.json();

  return obj;
}

// Busqueda inicial de todos los paises
async function allCountries(url) {
  let res = await fetch(url);
  let obj = await res.json();

  obj.forEach((element, index) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add(`card-${index + 1}`);
    newDiv.setAttribute("data-name", `${element.name.common}`);
    newDiv.setAttribute("data-region", `${element.region}`);
    newDiv.innerHTML = `
        <figure>
          <img class=img-card src=${element.flags.png}>    
        </figure>  
        <div class=body-card>
        <h2 class=country>${element.name.common}</h2>
        <p class=population><strong>Population:</strong> ${element.population.toLocaleString(
          "en-ES"
        )}</p>
        <p class=region><strong>Region:</strong> ${element.region}</p>
        <p class=capital><strong>Capital:</strong> ${element.capital}</p>
        </div>
    `;
    show.appendChild(newDiv);
  });

  // Mostrar pagina 1 solamente
  displayList([...show.children], [...show.children], 8, 1);

  creaBotones([...show.children], 8);
  let btnsWrapper = document.querySelector(".btns-wrapper");
  only4Btns([...btnsWrapper.children]);

  // Prev Next
  let prev = document.querySelector(".prev-btn");
  let next = document.querySelector(".next-btn");

  prev.addEventListener("click", () => {
    let ac = [...btnsWrapper.children].filter((el) =>
      el.classList.contains("active")
    )[0];

    console.log(
      ac.previousElementSibling,
      [...btnsWrapper.children].indexOf(ac.previousElementSibling)
    );

    [...btnsWrapper.children].map((el) => el.classList.remove("active"));

    ac.previousElementSibling.classList.add("active");

    only4Btns([...btnsWrapper.children]);

    displayList(
      [...show.children],
      [...show.children],
      8,
      parseInt(ac.previousElementSibling.innerHTML)
    );

    if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
      prev.style.display = "none";
      next.style.display = "inline-block";
    } else {
      prev.style.display = "inline-block";
      next.style.display = "inline-block";
    }
  });

  next.addEventListener("click", () => {
    prev.style.display = "inline-block";
    let ac = [...btnsWrapper.children].filter((el) =>
      el.classList.contains("active")
    )[0];

    [...btnsWrapper.children].map((el) => el.classList.remove("active"));

    ac.nextElementSibling.classList.add("active");

    only4Btns([...btnsWrapper.children]);

    displayList(
      [...show.children],
      [...show.children],
      8,
      parseInt(ac.nextElementSibling.innerHTML)
    );

    if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
      next.style.display = "none";
    }
  });
  console.log(prev, next);

  [...btnsWrapper.children].map((el) => {
    el.addEventListener("click", () => {
      [...btnsWrapper.children].map((el) => el.classList.remove("active"));

      displayList(
        [...show.children],
        [...show.children],
        8,
        parseInt(el.innerHTML)
      );

      el.classList.add("active");

      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children][0].classList.contains("active")
        ? (prev.style.display = "none")
        : (prev.style.display = "inline-block");
    });
  });

  [...show.children].forEach((e, i) => {
    e.addEventListener("click", () => {
      show.style.display = "none";
      search.style.display = "none";
      let btnSection = document.querySelector(".btns-section");
      btnSection.style.display = "none";
      singleCountry(`${api}name/${e.dataset.name}`)
        .then((res) => {
          if (res.length > 1) {
            let nm = res.filter((el) => {
              return el.name.common == e.dataset.name;
            });
            return nm;
          } else {
            return res;
          }
        })
        .then((res) => {
          res = res[0];
          let numRandonNativeName = random(
            0,
            Object.entries(res.name.nativeName).length - 1
          );
          let newModal = document.createElement("div");
          newModal.classList.add("modal");
          newModal.innerHTML = `
            <div class=btn-wrapper-m>
             <span class=back-btn><i class="fa-solid fa-arrow-left"></i> Back</span>
            </div>
            <div class=modal-container>
              <figure>
                <img class=modal-img src=${res.flags.png}>    
              </figure> 
              <div class=modal-body>
                <h2 class=modal-title>${res.name.common}</h2>
                <div class=modal-info-wrapper>
                  <div class=modal-info-part-1>
                    <p class=modal-para><strong>Native Name:</strong> ${
                      Object.entries(res.name.nativeName)[
                        numRandonNativeName
                      ][1].official
                    }</p>
                    <p class=modal-para><strong>Population:</strong> ${res.population.toLocaleString(
                      "en-ES"
                    )}</p>
                    <p class=modal-para><strong>Region:</strong> ${
                      res.region
                    }</p>
                    <p class=modal-para><strong>Sub Region:</strong> ${
                      res.subregion
                    }</p>
                    <p class=modal-para><strong>Capital:</strong> ${
                      res.capital
                    }</p>
                  </div>
                  <div class=modal-info-part-2>
                    <p class=modal-para><strong>Top Level Domain:</strong> ${
                      res.tld
                    }</p>
                    <p class=modal-para><strong>Currencies:</strong> ${Object.values(
                      res.currencies
                    ).map((el) => el.name)}</p>
                    <p class=modal-para><strong>Languages:</strong> ${Object.values(
                      res.languages
                    ).map((el) => el)}</p>
                  </div>
                </div>
              </div>  
          `;
          container.appendChild(newModal);
          return res.borders;
        })
        .then((res) => {
          if (Array.isArray(res)) {
            let modalBody = document.querySelector(".modal-body");
            let divBorders = document.createElement("div");
            divBorders.classList.add("border-div");
            res.map((el) => {
              findForCode(api, el).then((re) => {
                re = re[0];
                let cou = re.name.common;
                divBorders.innerHTML += `
              <span class=span-country>${cou}</span> 
              `;
              });
            });
            divBorders.insertAdjacentHTML(
              "afterbegin",
              `
            <p class=border-title>Border Countries: </p>
          `
            );
            modalBody.appendChild(divBorders);
          } else if (res == undefined) {
            let modalBody = document.querySelector(".modal-body");
            let divBorders = document.createElement("div");
            divBorders.classList.add("border-div");
            divBorders.insertAdjacentHTML(
              "afterbegin",
              `
            <p class=border-title>Bonder Countries: No one</p>
          `
            );
            modalBody.appendChild(divBorders);
          }
        })
        .catch((err) => console.error(err));
    });
  });
}

function spansEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("span-country")) {
      console.log(e.target.innerHTML);
      singleCountry(`${api}name/${e.target.innerHTML}`)
        .then((res) => {
          let modal = document.querySelector(".modal");
          res = res[0];
          let numRandonNativeName = random(
            0,
            Object.entries(res.name.nativeName).length - 1
          );
          modal.innerHTML = `
        <div class=btn-wrapper-m>
           <span class=back-btn><i class="fa-solid fa-arrow-left"></i> Back</span>
          </div>
          <div class=modal-container>
            <figure>
              <img class=modal-img src=${res.flags.png}>    
            </figure> 
            <div class=modal-body>
              <h2 class=modal-title>${res.name.common}</h2>
              <div class=modal-info-wrapper>
                <div class=modal-info-part-1>
                  <p class=modal-para><strong>Native Name:</strong> ${
                    Object.entries(res.name.nativeName)[numRandonNativeName][1]
                      .official
                  }</p>
                  <p class=modal-para><strong>Population:</strong> ${res.population.toLocaleString(
                    "en-ES"
                  )}</p>
                  <p class=modal-para><strong>Region:</strong> ${res.region}</p>
                  <p class=modal-para><strong>Sub Region:</strong> ${
                    res.subregion
                  }</p>
                  <p class=modal-para><strong>Capital:</strong> ${
                    res.capital
                  }</p>
                </div>
                <div class=modal-info-part-2>
                  <p class=modal-para><strong>Top Level Domain:</strong> ${
                    res.tld
                  }</p>
                  <p class=modal-para><strong>Currencies:</strong> ${Object.values(
                    res.currencies
                  ).map((el) => el.name)}</p>
                  <p class=modal-para><strong>Languages:</strong> ${Object.values(
                    res.languages
                  ).map((el) => el)}</p>
                </div>
              </div>
            </div>  
        `;
          return res.borders;
        })
        .then((res) => {
          let modalBody = document.querySelector(".modal-body");
          let divBorders = document.createElement("div");
          divBorders.classList.add("border-div");
          res.map((el) => {
            findForCode(api, el).then((re) => {
              re = re[0];
              let cou = re.name.common;
              divBorders.innerHTML += `
            <span class=span-country>${cou}</span> 
            `;
            });
          });
          divBorders.insertAdjacentHTML(
            "afterbegin",
            `
          <p class=border-title>Bonder Countries: </p>
        `
          );
          modalBody.appendChild(divBorders);
        });
    }
  });
}

function backBtn() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("back-btn")) {
      let modal = document.querySelector(".modal");
      let btnSection = document.querySelector(".btns-section");
      btnSection.style.display = "flex";
      container.removeChild(modal);
      search.style.display = "flex";
      show.style.display = "grid";
    }
  });
}

allCountries(`${api}all`);
spansEvents();
backBtn();

// Filter
search.querySelector("input").addEventListener("input", (e) => {
  let val = e.target.value;
  console.log(select);
  select.value = "All";
  let filtroNone = [...show.children].filter((el) => {
    let regex = new RegExp(`${val}`, "gi");
    if (!el.dataset.name.match(regex)) {
      return el;
    }
  });

  let filtroFlex = [...show.children].filter((el) => {
    let regex = new RegExp(`${val}`, "gi");
    if (el.dataset.name.match(regex)) {
      return el;
    }
  });

  filtroNone.map((el) => (el.style.display = "none"));
  filtroFlex.map((el) => (el.style.display = "flex"));

  let btnsSection = document.querySelector(".btns-section");
  btnsSection.style.display = "none";

  if (val == "") {
    // Mostrar pagina 1 solamente
    displayList([...show.children], [...show.children], 8, 1);
    btnsSection.style.display = "flex";
    creaBotones([...show.children], 8);
    let btnsWrapper = document.querySelector(".btns-wrapper");
    only4Btns([...btnsWrapper.children]);

    // Prev Next
    let prev = document.querySelector(".prev-btn");
    let next = document.querySelector(".next-btn");

    prev.addEventListener("click", () => {
      let ac = [...btnsWrapper.children].filter((el) =>
        el.classList.contains("active")
      )[0];

      [...btnsWrapper.children].map((el) => el.classList.remove("active"));

      ac.previousElementSibling.classList.add("active");

      only4Btns([...btnsWrapper.children]);

      displayList(
        [...show.children],
        [...show.children],
        8,
        parseInt(ac.previousElementSibling.innerHTML)
      );

      if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
        prev.style.display = "none";
        next.style.display = "inline-block";
      } else {
        prev.style.display = "inline-block";
        next.style.display = "inline-block";
      }
    });

    next.addEventListener("click", () => {
      prev.style.display = "inline-block";
      let ac = [...btnsWrapper.children].filter((el) =>
        el.classList.contains("active")
      )[0];

      [...btnsWrapper.children].map((el) => el.classList.remove("active"));

      ac.nextElementSibling.classList.add("active");

      only4Btns([...btnsWrapper.children]);

      displayList(
        [...show.children],
        [...show.children],
        8,
        parseInt(ac.nextElementSibling.innerHTML)
      );

      if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
        next.style.display = "none";
      }
    });

    [...btnsWrapper.children].map((el) => {
      el.addEventListener("click", () => {
        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        displayList(
          [...show.children],
          [...show.children],
          8,
          parseInt(el.innerHTML)
        );

        el.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        [...btnsWrapper.children][0].classList.contains("active")
          ? (prev.style.display = "none")
          : (prev.style.display = "inline-block");
      });
    });
  }
});

// Options Input
select.addEventListener("click", (e) => {
  let btnsWrapper = document.querySelector(".btns-wrapper");
  switch (e.target.value) {
    case "Asia":
      [...show.children].map((el) => {
        if (el.dataset.region != "Asia") {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });

      let cardsAsia = [...show.children].filter(
        (el) => el.dataset.region == "Asia"
      );

      // Mostrar página 1
      displayList(cardsAsia, [...show.children], 8, 1);

      //"Paginación"
      creaBotones(cardsAsia, 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(cardsAsia, [...show.children], 8, parseInt(el.innerHTML));

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevAsia = document.querySelector(".prev-btn");
      let nextAsia = document.querySelector(".next-btn");

      prevAsia.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAsia,
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevAsia.style.display = "none";
          nextAsia.style.display = "inline-block";
        } else {
          prevAsia.style.display = "inline-block";
          nextAsia.style.display = "inline-block";
        }
      });

      nextAsia.addEventListener("click", () => {
        prevAsia.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAsia,
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextAsia.style.display = "none";
        }
      });
      break;
    case "Africa":
      [...show.children].map((el) => {
        if (el.dataset.region != "Africa") {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
      let cardsAfrica = [...show.children].filter(
        (el) => el.dataset.region == "Africa"
      );

      // Mostrar página 1
      displayList(cardsAfrica, [...show.children], 8, 1);

      // Paginacion
      creaBotones(cardsAfrica, 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(
            cardsAfrica,
            [...show.children],
            8,
            parseInt(el.innerHTML)
          );

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevAfrica = document.querySelector(".prev-btn");
      let nextAfrica = document.querySelector(".next-btn");

      prevAfrica.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAfrica,
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevAfrica.style.display = "none";
          nextAfrica.style.display = "inline-block";
        } else {
          prevAfrica.style.display = "inline-block";
          nextAfrica.style.display = "inline-block";
        }
      });

      nextAfrica.addEventListener("click", () => {
        prevAfrica.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAfrica,
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextAfrica.style.display = "none";
        }
      });

      break;
    case "Americas":
      [...show.children].map((el) => {
        if (el.dataset.region != "Americas") {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
      let cardsAmericas = [...show.children].filter(
        (el) => el.dataset.region == "Americas"
      );

      // Mostrar página 1
      displayList(cardsAmericas, [...show.children], 8, 1);

      // Paginacion
      creaBotones(cardsAmericas, 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(
            cardsAmericas,
            [...show.children],
            8,
            parseInt(el.innerHTML)
          );

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevAmericas = document.querySelector(".prev-btn");
      let nextAmericas = document.querySelector(".next-btn");

      prevAmericas.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAmericas,
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevAmericas.style.display = "none";
          nextAmericas.style.display = "inline-block";
        } else {
          prevAmericas.style.display = "inline-block";
          nextAmericas.style.display = "inline-block";
        }
      });

      nextAmericas.addEventListener("click", () => {
        prevAmericas.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsAmericas,
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextAmericas.style.display = "none";
        }
      });

      break;
    case "Europe":
      [...show.children].map((el) => {
        if (el.dataset.region != "Europe") {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
      let cardsEurope = [...show.children].filter(
        (el) => el.dataset.region == "Europe"
      );

      // Mostrar página 1
      displayList(cardsEurope, [...show.children], 8, 1);

      // Paginacion
      creaBotones(cardsEurope, 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(
            cardsEurope,
            [...show.children],
            8,
            parseInt(el.innerHTML)
          );

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevEurope = document.querySelector(".prev-btn");
      let nextEurope = document.querySelector(".next-btn");

      prevEurope.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsEurope,
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevEurope.style.display = "none";
          nextEurope.style.display = "inline-block";
        } else {
          prevEurope.style.display = "inline-block";
          nextEurope.style.display = "inline-block";
        }
      });

      nextEurope.addEventListener("click", () => {
        prevEurope.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsEurope,
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextEurope.style.display = "none";
        }
      });

      break;
    case "Oceania":
      [...show.children].map((el) => {
        if (el.dataset.region != "Oceania") {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
      let cardsOceania = [...show.children].filter(
        (el) => el.dataset.region == "Oceania"
      );

      // Mostrar página 1
      displayList(cardsOceania, [...show.children], 8, 1);

      // Paginacion
      creaBotones(cardsOceania, 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(
            cardsOceania,
            [...show.children],
            8,
            parseInt(el.innerHTML)
          );

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevOceania = document.querySelector(".prev-btn");
      let nextOceania = document.querySelector(".next-btn");

      prevOceania.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsOceania,
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevOceania.style.display = "none";
          nextOceania.style.display = "inline-block";
        } else {
          prevOceania.style.display = "inline-block";
          nextOceania.style.display = "inline-block";
        }
      });

      nextOceania.addEventListener("click", () => {
        prevOceania.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          cardsOceania,
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextOceania.style.display = "none";
        }
      });

      break;
    default:
      [...show.children].map((el) => {
        el.style.display = "flex";
      });

      // Mostrar página 1
      displayList([...show.children], [...show.children], 8, 1);

      // Paginacion
      creaBotones([...show.children], 8);
      only4Btns([...btnsWrapper.children]);

      [...btnsWrapper.children].map((el) => {
        el.addEventListener("click", () => {
          [...btnsWrapper.children].map((el) => el.classList.remove("active"));

          displayList(
            [...show.children],
            [...show.children],
            8,
            parseInt(el.innerHTML)
          );

          el.classList.add("active");

          only4Btns([...btnsWrapper.children]);
        });
      });

      let prevAll = document.querySelector(".prev-btn");
      let nextAll = document.querySelector(".next-btn");

      prevAll.addEventListener("click", () => {
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.previousElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          [...show.children],
          [...show.children],
          8,
          parseInt(ac.previousElementSibling.innerHTML)
        );

        if (ac.previousElementSibling == [...btnsWrapper.children][0]) {
          prevAll.style.display = "none";
          nextAll.style.display = "inline-block";
        } else {
          prevAll.style.display = "inline-block";
          nextAll.style.display = "inline-block";
        }
      });

      nextAll.addEventListener("click", () => {
        prevAll.style.display = "inline-block";
        let ac = [...btnsWrapper.children].filter((el) =>
          el.classList.contains("active")
        )[0];

        [...btnsWrapper.children].map((el) => el.classList.remove("active"));

        ac.nextElementSibling.classList.add("active");

        only4Btns([...btnsWrapper.children]);

        displayList(
          [...show.children],
          [...show.children],
          8,
          parseInt(ac.nextElementSibling.innerHTML)
        );

        if (ac.nextElementSibling == [...btnsWrapper.children].at(-1)) {
          nextAll.style.display = "none";
        }
      });
      break;
  }
});

function only4Btns(btnsWrapper) {
  let btnElegido = btnsWrapper.filter((el) => el.classList.contains("active"));
  btnsWrapper.map((el) => (el.style.display = "none"));

  if (btnsWrapper.indexOf(btnElegido[0]) + 1 + 3 >= btnsWrapper.length) {
    for (let i = -1; i >= -4; i--) {
      console.log(btnsWrapper.at(i));
      btnsWrapper.at(i).style.display = "inline-block";
      console.log(btnsWrapper.at(i));
    }
  } else {
    for (
      let i = btnsWrapper.indexOf(btnElegido[0]);
      i < btnsWrapper.indexOf(btnElegido[0]) + 4;
      i++
    ) {
      if (!btnsWrapper[i]) return;
      btnsWrapper[i].style.display = "inline-block";
    }
  }
}

// Toggle theme
toggle.addEventListener("click", () => {
  console.log("clcik");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    toggle.children[0].classList.remove("fa-sun");
    toggle.children[0].classList.add("fa-moon");
  } else {
    body.classList.add("dark");
    toggle.children[0].classList.remove("fa-moon");
    toggle.children[0].classList.add("fa-sun");
  }
});
