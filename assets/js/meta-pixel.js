/* =========================================================================
   Meta (Facebook/Instagram) Pixel — central install
   -------------------------------------------------------------------------
   HOW TO GO LIVE:
   1. In Meta Events Manager, copy your Pixel/Dataset ID (a 15-16 digit number).
   2. Replace the placeholder below (META_PIXEL_ID) with that number.
   3. Bump the ?v= number on the <script src="assets/js/meta-pixel.js?v=1">
      tags in the HTML <head> so browsers fetch the new file.

   This single file is included on every page, so the Pixel ID lives in ONE
   place. PageView fires automatically on every page. The Lead conversion
   event fires from thank-you.html via window.aheTrackLead().
   ========================================================================= */

(function () {
  // ⬇⬇⬇  REPLACE THIS with your real Meta Pixel ID before running ads  ⬇⬇⬇
  var META_PIXEL_ID = "YOUR_META_PIXEL_ID";
  // ⬆⬆⬆  (e.g. "1234567890123456")  ⬆⬆⬆

  // Don't load the pixel until a real ID is set — avoids console errors
  // and accidental bad data while the site is still in placeholder mode.
  if (!META_PIXEL_ID || META_PIXEL_ID === "YOUR_META_PIXEL_ID") {
    window.aheTrackLead = function () {
      console.info("[Meta Pixel] Lead event skipped — set META_PIXEL_ID in assets/js/meta-pixel.js");
    };
    return;
  }

  // Standard Meta Pixel base code
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");

  // Call this on the conversion (thank-you) page to record a lead.
  window.aheTrackLead = function (params) {
    if (window.fbq) {
      window.fbq("track", "Lead", params || {});
    }
  };
})();
