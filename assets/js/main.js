const toggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const overlay = document.querySelector("[data-overlay]");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
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

navDropdownToggles.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const parent = btn.closest(".nav-dropdown");
    const isOpen = parent.classList.contains("is-open");
    document.querySelectorAll(".nav-dropdown.is-open").forEach((open) => {
      open.classList.remove("is-open");
    });
    if (!isOpen) {
      parent.classList.add("is-open");
    }
    event.stopPropagation();
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach((open) => {
    open.classList.remove("is-open");
  });
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

const SUPABASE_URL = "https://hpjpoqpwowcvargwrwpn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanBvcXB3b3djdmFyZ3dyd3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDA1NzAsImV4cCI6MjA4NTc3NjU3MH0.u0g-9ggMIMkDxaLQMJ1UmRy7RmINIgpes8wbSAVG3JA";
const EMAILJS_PUBLIC_KEY = "UDi_HinNkNwLWG9qx";
const EMAILJS_SERVICE_ID = "service_gkk6k9k";
const EMAILJS_ADMIN_TEMPLATE_ID = "template_qx2shzh";

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
    if (!supabaseClient && EMAILJS_SERVICE_ID.startsWith("YOUR_")) {
      setStatus(detailsStatus, "Please configure Supabase or EmailJS before deploying.", true);
      return;
    }
    setStatus(detailsStatus, "Uploading...");

    const formData = new FormData(detailsForm);
    const attachment = formData.get("attachment");
    let fileUrl = "";

    try {
      // Upload file to Supabase storage if provided
      if (supabaseClient && attachment && attachment.name) {
        try {
          const filePath = `uploads/${Date.now()}-${attachment.name}`;
          const { error: uploadError } = await supabaseClient.storage.from("assignments").upload(filePath, attachment, {
            cacheControl: '3600',
            upsert: false
          });
          
          if (uploadError) {
            console.error("Upload error:", uploadError);
            // If upload fails due to RLS, continue without file URL
            if (uploadError.message.includes("row-level security") || uploadError.message.includes("RLS")) {
              setStatus(detailsStatus, "Warning: File upload failed due to security policy. Please configure RLS policies in Supabase. Continuing with form submission...");
            } else {
              throw uploadError;
            }
          } else {
            const { data } = supabaseClient.storage.from("assignments").getPublicUrl(filePath);
            fileUrl = data.publicUrl || "";
          }
        } catch (uploadErr) {
          console.error("File upload error:", uploadErr);
          // Continue with form submission even if file upload fails
          setStatus(detailsStatus, "Warning: File could not be uploaded. Form will be submitted without attachment.");
        }
      }

      // Get stored data from sessionStorage
      const assignmentType = sessionStorage.getItem("assignmentType") || "";
      const projectTitle = sessionStorage.getItem("projectTitle") || "";

      // Prepare payload with only columns that exist in the requests table
      const payload = {
        email: formData.get("email"),
        description: formData.get("description"),
        deadline: formData.get("deadline"),
        invite: formData.get("invite") || "",
        auto_match: formData.get("auto_match"),
        file_url: fileUrl,
        created_at: new Date().toISOString(),
        form: "details",
      };

      // Save to Supabase (only existing columns)
      if (supabaseClient) {
        const { error } = await supabaseClient.from("requests").insert(payload);
        if (error) {
          console.error("Database error:", error);
          throw error;
        }
      }

      // Prepare email message with all details including type and project title
      const emailMessage = `Assignment Type: ${assignmentType || "Not specified"}\nProject Title: ${projectTitle || "Not specified"}\nDescription: ${payload.description}\nDeadline: ${payload.deadline}\nAuto Match: ${payload.auto_match === "yes" ? "Yes" : "No"}\n${payload.invite ? `Invited Expert: ${payload.invite}\n` : ""}${fileUrl ? `File URL: ${fileUrl}` : "No file attached"}`;

      // Send admin notification email with file URL
      await sendEmails({
        client_email: payload.email,
        subject: "Assignment request submitted",
        type: assignmentType || "Assignment",
        message: emailMessage,
        deadline: payload.deadline,
        file_url: fileUrl || "No file attached",
      });

      // Clear sessionStorage
      sessionStorage.removeItem("assignmentType");
      sessionStorage.removeItem("projectTitle");
      sessionStorage.removeItem("assignmentEmail");

      detailsForm.reset();
      setStatus(detailsStatus, "Submitted! We will review your request and contact you shortly.");
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setStatus(detailsStatus, "Upload failed. Please try again.", true);
    }
  });
}
