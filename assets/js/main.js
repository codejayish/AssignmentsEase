const toggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const overlay = document.querySelector("[data-overlay]");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when clicking on a regular nav link (not a dropdown toggle)
  const regularNavLinks = navLinks.querySelectorAll("a:not(.nav-dropdown-toggle)");
  regularNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const cards = document.querySelectorAll("[data-expandable]");

const closeAllCards = () => {
  cards.forEach((card) => card.classList.remove("is-open"));
  if (overlay) {
    overlay.classList.remove("is-visible");
  }
};

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const isClose = event.target.closest("[data-close-card]");
    if (isClose) {
      event.stopPropagation();
      closeAllCards();
      return;
    }

    const alreadyOpen = card.classList.contains("is-open");
    closeAllCards();
    if (!alreadyOpen) {
      card.classList.add("is-open");
      if (overlay) {
        overlay.classList.add("is-visible");
      }
    }
  });
});

if (overlay) {
  overlay.addEventListener("click", closeAllCards);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllCards();
  }
});

// Nav dropdown toggles (for mobile / click)
const navDropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
let closeDropdownTimeout;

navDropdownToggles.forEach((btn) => {
  const parent = btn.closest(".nav-dropdown");
  if (!parent) return;

  const menu = parent.querySelector(".nav-dropdown-menu");
  
  btn.addEventListener("click", (event) => {
    clearTimeout(closeDropdownTimeout);
    const isOpen = parent.classList.contains("is-open");
    document.querySelectorAll(".nav-dropdown.is-open").forEach((open) => {
      if (open !== parent) {
        open.classList.remove("is-open");
      }
    });
    if (!isOpen) {
      parent.classList.add("is-open");
    } else {
      parent.classList.remove("is-open");
    }
    event.stopPropagation();
  });

  // Prevent closing when clicking inside the dropdown menu
  if (menu) {
    menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  // Add hover effect for desktop: keep menu open while hovering over parent or menu
  parent.addEventListener("mouseenter", () => {
    clearTimeout(closeDropdownTimeout);
  });

  parent.addEventListener("mouseleave", () => {
    closeDropdownTimeout = setTimeout(() => {
      parent.classList.remove("is-open");
    }, 150);
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    document.querySelectorAll(".nav-dropdown.is-open").forEach((open) => {
      open.classList.remove("is-open");
    });
  }
});

// Simple horizontal scroll controls for experts carousel
const expertsCarousel = document.querySelector("[data-experts-carousel]");
const expertsPrev = document.querySelector("[data-experts-prev]");
const expertsNext = document.querySelector("[data-experts-next]");

if (expertsCarousel && expertsPrev && expertsNext) {
  const scrollAmount = 320; // roughly one card

  expertsPrev.addEventListener("click", () => {
    expertsCarousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  expertsNext.addEventListener("click", () => {
    expertsCarousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

// Reviews carousel: circular left/right navigation
const reviewsCarousel = document.querySelector("[data-reviews-carousel]");
const reviewsPrev = document.querySelector("[data-reviews-prev]");
const reviewsNext = document.querySelector("[data-reviews-next]");

if (reviewsCarousel && reviewsPrev && reviewsNext) {
  const getScrollAmount = () => Math.max(280, Math.round(reviewsCarousel.clientWidth * 0.8));

  const scrollToStart = () => {
    reviewsCarousel.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToEnd = () => {
    const max = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
    reviewsCarousel.scrollTo({ left: max, behavior: "smooth" });
  };

  reviewsPrev.addEventListener("click", () => {
    const max = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
    const amount = getScrollAmount();
    if (reviewsCarousel.scrollLeft <= 1) {
      // wrap to end
      reviewsCarousel.scrollTo({ left: max, behavior: "smooth" });
    } else if (reviewsCarousel.scrollLeft - amount <= 0) {
      reviewsCarousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      reviewsCarousel.scrollBy({ left: -amount, behavior: "smooth" });
    }
  });

  reviewsNext.addEventListener("click", () => {
    const max = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
    const amount = getScrollAmount();
    if (Math.ceil(reviewsCarousel.scrollLeft) >= max - 1) {
      // wrap to start
      reviewsCarousel.scrollTo({ left: 0, behavior: "smooth" });
    } else if (reviewsCarousel.scrollLeft + amount >= max) {
      reviewsCarousel.scrollTo({ left: max, behavior: "smooth" });
    } else {
      reviewsCarousel.scrollBy({ left: amount, behavior: "smooth" });
    }
  });
}

const helpForm = document.querySelector("#form-help");
const detailsForm = document.querySelector("#form-details");
const helpStatus = document.querySelector("[data-status-help]");
const detailsStatus = document.querySelector("[data-status-details]");

const SUPABASE_URL = "https://wghchidyrpolghlitdgv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XdYFndKqAXrwW7YpZLw71Q_S4ABc2Ka";
const EMAILJS_PUBLIC_KEY = "b09ge3dCr0RT1ytli";
const EMAILJS_SERVICE_ID = "service_ngow86b";
const EMAILJS_ADMIN_TEMPLATE_ID = "template_w7aeu26";

const setStatus = (el, message, isError = false) => {
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", isError);
};

const initEmail = () => {
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

const initSupabase = () => {
  if (!window.supabase) return null;
  if (SUPABASE_URL === "YOUR_SUPABASE_URL" || SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
    return null;
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

const supabaseClient = initSupabase();
initEmail();

const sendEmails = async (templateParams) => {
  if (!window.emailjs) return;
  if (EMAILJS_SERVICE_ID.startsWith("YOUR_")) return;
  await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, templateParams);
};

// Handle Get Help form submission (on index.html)
if (helpForm) {
  helpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const formData = new FormData(helpForm);
    const type = formData.get("type");
    const projectTitle = formData.get("project_title");
    const email = formData.get("email");

    // Store form data in sessionStorage to pass to next page
    sessionStorage.setItem("assignmentType", type);
    sessionStorage.setItem("projectTitle", projectTitle);
    sessionStorage.setItem("assignmentEmail", email);

    // Navigate to submit page
    window.location.href = "submit.html";
  });
}

// Handle details form submission (on submit.html)
if (detailsForm) {
  // Pre-fill email from sessionStorage if available
  const storedEmail = sessionStorage.getItem("assignmentEmail");
  if (storedEmail) {
    const emailInput = detailsForm.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.value = storedEmail;
    }
  }

  detailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(detailsStatus, "Submitting...");

    const formData = new FormData(detailsForm);
    const attachment = formData.get("attachment");
    const assignmentType = sessionStorage.getItem("assignmentType") || "";
    const projectTitle  = sessionStorage.getItem("projectTitle") || "";
    let fileUrl = "";

    // Step 1: file upload (non-fatal)
    if (supabaseClient && attachment && attachment.name) {
      try {
        const filePath = `uploads/${Date.now()}-${attachment.name}`;
        const { error: uploadError } = await supabaseClient.storage
          .from("assignments").upload(filePath, attachment, { cacheControl: "3600", upsert: false });
        if (uploadError) {
          console.warn("File upload skipped:", uploadError.message);
        } else {
          const { data } = supabaseClient.storage.from("assignments").getPublicUrl(filePath);
          fileUrl = data.publicUrl || "";
        }
      } catch (e) {
        console.warn("File upload error:", e);
      }
    }

    const payload = {
      email:       formData.get("email"),
      description: formData.get("description"),
      deadline:    formData.get("deadline"),
      invite:      formData.get("invite") || "",
      auto_match:  formData.get("auto_match"),
      file_url:    fileUrl,
      form:        "details",
    };

    // Step 2: save to Supabase — track success so a saved lead always counts.
    let savedToDb = false;
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from("requests").insert(payload);
        if (error) {
          console.warn("Supabase insert failed:", error.message);
        } else {
          savedToDb = true;
        }
      } catch (e) {
        console.warn("Supabase error:", e);
      }
    }

    // Step 3: send notification email — track success independently.
    let emailSent = false;
    try {
      const emailMessage =
        `Assignment Type: ${assignmentType || "Not specified"}\n` +
        `Project Title: ${projectTitle || "Not specified"}\n` +
        `Description: ${payload.description}\n` +
        `Deadline: ${payload.deadline}\n` +
        `Auto Match: ${payload.auto_match === "yes" ? "Yes" : "No"}\n` +
        (payload.invite ? `Invited Expert: ${payload.invite}\n` : "") +
        (fileUrl ? `File URL: ${fileUrl}` : "No file attached");

      await sendEmails({
        to_email:     "support@assignmenthelpglobal.com",
        client_email: payload.email,
        subject:      "New Assignment Request: " + (assignmentType || "Assignment"),
        type:         assignmentType || "Assignment",
        message:      emailMessage,
        deadline:     payload.deadline,
        file_url:     fileUrl || "No file attached",
      });
      emailSent = true;
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    // Treat as success if the lead was captured by EITHER channel, so a paid
    // ad lead is never silently lost just because one service was down.
    if (savedToDb || emailSent) {
      sessionStorage.removeItem("assignmentType");
      sessionStorage.removeItem("projectTitle");
      sessionStorage.removeItem("assignmentEmail");
      detailsForm.reset();
      setStatus(detailsStatus, "Submitted! Redirecting…");
      window.location.href = "thank-you.html";
    } else {
      setStatus(detailsStatus, "We couldn't submit your request automatically. Please email us directly at support@assignmenthelpglobal.com", true);
    }
  });
}

