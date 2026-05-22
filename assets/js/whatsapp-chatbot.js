/* Ensures one WhatsApp float button exists (CSS in whatsapp-chatbot.css) */
(function () {
  const WHATSAPP_URL =
    "https://wa.me/919391738281?text=Hi%20AssignmentEase%2C%20I%20need%20help%20with%20my%20assignment.";

  const SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.29A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.64 13.14c-.2.56-1.17 1.08-1.63 1.15-.42.06-.96.09-1.56-.1-.36-.11-.83-.26-1.44-.51-2.53-1.09-4.18-3.63-4.31-3.8-.12-.17-1.03-1.37-1.03-2.61s.65-1.85.88-2.1c.23-.25.5-.31.67-.31.17 0 .34 0 .49.01.16.01.37-.06.58.44.2.51.69 1.78.75 1.91.06.13.1.28.02.45-.08.17-.12.28-.24.43-.12.15-.25.34-.36.46-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.93 1.18.25.12.4.1.54-.06.14-.17.58-.68.74-.91.16-.23.32-.19.54-.12.23.08 1.43.67 1.68.79.25.12.42.18.48.28.06.1.06.58-.14 1.14z"/></svg>';

  function ensureChatbot() {
    document.querySelectorAll(".whatsapp-chatbot, #whatsapp-float-btn").forEach((el, i) => {
      if (i > 0) el.remove();
    });

    let btn = document.getElementById("whatsapp-float-btn");
    if (!btn) {
      btn = document.querySelector(".whatsapp-chatbot");
    }

    if (!btn) {
      btn = document.createElement("a");
      btn.id = "whatsapp-float-btn";
      btn.className = "whatsapp-chatbot";
      btn.href = WHATSAPP_URL;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.setAttribute("aria-label", "Chat with us on WhatsApp");
      btn.title = "Chat on WhatsApp";
      btn.innerHTML = SVG;
      document.body.appendChild(btn);
    } else {
      btn.id = "whatsapp-float-btn";
      btn.classList.add("whatsapp-chatbot");
      if (!btn.getAttribute("href")) btn.href = WHATSAPP_URL;
      if (!btn.querySelector("svg")) btn.innerHTML = SVG;
      document.body.appendChild(btn);
    }
  }

  ensureChatbot();
  document.addEventListener("DOMContentLoaded", ensureChatbot);
  window.addEventListener("load", ensureChatbot);
})();
