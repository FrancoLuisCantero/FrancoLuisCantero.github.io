import {
  DEFAULT_BASE,
  DEFAULT_DIGITS,
  DIGIT_HEIGHT,
  ANIMATION_INTERVAL,
  SYMBOLS
} from "./constants.js";

import {
  BASE_OPTIONS,
  DIGIT_OPTIONS,
  createInitialState,
  convertDecimalToState,
  parseInputValue,
  getWeightExpression,
  getProductExpression,
  getContributionValue,
  getDecimalValue,
  addPower
} from "./math.js";

let BASE = DEFAULT_BASE;
let DIGITS = DEFAULT_DIGITS;
let DETAIL_LEVEL = 4;

let state = createInitialState(DIGITS);
let displayState = [...state];
let cylinders = [];
let intervalId = null;
let isTransitioning = false;
let activeDigitIndexes = [];
let activeHighlightType = null;

const floatingAdditions = document.getElementById("floating-additions");
const indexes = document.getElementById("indexes");
const increments = document.getElementById("increments");
const cryptex = document.getElementById("cryptex");
const decrements = document.getElementById("decrements");
const weights = document.getElementById("weights");
const products = document.getElementById("products");
const contributions = document.getElementById("contributions");
const decimalValue = document.getElementById("decimal-value");
const baseSelect = document.getElementById("base-select");
const digitsSelect = document.getElementById("digits-select");
const animationModeSelect = document.getElementById("animation-mode-select");
const resetBtn = document.getElementById("reset-btn");
const backwardBtn = document.getElementById("backward-btn");
const stopBtn = document.getElementById("stop-btn");
const forwardBtn = document.getElementById("forward-btn");
const detailSlider = document.getElementById("detail-slider");
const numberInput = document.getElementById("number-input");
const updateBtn = document.getElementById("update-btn");

let ANIMATION_MODE = animationModeSelect.value;

digitsSelect.addEventListener(
  "change",
  () => {
    DIGITS =
      Number(
        digitsSelect.value
      );

    state =
      createInitialState(
        DIGITS
      );
    displayState = [...state];

    interruptAnimation();

    buildCryptex();
  }
);

baseSelect.addEventListener(
  "change",
  () => {
    BASE =
      Number(baseSelect.value);

    state =
      createInitialState(
        DIGITS
      );
    displayState = [...state];
    interruptAnimation();

    buildCryptex();
  }
);

detailSlider.addEventListener(
  "input",
  () => {
    DETAIL_LEVEL =
      Number(
        detailSlider.value
      );

    buildCryptex();
  }
);

function isAnimationRunning() {
  return intervalId !== null;
}

function stopAnimation() {
  clearInterval(intervalId);

  intervalId = null;
}

function interruptAnimation() {
  if (
    !isAnimationRunning()
  ) {
    return;
  }

  stopAnimation();
}

function setStateFromDecimal(
  value
) {
  interruptAnimation();

  const convertedState =
    convertDecimalToState(
      value,
      BASE,
      DIGITS
    );

  if (
    convertedState === null
  ) {
    return false;
  }

  state = convertedState;
  displayState = [...state];

  renderAll();

  return true;
}

function createCylinder() {
  const cylinder =
    document.createElement(
      "div"
    );

  cylinder.className =
    "cylinder";

  const digitsContainer =
    document.createElement(
      "div"
    );

  digitsContainer.className =
    "digits";

  for (
    let i = 0;
    i < BASE;
    i++
  ) {
    const digit =
      document.createElement(
        "div"
      );

    digit.className =
      "digit";

    digit.textContent =
      SYMBOLS[i];

    digitsContainer.appendChild(
      digit
    );
  }

  cylinder.appendChild(
    digitsContainer
  );

  cryptex.appendChild(
    cylinder
  );

  return {
    cylinder,
    digitsContainer
  };
}

function buildCryptex() {
  cryptex.innerHTML = "";

  cylinders = [];

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    cylinders.push(
      createCylinder()
    );
  }

  renderAll();
}

function applyPower(
  exponent,
  direction
) {
  if (isTransitioning) {
    return;
  }
  interruptAnimation();

  const currentValue =
    getDecimalValue(
      state,
      BASE,
      DIGITS
    );

  const nextValue =
    addPower(
      currentValue,
      exponent,
      direction,
      BASE,
      DIGITS
    );

  setStateFromDecimal(
    nextValue
  );
}

function renderIndexes() {
  indexes.innerHTML = "";

  if (DETAIL_LEVEL < 1) {
    return;
  }

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const index =
      document.createElement(
        "div"
      );

    index.className =
      "index";

    index.textContent =
      DIGITS - 1 - i;

    indexes.appendChild(index);
  }
}

function renderIncrementButtons() {
  increments.innerHTML = "";

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const button =
      document.createElement(
        "button"
      );

    button.className =
      "increment-btn";

    button.textContent =
      "+1";

    const exponent = DIGITS - 1 - i;

    button.addEventListener(
      "click",
      async () => {
        const index = DIGITS - 1 - exponent;

        if (
          ANIMATION_MODE ===
          "flow"
        ) {
          await incrementFlow(index);

          return;
        }

        await incrementFromIndex(index);
      }
    );

    increments.appendChild(
      button
    );
  }
}

function renderDecrementButtons() {
  decrements.innerHTML = "";

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const button =
      document.createElement(
        "button"
      );

    button.className =
      "decrement-btn";

    button.textContent =
      "-1";

    const exponent =
      DIGITS - 1 - i;

    button.addEventListener(
      "click",
      () => {
        applyPower(
          exponent,
          -1
        );
      }
    );

    decrements.appendChild(
      button
    );
  }
}

function applyHorizontalScale(
  element
) {
  element.style.transform =
    "";

  const maxWidth =
    element.clientWidth;

  const contentWidth =
    element.scrollWidth;

  if (
    contentWidth <= maxWidth
  ) {
    return;
  }

  const scale =
    maxWidth /
    contentWidth;

  element.style.transformOrigin =
    "left center";

  element.style.transform =
    `scaleX(${scale})`;
}

function renderWeights() {
  weights.innerHTML = "";

  if (DETAIL_LEVEL < 2) {
    return;
  }

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const weight =
      document.createElement(
        "div"
      );

    weight.className =
      "weight";

    const exponent =
      DIGITS - 1 - i;

    weight.innerHTML =
      getWeightExpression(
        BASE,
        exponent
      );

    weights.appendChild(
      weight
    );
  }
}

function renderProducts() {
  products.innerHTML = "";

  if (DETAIL_LEVEL < 3) {
    return;
  }

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const product =
      document.createElement(
        "div"
      );

    product.className =
      "product";

    const digit = displayState[i];

    const exponent =
      DIGITS - 1 - i;

    product.innerHTML =
      getProductExpression(
        digit,
        exponent,
        BASE
      );

    products.appendChild(
      product
    );
  }
}

function renderContributions() {
  contributions.innerHTML =
    "";

  if (DETAIL_LEVEL < 4) {
    return;
  }

  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const contribution =
      document.createElement(
        "div"
      );

    contribution.className =
      "contribution";

    const digit =
      displayState[i];

    const exponent =
      DIGITS - 1 - i;

    contribution.textContent =
      getContributionValue(
        digit,
        exponent,
        BASE
      );

    contributions.appendChild(
      contribution
    );

    applyHorizontalScale(
      contribution
    );
  }
}

function renderDecimalValue() {
  decimalValue.innerHTML =
    "";

  decimalValue.textContent =
    getDecimalValue(
      displayState,
      BASE,
      DIGITS
    );
}

function updateBaseIndicator() {
  cryptex.style.setProperty(
    "--base",
    `"${BASE}"`
  );

  document.documentElement
    .style
    .setProperty(
      "--digits",
      DIGITS
    );
}

function render() {
  for (
    let i = 0;
    i < DIGITS;
    i++
  ) {
    const value = displayState[i];
    cylinders[i].digitsContainer.style.transform = `translateY(-${value * DIGIT_HEIGHT}px)`;
  }
}

function showFloatingAddition(
  index,
  value
) {
  const addition =
    document.createElement(
      "div"
    );

  addition.className =
    "floating-addition";

  addition.textContent =
    `+${value}`;

  const cylinder =
    cylinders[index].cylinder;

  const cylinderRect =
    cylinder.getBoundingClientRect();

  const cryptexRect =
    cryptex.getBoundingClientRect();

  const left =
    cylinderRect.left -
    cryptexRect.left +
    cylinderRect.width / 2;

  addition.style.left =
    `${left}px`;

  floatingAdditions.appendChild(
    addition
  );

  setTimeout(() => {
    addition.remove();
  }, 600);
}

function renderHighlighting() {
  for (let i = 0; i < DIGITS; i++) {
    const cylinder =
      cylinders[i].cylinder;

    cylinder.classList.remove(
      "highlight-increment",
      "highlight-carry",
      "highlight-flow"
    );

    if (
      !activeDigitIndexes.includes(i)
    ) {
      continue;
    }

    if (
      activeHighlightType ===
      "carry"
    ) {
      cylinder.classList.add(
        "highlight-carry"
      );

      continue;
    }

    if (
      activeHighlightType ===
      "flow"
    ) {
      cylinder.classList.add(
        "highlight-flow"
      );

      continue;
    }

    cylinder.classList.add(
      "highlight-increment"
    );
  }
}

function renderAll() {
  renderStructure();

  renderDynamic();
}

function renderStructure() {
  updateBaseIndicator();

  renderIncrementButtons();

  renderDecrementButtons();

  renderIndexes();

  renderWeights();
}

function renderDynamic() {
  render();

  renderHighlighting();

  renderProducts();

  renderContributions();

  renderDecimalValue();


}

async function increment() {
  if (
    ANIMATION_MODE ===
    "flow"
  ) {
    await incrementFlow(
      DIGITS - 1
    );

    return;
  }

  await incrementFromIndex(
    DIGITS - 1
  );
}

function decrement() {
  if (isTransitioning) {
    return;
  }

  let index = DIGITS - 1;

  while (index >= 0) {
    state[index]--;

    if (state[index] >= 0) {
      break;
    }

    state[index] = BASE - 1;

    index--;
  }

  displayState = [...state];

  renderDynamic();
}

function wait(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function getIncrementResult(startIndex) {
  const nextState = [...state];

  const affectedIndexes = [];

  let index = startIndex;

  while (index >= 0) {
    affectedIndexes.push(index);

    nextState[index]++;

    if (nextState[index] < BASE) {
      break;
    }

    nextState[index] = 0;

    index--;
  }

  return {
    nextState,
    affectedIndexes
  };
}

async function incrementFromIndex(startIndex) {
  if (isTransitioning) {
    return;
  }

  isTransitioning = true;

  const previousDisplayState =
    [...displayState];

  const {
    nextState,
    affectedIndexes
  } = getIncrementResult(
    startIndex
  );

  state = nextState;

  displayState =
    [...previousDisplayState];

  let indexPosition = 0;

  while (
    indexPosition <
    affectedIndexes.length
  ) {
    const index =
      affectedIndexes[
      indexPosition
      ];

    activeDigitIndexes = [index];

    displayState[index]++;

    if (
      displayState[index] < BASE
    ) {
      activeHighlightType =
        "increment";

      renderDynamic();

      await wait(300);

      break;
    }

    displayState[index] = 0;

    activeHighlightType =
      "carry";

    renderDynamic();

    await wait(500);

    indexPosition++;
  }

  displayState = [...state];

  activeDigitIndexes = [];

  activeHighlightType = null;

  renderDynamic();

  isTransitioning = false;
}

async function incrementFlow(
  startIndex
) {
  if (isTransitioning) {
    return;
  }

  isTransitioning = true;

  const {
    nextState,
    affectedIndexes
  } = getIncrementResult(
    startIndex
  );

  state = nextState;

  displayState = [...nextState];

  activeDigitIndexes =
    affectedIndexes;

  activeHighlightType =
    "flow";

  const exponent =
    DIGITS - 1 - startIndex;

  const addedValue =
    BASE ** exponent;

  showFloatingAddition(
    startIndex,
    addedValue
  );

  renderDynamic();

  await wait(250);

  activeDigitIndexes = [];

  activeHighlightType = null;

  renderDynamic();

  isTransitioning = false;
}

function startForward() {
  if (isTransitioning) {
    return;
  }
  stopAnimation();

  intervalId = setInterval(async () => {
    if (isTransitioning) {
      return;
    }

    await increment();
  }, ANIMATION_INTERVAL);
}

function startBackward() {
  if (isTransitioning) {
    return;
  }

  stopAnimation();

  intervalId = setInterval(() => {
    if (isTransitioning) {
      return;
    }

    decrement();
  }, ANIMATION_INTERVAL);
}

function resetState() {
  if (isTransitioning) {
    return;
  }
  interruptAnimation();

  state =
    createInitialState(
      DIGITS
    );
  displayState = [...state];

  renderAll();
}

function populateSelect(
  select,
  options,
  defaultValue
) {
  select.innerHTML = "";

  for (
    const optionValue of options
  ) {
    const option =
      document.createElement(
        "option"
      );

    option.value =
      optionValue;

    option.textContent =
      optionValue;

    if (
      optionValue ===
      defaultValue
    ) {
      option.selected = true;
    }

    select.appendChild(
      option
    );
  }
}

resetBtn.addEventListener(
  "click",
  resetState
);

backwardBtn.addEventListener(
  "click",
  startBackward
);

stopBtn.addEventListener(
  "click",
  stopAnimation
);

forwardBtn.addEventListener(
  "click",
  startForward
);

updateBtn.addEventListener(
  "click",
  () => {
    if (isTransitioning) {
      return;
    }
    if (
      isAnimationRunning()
    ) {
      alert(
        "Detén la animación antes de actualizar."
      );

      return;
    }

    const parsedState =
      parseInputValue(
        numberInput.value,
        BASE,
        DIGITS
      );

    if (
      parsedState === null
    ) {
      alert(
        "Número inválido para la base actual."
      );

      return;
    }

    state = parsedState;
    displayState = [...state];

    renderAll();
  }
);

animationModeSelect.addEventListener(
  "change",
  () => {
    ANIMATION_MODE =
      animationModeSelect.value;
  }
);

populateSelect(
  baseSelect,
  BASE_OPTIONS,
  DEFAULT_BASE
);

populateSelect(
  digitsSelect,
  DIGIT_OPTIONS,
  DEFAULT_DIGITS
);

buildCryptex();
