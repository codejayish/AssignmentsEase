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

if (helpForm) {
  helpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseClient && EMAILJS_SERVICE_ID.startsWith("YOUR_")) {
      setStatus(helpStatus, "Please configure Supabase or EmailJS before deploying.", true);
      return;
    }
    setStatus(helpStatus, "Sending...");

    const formData = new FormData(helpForm);
    const payload = {
      subject: formData.get("subject"),
      type: formData.get("type"),
      email: formData.get("email"),
      created_at: new Date().toISOString(),
      form: "help",
    };

    try {
      if (supabaseClient) {
        const { error } = await supabaseClient.from("leads").insert(payload);
        if (error) throw error;
      }
      await sendEmails({
        client_email: payload.email,
        subject: payload.subject,
        type: payload.type,
        message:
          "Thanks for contacting AssignmentEase. We provide genuine service and will shortly share a price quotation with the most affordable options. Thank you!",
      });

      helpForm.reset();
      setStatus(helpStatus, "Submitted! We will contact you shortly.");
    } catch (error) {
      setStatus(helpStatus, "Something went wrong. Please try again.", true);
    }
  });
}

if (detailsForm) {
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
      if (supabaseClient && attachment && attachment.name) {
        const filePath = `uploads/${Date.now()}-${attachment.name}`;
        const { error } = await supabaseClient.storage.from("assignments").upload(filePath, attachment);
        if (error) throw error;
        const { data } = supabaseClient.storage.from("assignments").getPublicUrl(filePath);
        fileUrl = data.publicUrl || "";
      }

      const payload = {
        email: formData.get("email"),
        description: formData.get("description"),
        deadline: formData.get("deadline"),
        invite: formData.get("invite"),
        auto_match: formData.get("auto_match"),
        file_url: fileUrl,
        created_at: new Date().toISOString(),
        form: "details",
      };

      if (supabaseClient) {
        const { error } = await supabaseClient.from("requests").insert(payload);
        if (error) throw error;
      }

      await sendEmails({
        client_email: payload.email,
        subject: "Assignment request submitted",
        type: payload.auto_match === "yes" ? "Auto match" : "Invite expert",
        message:
          "Thanks for contacting AssignmentEase. We provide genuine service and will shortly share a price quotation with the most affordable options. Thank you!",
        deadline: payload.deadline,
        file_url: payload.file_url,
      });

      detailsForm.reset();
      setStatus(detailsStatus, "Submitted! We will review your request.");
    } catch (error) {
      setStatus(detailsStatus, "Upload failed. Please try again.", true);
    }
  });
}
