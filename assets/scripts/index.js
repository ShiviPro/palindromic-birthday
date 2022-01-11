const primaryContent = document.querySelector("#primary-content");
const checkBtn = document.querySelector("#check-btn");

const loading = document.createElement("div");
loading.classList.add("loading");
primaryContent.appendChild(loading);
loading.style.display = "none";

const output = document.createElement("div");
output.classList.add("output");
output.innerHTML = `
  <h2>Result will be shown here</h2>
`;
primaryContent.appendChild(output);

const getDateFormats = (day, month, year) => {
  const dateFormats = [
    {
      name: "DD/MM/YYYY",
      value: day + month + year,
      formattedStr: day + "/" + month + "/" + year,
    },
    {
      name: "MM/DD/YYYY",
      value: month + day + year,
      formattedStr: month + "/" + day + "/" + year,
    },
    {
      name: "MM/YYYY/DD",
      value: month + year + day,
      formattedStr: month + "/" + year + "/" + day,
    },
    {
      name: "DD/YYYY/MM",
      value: day + year + month,
      formattedStr: day + "/" + year + "/" + month,
    },
    {
      name: "YYYY/DD/MM",
      value: year + day + month,
      formattedStr: year + "/" + day + "/" + month,
    },
    {
      name: "YYYY/MM/DD",
      value: year + month + day,
      formattedStr: year + "/" + month + "/" + day,
    },
  ];
  return dateFormats;
};

const nonLeapYearMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leapYearMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const calculateForwardPalindrome = (day, month, year, noOfForwardDays) => {
  const yearInt = parseInt(year);
  const monthInt = parseInt(month);
  let dayInt = parseInt(day);

  let isLeapYear = false;
  if (yearInt % 4 === 0) {
    if (yearInt % 100 !== 0 || (yearInt % 100 === 0 && yearInt % 400 !== 0))
      isLeapYear = true;
  }

  let months = undefined;
  if (isLeapYear) months = leapYearMonths;
  else months = nonLeapYearMonths;

  const maxNoOfDaysInCurrMonth = months[monthInt - 1];

  dayInt += 1;
  noOfForwardDays += 1;

  if (dayInt > maxNoOfDaysInCurrMonth) {
    if (monthInt !== 12)
      return calculateForwardPalindrome(
        "01",
        (monthInt + 1).toString().padStart(2, "0"),
        yearInt.toString().padStart(4, "0"),
        noOfForwardDays
      );
    else
      return calculateForwardPalindrome(
        "01",
        "01",
        (yearInt + 1).toString().padStart(4, "0"),
        noOfForwardDays
      );
  }

  const dateFormats = getDateFormats(
    dayInt.toString().padStart(2, "0"),
    monthInt.toString().padStart(2, "0"),
    yearInt.toString().padStart(4, "0")
  );

  let res = undefined;
  let isPalindrome = false;
  dateFormats.forEach(dateFormat => {
    const date = dateFormat.value;
    const dateRev = date.split("").reverse().join("");
    if (dateRev === date) {
      res = [dateFormat.formattedStr, noOfForwardDays, dateFormat.name];
      isPalindrome = true;
      return;
    }
  });
  if (isPalindrome) return res;

  return calculateForwardPalindrome(
    dayInt.toString().padStart(2, "0"),
    monthInt.toString().padStart(2, "0"),
    yearInt.toString().padStart(4, "0"),
    noOfForwardDays
  );
};

const calculateBackwardPalindrome = (day, month, year, noOfBackwardDays) => {
  const yearInt = parseInt(year);
  const monthInt = parseInt(month);
  let dayInt = parseInt(day);

  let isLeapYear = false;
  if (yearInt % 4 === 0) {
    if (yearInt % 100 !== 0 || (yearInt % 100 === 0 && yearInt % 400 !== 0))
      isLeapYear = true;
  }

  let months = undefined;
  if (isLeapYear) months = leapYearMonths;
  else months = nonLeapYearMonths;

  let maxNoOfDaysInPrevMonth = undefined;
  if (monthInt - 2 >= 0) maxNoOfDaysInPrevMonth = months[monthInt - 2];
  else maxNoOfDaysInPrevMonth = 31;
  
  const minNoOfDaysInCurrMonth = 1;

  dayInt -= 1;
  noOfBackwardDays += 1;

  if (dayInt < minNoOfDaysInCurrMonth) {
    if (monthInt > 1)
      return calculateBackwardPalindrome(
        maxNoOfDaysInPrevMonth.toString().padStart(2, "0"),
        (monthInt - 1).toString().padStart(2, "0"),
        yearInt.toString().padStart(4, "0"),
        noOfBackwardDays
      );
    else
      return calculateBackwardPalindrome(
        maxNoOfDaysInPrevMonth.toString().padStart(2, "0"),
        months.length.toString().padStart(2, "0"),
        (yearInt - 1).toString().padStart(4, "0"),
        noOfBackwardDays
      );
  }

  const dateFormats = getDateFormats(
    dayInt.toString().padStart(2, "0"),
    monthInt.toString().padStart(2, "0"),
    yearInt.toString().padStart(4, "0")
  );

  let res = undefined;
  let isPalindrome = false;
  dateFormats.forEach(dateFormat => {
    const date = dateFormat.value;
    const dateRev = date.split("").reverse().join("");
    if (dateRev === date) {
      res = [dateFormat.formattedStr, noOfBackwardDays, dateFormat.name];
      isPalindrome = true;
      return;
    }
  });
  if (isPalindrome) return res;

  return calculateBackwardPalindrome(
    dayInt.toString().padStart(2, "0"),
    monthInt.toString().padStart(2, "0"),
    yearInt.toString().padStart(4, "0"),
    noOfBackwardDays
  );
};

checkBtn.addEventListener("click", () => {
  loading.style.display = "block";
  output.style.opacity = 0;
  setTimeout(() => {
    let isDOBEmpty = false;

    const dobVal = document.querySelector("#dob-input").value;

    let endVal = dobVal.indexOf("-");
    const year = dobVal.substring(0, endVal);
    let remDobVal = dobVal.substring(endVal + 1);
    endVal = remDobVal.indexOf("-");
    const month = remDobVal.substring(0, endVal);
    remDobVal = remDobVal.substring(endVal + 1);
    const day = remDobVal;

    if (day === "" || month === "" || year === "") {
      output.innerHTML = `
      <h2>Hmmm.. trying to enter nothing. That's smart. <i class="fas fa-smile-wink"></i></h2>
      `;
      isDOBEmpty = true;
    }

    if (!isDOBEmpty) {
      const dateFormats = getDateFormats(day, month, year);

      let isPalindrome = false;
      dateFormats.forEach(dateFormat => {
        const date = dateFormat.value;
        const dateRev = date.split("").reverse().join("");
        if (dateRev === date) {
          output.innerHTML = `
            <h2>Congratulations ! <i class="fas fa-smile-beam"></i> Your birthdate is palindrome</h2>
            <h2 class="output__format">Format selected: ${dateFormat.name}</h2>
            <h2 class = "output__date">DOB selected: ${dateFormat.formattedStr}</h2>
          `;
          isPalindrome = true;
          return;
        }
      });
      if (!isPalindrome) {
        output.innerHTML = `<h2>We're sorry <i class="fas fa-sad-tear"></i> to inform that your DOB is not a palindrome in any way possible.</h2>`;

        const [forwardDate, noOfForwardDays, forwardDateFormat] =
          calculateForwardPalindrome(day, month, year, 0);
        const [backwardDate, noOfBackwardDays, backwardDateFormat] =
          calculateBackwardPalindrome(day, month, year, 0);

        if (noOfForwardDays <= noOfBackwardDays) {
          output.innerHTML += `
        <h2 class="output__text">The nearest date from your birthdate would be ${forwardDate} in ${forwardDateFormat} format.</h2>
        <h2 class="output__text">You missed it by ${noOfForwardDays} days.</h2>
        `;
        } else {
          output.innerHTML += `
        <h2 class="output__text">The nearest date from your birthdate would be ${backwardDate} in ${backwardDateFormat} format.</h2>
        <h2 class="output__text">You missed it by ${noOfBackwardDays} days.</h2>
        `;
        }
      }
    }
    loading.style.display = "none";
    output.style.opacity = 1;
  }, 1500);
});

let currentTheme = "GreenOnBlue";
const themeToggler = document.querySelector(".navbar__brand--theme-toggler");
const themeToggle = document.querySelector(
  ".navbar__brand--theme-toggler__toggle"
);

themeToggler.addEventListener("click", () => {
  if (currentTheme === "GreenOnBlue") {
    themeToggle.classList.add("moveRight");
    currentTheme = "BlueOnGreen";

    document.body.classList.add(".body--dark");

    document
      .querySelector(".navbar__brand")
      .classList.add("navbar__brand--dark");

    document
      .querySelector(".navbar__brand--theme-toggler")
      .classList.add("navbar__brand--theme-toggler--dark");

    document
      .querySelector(".navbar__brand--theme-toggler__toggle")
      .classList.add("navbar__brand--theme-toggler__toggle--dark");

    document.querySelector(".hero").classList.add("hero--dark");

    document.querySelector(".hero__link").classList.add("hero__link--dark");

    document.querySelector(".src-link").classList.add("src-link--dark");

    document.querySelector(".hero__image").innerHTML = `
    <use xlink:href="#calendar-img--dark" />
    `;
    document.querySelector(".hero__image").classList.add("hero__image--dark");

    document
      .querySelector(".primary-content")
      .classList.add("primary-content--dark");

    document
      .querySelector(".primary-content__dob-input")
      .classList.add("primary-content__dob-input--dark");

    document
      .querySelector(".primary-content__check-btn")
      .classList.add("primary-content__check-btn--dark");

    document.querySelector(".loading").classList.add("loading--dark");

    document.querySelector(".footer").classList.add("footer--dark");

    document.querySelectorAll(".footer__links").forEach((footerLink) => {
      footerLink.classList.add("footer__links--dark");
    });
  } else {
    themeToggle.classList.remove("moveRight");
    currentTheme = "GreenOnBlue";

    document.body.classList.remove(".body--dark");

    document
      .querySelector(".navbar__brand")
      .classList.remove("navbar__brand--dark");

    document
      .querySelector(".navbar__brand--theme-toggler")
      .classList.remove("navbar__brand--theme-toggler--dark");

    document
      .querySelector(".navbar__brand--theme-toggler__toggle")
      .classList.remove("navbar__brand--theme-toggler__toggle--dark");

    document.querySelector(".hero").classList.remove("hero--dark");

    document.querySelector(".hero__link").classList.remove("hero__link--dark");

    document.querySelector(".src-link").classList.remove("src-link--dark");

    document.querySelector(".hero__image").innerHTML = `
    <use xlink:href="#calendar-img" />
    `;
    document
      .querySelector(".hero__image")
      .classList.remove("hero__image--dark");

    document
      .querySelector(".primary-content")
      .classList.remove("primary-content--dark");

    document
      .querySelector(".primary-content__dob-input")
      .classList.remove("primary-content__dob-input--dark");

    document
      .querySelector(".primary-content__check-btn")
      .classList.remove("primary-content__check-btn--dark");

    document.querySelector(".loading").classList.remove("loading--dark");

    document.querySelector(".footer").classList.remove("footer--dark");

    document.querySelectorAll(".footer__links").forEach((footerLink) => {
      footerLink.classList.remove("footer__links--dark");
    });
  }
});
