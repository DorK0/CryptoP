"use strict";

$(function () {
  // Document Ready
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: (coins) => {
      localStorage.setItem("allCoinsArray", JSON.stringify(coins));
      mainPageDisplay(coins);
    },
    error: (err) => console.error(err),
  });

  $("a").on("click", function () {
    $(this).addClass("bold");
    $(this).siblings().removeClass("bold");
  });
  $("#home").addClass("bold");

  let mainPageDisplay = (coins) => {
    for (let index = 0; index < coins.length; index++) {
      $("#mainDiv").append(
        `<div class="grid-item" id="${index}">
                  <div class="card shadow-sm cryptoCard">
                    <div class="card-body">
                     <h3>${coins[index].symbol}</h3>
                      <div class="form-check form-switch position-absolute end-0" >
                                  <input
                                    class="form-check-input toggleBox"
                                    type="checkbox"
                                    role="switch"
                                    id="${coins[index].name}"
                                    ${updateSelectedValue(coins[index].name)}
                                  />
                                  <label
                                    class="form-check-label"
                                    for="flexSwitchCheckChecked"
                                  ></label>
                                </div>
                                <img src="${
                                  coins[index].image.small
                                }" width="50px;" height="50px"/>
                                <p class="card-text">${coins[index].name}</p>
                        
                                <p>
                                  <a class="collapse-btn btn" data-bs-toggle="collapse" href="#collapse${index}" role="button" aria-expanded="false" aria-controls="collapse${index}">
                                  <strong>Show Currencies</strong>
                                  </a>
                                <div
                                  class="collapse"
                                  id="collapse${index}"
                                  name="${coins[index].id}"
                                >
                                  <div class="card card-body collapse-body ${
                                    coins[index].id
                                  }">
                         
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>`
      );
    }
    appendSearch();
    limitCheckboxes();
    filterSearching(coins);
  };

  let appendSearch = () => {
    $("#searchHere").empty();
    $("#searchHere").append(`<form class="d-flex">
  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
  </form>`);
  };

  let updateMainPage = () => {
    const allCoins = JSON.parse(localStorage.getItem("allCoinsArray"));
    $("#mainDiv").empty();
    if (allCoins === null || allCoins === undefined) {
      $.ajax({
        url: "https://api.coingecko.com/api/v3/coins",
        success: (coins) => {
          displayLoading();
          mainPageDisplay(coins);
        },
        error: (err) => console.error(err),
      });
    } else {
      mainPageDisplay(allCoins);
    }
  };

  $("#home").on("click", () => {
    updateMainPage();
  });

  let selectedCoins;
  let selectedCoinsAmount;
  let limitCheckboxes = () => {
    $("input[type='checkbox']").on("change", function () {
      selectedCoins = JSON.parse(sessionStorage.getItem("selectedCoins"));
        console.log(selectedCoins, selectedCoinsAmount);
      if (selectedCoins === null) {
        selectedCoinsAmount = 0;
      selectedCoins = [];
    }
    else{
      selectedCoinsAmount = Object.keys(JSON.parse(sessionStorage.getItem("selectedCoins"))).length;
    }
   
        if (this.checked === true && selectedCoinsAmount < 5) {
          console.log("test");
          selectedCoins.push($(this).attr("id"));
          sessionStorage.setItem(
            "selectedCoins",
            JSON.stringify(selectedCoins)
          );
        } else if(selectedCoins.includes($(this).attr("id"))) {
          let index = selectedCoins.indexOf($(this).attr("id"));
          if (index !== -1) {
            selectedCoins.splice(index, 1);
            sessionStorage.removeItem("selectedCoins");
            sessionStorage.setItem(
              "selectedCoins",
              JSON.stringify(selectedCoins)
            );
          }
        }
       else {
        $(this).prop("checked", false);
        sessionStorage.setItem("tryingToChange", $(this).attr("id"));
        modalCoins();
      }
    });
  };

  $("#mainDiv").on("show.bs.collapse", ".collapse", function () {currenciesController($(this).attr("name"))});



  const currenciesController = (coinName) => {
      console.log(coinName);
    let currenciesData = localStorage.getItem(coinName);
    if (currenciesData === null || currenciesData === undefined) {
      getCurrenciesFromApi(coinName);
    } else {
      let currencies = JSON.parse(currenciesData);
      appendCurrenciesInCollapseDiv(currencies, coinName);
    }
  }


  const getCurrenciesFromApi = (coinName) => {
    // showing loading
    $(`div > .${coinName}`).append(`<div id="loading"></div>`);
    $("#loading").addClass("#loading");
    $("#loading").addClass("#loading.display");
    $.ajax({
      url: `https://api.coingecko.com/api/v3/coins/${coinName}`,
      success: (coin) => {
        let usd = coin.market_data.current_price.usd;
        let eur = coin.market_data.current_price.eur;
        let ils = coin.market_data.current_price.ils;
        const currencies = [usd, eur, ils];
        console.log(coinName);
        console.log(currencies);
        localStorage.setItem(coinName, JSON.stringify(currencies));
        removeCurrencies(coinName);
        setCurrencies(coinName);
          $(`div > .${coin.id}`).empty();
          appendCurrenciesInCollapseDiv(currencies, coin.id);
      },
      error: (err) => console.error(err),
    });
  };

  const setCurrencies = (coinName) => {
    setInterval(() => {
        currenciesController(coinName);
    }, 2000 * 60);
  };
  const removeCurrencies = (coinName) => {
    setTimeout(() => {
      localStorage.removeItem(coinName);
    }, 2000 * 60);
  };



  const appendCurrenciesInCollapseDiv = (currencies, coinName) => {
    let coinData = Object.entries(currencies);
    $(`div > .${coinName}`).empty();
    $(`div > .${coinName}`).append(
      `
      <div class="currencies">
      ${coinData[0].splice(1, 2)} $</br>
       ${coinData[1].splice(1, 2)} €</br>
       ${coinData[2].splice(1, 2)} ₪
       </div>
       `
    );
  };


  

  const updateSelectedValue = (coin) => {
    const selectedCoins = JSON.parse(sessionStorage.getItem("selectedCoins"));
    try {
      const found = selectedCoins.find((arr) => arr === coin);
      if (found !== undefined) {
        return "checked";
      }
    } catch (er) {
      return;
    }
  };

  let filterSearching = (coinsArray) => {
    $("input[type=search]").on("input", (e) => {
      const value = e.target.value;
      console.log(value);
      for (let i = 0; i < coinsArray.length; i++) {
        let coinName = coinsArray[i].id;
        let coinSymbol = coinsArray[i].symbol;
        const isVisible =
          coinName.toLowerCase().includes(value) ||
          coinSymbol.toLowerCase().includes(value);
        $(`#mainDiv > #${i}`).toggleClass("hide", !isVisible);
      }
    });
  };

  const appendModalBody = (selectedArray, sixthCoin) => {
    for (const selectedCoin of selectedArray) {
      $(".modal-body").append(`
      <div class="col">
      <div class="card">
        <div class="card-body checkedArrayDiv">
          <h5 class="card-title changedCoinName">${selectedCoin}</h5>
          <div class="form-check form-switch">
              <input class="form-check-input toggleBox" type="checkbox" role="switch" id="${selectedCoin}" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault"></label>
            </div>
        </div>
      </div>
    </div>
      `);
    }

    $(".modal-body").append(`
    <div class="col">
    <div class="card">
      <div class="card-body tryingToChangeDiv">
        <h5 class="card-title changedCoinName">${sixthCoin}</h5>
        <div class="form-check form-switch">
            <input class="form-check-input toggleBox" type="checkbox" role="switch" id="${sixthCoin}">
            <label class="form-check-label" for="flexSwitchCheckDefault"></label>
          </div>
      </div>
    </div>
  </div>`);
  };

  const appendSuccessIcon = () => {
    $(".modal-body").empty();
    $(".modal-body").append(`
    <div class="success-icon success-icon--success">
    <span class="success-icon--success__line success-icon--success__line--long"></span>
    <span class="success-icon--success__line success-icon--success__line--tip"></span>
    <div class="success-icon--success__ring"></div>
    <div class="success-icon--success__hide-corners"></div>
  </div>
    `);
  };

  let modalCoins = () => {
    $(`#changeSelectedCoinsModal`).modal("show");
    $(".modal-body").empty();
    const tryingToChange = sessionStorage.getItem("tryingToChange");
    const selectedCoinsArray = JSON.parse(
      sessionStorage.getItem("selectedCoins")
    );
    appendModalBody(selectedCoinsArray, tryingToChange);

    $(".modal-body .toggleBox").on("change", function () {
      if (
        selectedCoinsArray.length < 5 &&
        !selectedCoinsArray.includes($(this).attr("id"))
      ) {
        selectedCoinsArray.push($(this).attr("id"));
        console.log(selectedCoinsArray);
      } else {
        if (selectedCoinsArray.includes($(this).attr("id"))) {
          let index = selectedCoinsArray.indexOf($(this).attr("id"));
          if (index !== -1) {
            selectedCoinsArray.splice(index, 1);
            console.log(selectedCoinsArray);
          }
        } else {
          $(this).prop("checked", false);
        }
      }
    });

    $("#saveChanges").on("click", function () {
      appendSuccessIcon();
      setTimeout(() => {
        $(`#changeSelectedCoinsModal`).modal("hide");
        $(`.modal-body`).empty();
        sessionStorage.removeItem("selectedCoins");
        sessionStorage.setItem(
          "selectedCoins",
          JSON.stringify(selectedCoinsArray)
        );
        updateMainPage();
      }, 1200);
    });
  };
});
