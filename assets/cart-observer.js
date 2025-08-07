async function getCart() {
  const result = await fetch("/cart.json");
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(
    `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
  );
}

async function getProduct(productID) {
  const shopURL = window.location.origin;
  const urlForCollections =
    shopURL + "/admin/api/2025-4/collections.json?product_id=" + productID;
  const result = await fetch(urlForCollections);
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(
    `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
  );
}

async function getCollection(collectionID) {
  const shopURL = window.location.origin;
  const urlForCollections =
    shopURL +
    "/admin/api/2025-4/collections/" +
    collectionID +
    "/metafields.json";
  const result = await fetch(urlForCollections);
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(
    `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
  );
}

async function getMetaFields(productID) {
  const shopURL = window.location.origin;
  const urlForMeta = shopURL + "/products/" + productID + "/metafields.json";

  const result = await fetch(urlForMeta);
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(
    `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
  );
}

async function addMvodToCart(mvodIDs, updateSections) {
  let formData = { items: [] };
  mvodIDs.forEach((item) => {
    formData.items.push({
      id: item.id,
      quantity: 1,
      properties: { _Related_product: `${item.prop}` },
    });
  });
  formData.section = updateSections;
  formData.sections_url = "/cart";

  const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return response.json();
}
async function removeFromCart(mvodIDs, updateSections) {
  let updValues = {};
  mvodIDs.forEach((ID) => {
    updValues[ID] = 0;
  });

  let formData = {
    updates: updValues,
    sections: updateSections,
    sections_url: "/cart",
  };

  const response = await fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return response.json();
}

function updateCart(sections) {
  Object.keys(sections.sections).forEach((section) => {
    let shopifySection = document.querySelector(`#shopify-section-${section}`);
    if (document.querySelector(`#shopify-section-${section}`)) {
      shopifySection.innerHTML = sections.sections[section];
    } else if (document.querySelector(`#${section}`)) {
      shopifySection = document.querySelector(`#${section}`);
      shopifySection.innerHTML = sections.sections[section];
    } else if (document.querySelector(`${section}`)) {
      shopifySection = document.querySelector(`${section}`);
      let newContent = document.createElement(section);
      newContent.innerHTML = sections.sections[section];
      shopifySection.querySelector("#CartDrawer-CartItems").innerHTML =
        newContent.querySelector("#CartDrawer-CartItems").innerHTML;
      shopifySection.querySelector(".drawer__footer").innerHTML =
        newContent.querySelector(".drawer__footer").innerHTML;
    }
  });
  const cartCount = document.querySelector("cart-count");

  cartCount.innerText = sections.item_count;
}
function updateNotification(item) {
  try {
    const targetDiv = document.querySelector(".quick-buy-drawer__variant");
    const targetDiv2 = document.querySelector(".line-item");

    // Clone the HTML content
    const clonedHtml = targetDiv.cloneNode(true);
    // Modify the image URL in the cloned HTML
    const newImageUrl = item.featured_image.url;
    const imageElement = clonedHtml.querySelector("img");
    imageElement.removeAttribute("srcSet");
    imageElement.src = newImageUrl;
    // Modify the product title in the cloned HTML
    const newProductTitle = item.title;
    const titleElement = clonedHtml.querySelector(".bold");
    titleElement.textContent = newProductTitle;
    const newPrice = clonedHtml.querySelector("sale-price");
    newPrice.innerHTML =
      '<price-list class="price-list  "><h4 class="free_added">Unlocked with Product</h4></price-list>';
    // Append the cloned HTML after the original div
    targetDiv.insertAdjacentHTML("afterend", clonedHtml.outerHTML);
    targetDiv2.insertAdjacentHTML("afterend", clonedHtml.outerHTML);

    // targetButton.parentNode.insertBefore(clonedButton, targetButton.nextSibling);
    const cartCount = document.querySelector("cart-count");
    cartCount.innerHTML = Number.parseInt(cartCount.innerText) + 1;
    const cartDrawerElement = document.querySelector(
      'a[aria-controls="cart-drawer"]'
    );
    if (cartDrawerElement) {
      // Check if the cart-drawer element has the logged_IN class
      const isUserLoggedIn = cartDrawerElement.classList.contains("logged_IN");
      if (!isUserLoggedIn) {
        //change instant notification checkout button
        const bottomNotificationButton = document.querySelector(
          "body > cart-notification-drawer > div > form > button"
        );

        if (bottomNotificationButton) {
          bottomNotificationButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            open("/checkout?redirect_uri=/cart", "_self");
          });
        }
        //change side card drawer notification checkout button
        const sideNotificationButton = document.querySelector(
          'button.button.button--xl[name="checkout"]'
        );
        if (sideNotificationButton) {
          sideNotificationButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            open("/checkout?redirect_uri=/cart", "_self");
          });
        }
        // '?'
        const targetButton = document.querySelector(
          "a.button.button--outline.button--secondary"
        );
        const clonedButton = targetButton.cloneNode(true);
        clonedButton.textContent = "Checkout";
        clonedButton.setAttribute("href", "/account/login");
        const checkoutButtons = document.querySelectorAll(
          'button.button[name="checkout"]'
        );
        checkoutButtons.forEach((originalButton) => {
          const clonedButton = targetButton.cloneNode(true);
          clonedButton.textContent = "Checkout";
          clonedButton.setAttribute(
            "href",
            "/account/login?redirect_uri=/cart"
          );

          // Replace the original button with the cloned button
          originalButton.parentNode.replaceChild(clonedButton, originalButton);
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function updatePage(sections) {
  // let sectionsFromShopify = Object.keys(sections)
  // let drawerSection = sections[sectionsFromShopify[2]]
  // let drawerSectionElement = document.createElement(sectionsFromShopify[2])
  // drawerSectionElement.innerHTML = drawerSection;
  // let productImageURL = drawerSectionElement.querySelectorAll('img')
  // console.log(productImageURL)
  // let productTitle = drawerSectionElement.querySelector('.reversed-link')

  // const targetDiv = document.querySelector('.quick-buy-drawer__variant');
  // // Clone the HTML content
  // const clonedHtml = targetDiv.cloneNode(true);
  // // Modify the image URL in the cloned HTML
  // const newImageUrl = productImageURL[0].currentSrc;
  // const imageElement = clonedHtml.querySelector('img');
  // imageElement.src = newImageUrl;
  // // Modify the product title in the cloned HTML
  // const newProductTitle = productTitle.innerText;
  // const titleElement = clonedHtml.querySelector('.bold');
  // titleElement.textContent = newProductTitle;
  // // Append the cloned HTML after the original div
  // targetDiv.insertAdjacentHTML('afterend', clonedHtml.outerHTML);

  // updateSection
  let sectionsForUpdate = Object.keys(sections);

  let cartDrawer = null;
  let attrs = null;
  try {
    cartDrawer = document.querySelector("cart-drawer");
    const attributeNodeArray = [...cartDrawer.attributes];
    attrs = attributeNodeArray.reduce((attrs, attribute) => {
      attrs[attribute.name] = attribute.value;
      return attrs;
    }, {});
  } catch (e) {}
  sectionsForUpdate.forEach((section) => {
    if (section.length > 0) {
      let shopifySection = document.querySelector(
        `#shopify-section-${section}`
      );
      if (document.querySelector(`#shopify-section-${section}`)) {
        shopifySection.innerHTML = sections[section];
      } else if (document.querySelector(`#${section}`)) {
        shopifySection = document.querySelector(`#${section}`);
        shopifySection.innerHTML = sections[section];
      } else if (document.querySelector(`${section}`)) {
        shopifySection = document.querySelector(`${section}`);
        let newContent = document.createElement(section);
        newContent.innerHTML = sections[section];
        shopifySection.querySelector("#CartDrawer-CartItems").innerHTML =
          newContent.querySelector("#CartDrawer-CartItems").innerHTML;
        shopifySection.querySelector(".drawer__footer").innerHTML =
          newContent.querySelector(".drawer__footer").innerHTML;
      }
    }
  });
}

async function getSections(sections) {
  const shopURL = window.location.origin;
  const result = await fetch(
    `${shopURL}${sections.map((section, index) => {
      if (index === 0) return `?sections=${section}`;
      else return `,${section}`;
    })}`
  );
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(
    `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
  );
}

async function getProductDetails(cartItem) {
  const productID = cartItem.product_id;
  const product = await getProduct(productID);
  return {
    image: product.image.src,
    title: product.title,
    price: cartItem.price,
  };
}

window.addEventListener("SCE:add", async (event) => {
  try {
    let productID = event.detail.product_id;
    if (typeof productID === "undefined") {
      productID = event.detail.id;
    }
    const productsInCart = await getCart();

    let productMetafield = event.detail.properties["_MVODProduct"];

    let collectionMetafield = event.detail.properties["_MVODCollection"];
    let mvodsForAdd = [];
    let isProductAlreadyInCart = productsInCart.items.filter((item) => {
      if (item.variant_id === Number.parseInt(productMetafield)) return true;
      else return false;
    });

    if (isProductAlreadyInCart.length === 0 && productMetafield) {
      mvodsForAdd.push({
        id: productMetafield,
        product: true,
        prop: event.detail.product_id,
      });
    }
    let isCollectionProductAlreadyInCart = productsInCart.items.filter(
      (item) => {
        if (item.variant_id === Number.parseInt(collectionMetafield))
          return true;
        else return false;
      }
    );
    if (isCollectionProductAlreadyInCart.length === 0 && collectionMetafield) {
      mvodsForAdd.push({
        id: collectionMetafield,
        product: false,
        prop: event.detail.product_id,
      });
    }
    let sections = Object.keys(event.detail.sections);
    const response = await addMvodToCart(mvodsForAdd, sections);

    const newSection = await getSections(sections);

    updateNotification(response.items[0]);
    updatePage(newSection);
  } catch (e) {
    console.error("MVOD Error", e);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  let checkoutButtonAdded = false; // Add this flag
  let cart = await getCart();

  let removeButton = document.querySelector(".removeItemBtn");
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      removeButton.dispatchEvent("SCE:change");
    });
  }
  
  // Check if the URL contains "/cart"
  if (window.location.href.includes("/cart")) {
    cart.items.forEach(async (item) => {
      if (item.properties) {
        let props = Object.keys(item.properties);
        if (props.indexOf("_Related_product") >= 0) {
          let itemsForRemove = [];
          let itemsInCart = cart.items.filter((itm) => {
            if (itm.properties && itm.properties["_MVODProduct"]) {
              return (
                Number.parseInt(itm.properties["_MVODProduct"]) === item.id
              );
            } else return false;
          });

          if (itemsInCart.length === 0) {
            itemsForRemove.push(Number.parseInt(item.id));
            await removeFromCart(itemsForRemove, null);
            window.location.reload();
          }
        }

        if (props.indexOf("_MVODProduct") >= 0) {
          if (window.location.href.includes("login")) {
          }
          const cartDrawerElement = document.querySelector(
            'a.relative[href="/cart"]'
          );
          if (cartDrawerElement) {
            const isUserLoggedIn =
              cartDrawerElement.classList.contains("logged_IN");
            if (!isUserLoggedIn) {
              let inputs = document.querySelectorAll(
                'input[name="checkout_url"]'
              );
              
              inputs.forEach((input) => {
                input.value = "/checkout";
              });
              function changeButtonType() {
                // Create a new button element
                // var newButton = document.createElement("button");

                // // Set the attributes and properties for the new button
                // newButton.type = "button"; // Change the type to "button"
                // newButton.className =
                //   "button button--xl button--outline w-full"; // Set the class
                // newButton.textContent = "Checkout"; // Set the button text
                // newButton.id = "newButton"; // Set a new ID if needed

                // Replace the existing button with the new button
                var existingButton = document.querySelector(
                  '.cart-form button.button[name="checkout"]'
                );
                if (existingButton) {
                  existingButton.setAttribute("id", "newButton");
                  // existingButton.parentNode.replaceChild(
                  //   newButton,
                  //   existingButton
                  // );
                } else {
                  console.error("Button not found.");
                }
              }

              // Call the function to change the button type
              changeButtonType();
              var checkoutButton = document.getElementById("newButton");
              if (checkoutButton) {
                checkoutButton.addEventListener("click", function (ev) {
                  ev.preventDefault();
                  window.location.href =
                    "/account/login?redirect_uri=/checkout";
                });
              }
            }
          }
        }
      }
    });
  } else {
    // Check if the cart-drawer element exists
    const cartDrawerElement = document.querySelector(
      'a[aria-controls="cart-drawer"]'
    );
    if (cartDrawerElement) {
      // Check if the cart-drawer element has the logged_IN class
      const isUserLoggedIn = cartDrawerElement.classList.contains("logged_IN");

      if (!checkoutButtonAdded && !isUserLoggedIn) {
        // Check if the button has not been added and the user is not logged in
        cart.items.forEach((item) => {
          if (item.properties) {
            let props = Object.keys(item.properties);
            if (props.indexOf("_MVODProduct") >= 0) {
              var checkoutButton = document.querySelector(
                'button.button[name="checkout"]'
              );
              checkoutButton.classList.add("hidden");
              var viewCartButton = document.querySelector(
                "a.button.button--xl.button--secondary"
              );
              var loginButton = viewCartButton.cloneNode(true);
              loginButton.textContent = "Checkout";
              loginButton.href = "/checkout?redirect_uri=/cart";
              viewCartButton.parentNode.insertBefore(
                loginButton,
                viewCartButton.nextSibling
              );
              checkoutButtonAdded = true; // Set the flag to true after adding the button
            }
          }
        });
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  
  var loginForm = document.getElementById("customer_login");
  if (loginForm) {
    const currentUrl = window.location.href;
    
    if (currentUrl.includes("?redirect_uri=/cart")) {
      // Redirect to the cart page
      var checkoutUrlInput = document.querySelector(
        'input[name="checkout_url"]'
      );
      if (checkoutUrlInput) {
        checkoutUrlInput.value = "/cart";
      }
    }
  }
});
window.addEventListener("SCE:mutate", async (event) => {});

window.addEventListener("SCE:update", (event) => {});

window.addEventListener("SCE:change", async (event) => {
  let cart = event.detail.items;
  let removedItems = event.detail.items_removed;

  let itemsForRemove = [];
  let sections = Object.keys(event.detail.sections);
  cart.forEach((item) => {
    if (item.properties && item.properties["_Related_product"]) {
      let itemsInCart = cart.filter((it) => {
        if (it.properties && it.properties["_MVODProduct"])
          return Number.parseInt(it.properties["_MVODProduct"]) === item.id;
      });

      if (itemsInCart.length === 0) {
        itemsForRemove.push(Number.parseInt(item.id));
      }
    }
  });

  const response = await removeFromCart(itemsForRemove, sections);
  updateCart(response);
});

window.addEventListener("SCE:clear", (event) => {});
