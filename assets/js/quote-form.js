document.addEventListener("DOMContentLoaded", function () {

    let pages = 1;

    const pagesText = document.getElementById("pages");
    const priceText = document.querySelector(".new-price");
    const oldPriceText = document.querySelector(".old-price");

    const plusBtn = document.getElementById("plus");
    const minusBtn = document.getElementById("minus");

    // $10/page, capped at $120
    function calcPrice(n) {
      return Math.min(n * 10, 120);
    }

    // ======================
    // COUNTER LOGIC
    // ======================
    function updateUI() {
      const words = pages * 275;
      const label = pages === 1 ? "page" : "pages";

      if (pagesText) {
        pagesText.textContent = `${pages} ${label} / ${words} words`;
      }

      const discountedPrice = calcPrice(pages);
      const originalPrice = Math.round(discountedPrice * 1.3);

      if (oldPriceText) {
        oldPriceText.textContent = `$${originalPrice.toFixed(2)}`;
      }

      if (priceText) {
        priceText.textContent = `$${discountedPrice.toFixed(2)}`;
      }
    }
  
    if (plusBtn) {
      plusBtn.addEventListener("click", function () {
        pages++;
        updateUI();
      });
    }
  
    if (minusBtn) {
      minusBtn.addEventListener("click", function () {
        if (pages > 1) {
          pages--;
          updateUI();
        }
      });
    }
  
    updateUI();
  
  
    // ======================
    // GET HELP FORM
    // ======================
    const helpForm = document.getElementById("form-help");
  
    if (helpForm) {
      helpForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const formData = new FormData(helpForm);
  
        sessionStorage.setItem("assignmentType", formData.get("type") || "");
        sessionStorage.setItem("projectTitle", formData.get("project_title") || "");
        sessionStorage.setItem("assignmentEmail", formData.get("email") || "");
        sessionStorage.setItem("pages", pages);
  
        window.location.href = "submit.html";
      });
    }
  
  
    // ======================
    // GET QUOTE FORM
    // ======================
    const quoteForm = document.getElementById("form-quote");
  
    if (quoteForm) {
      quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const formData = new FormData(quoteForm);
  
        sessionStorage.setItem("assignmentType", formData.get("projectType") || "");
        sessionStorage.setItem("educationLevel", formData.get("educationLevel") || "");
        sessionStorage.setItem("deadline", formData.get("deadline") || "");
        sessionStorage.setItem("pages", pages);
  
        window.location.href = "submit.html";
      });
    }
  
  
    // ======================
    // FORM SWITCHING LOGIC
    // ======================
    const helpWrapper = document.querySelector(".help-form-wrapper");
    const quoteWrapper = document.querySelector(".quote-form-wrapper");
  
    const logoBtn = document.getElementById("logoBtn");
    const quoteBtn = document.getElementById("quoteBtn");
  
    function showHelpForm() {
      if (helpWrapper) helpWrapper.style.display = "block";
      if (quoteWrapper) quoteWrapper.style.display = "none";
    }
  
    function showQuoteForm() {
      if (helpWrapper) helpWrapper.style.display = "none";
      if (quoteWrapper) quoteWrapper.style.display = "block";
    }
  
    if (logoBtn) {
      logoBtn.addEventListener("click", function (e) {
        e.preventDefault();
        showHelpForm();
      });
    }
  
    if (quoteBtn) {
      quoteBtn.addEventListener("click", function (e) {
        e.preventDefault();
        showQuoteForm();
      });
    }
  
  });
  