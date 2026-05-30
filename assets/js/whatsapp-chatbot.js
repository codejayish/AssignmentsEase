(function () {
  'use strict';

  var WA_URL = 'https://wa.me/919391738281?text=Hi%20Assignment%20Help%20Global%2C%20I%20need%20help%20with%20my%20assignment.';

  /* Official-style WhatsApp icon path */
  var WA_ICON = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path fill="#fff" d="M16 4C9.373 4 4 9.373 4 16c0 2.246.617 4.35 1.69 6.152L4 28l5.99-1.572A11.938 11.938 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 4 16 4zm5.863 16.594c-.243.682-1.426 1.311-1.982 1.397-.507.077-1.148.11-1.853-.117-.43-.136-.984-.317-1.693-.618-2.98-1.285-4.929-4.278-5.079-4.478-.145-.2-1.182-1.572-1.182-2.998 0-1.425.748-2.126 1.013-2.415.264-.29.576-.362.768-.362.192 0 .384 0 .552.008.177.009.415-.067.649.495.243.579.825 2.018.899 2.163.074.145.124.314.025.502-.099.188-.149.307-.297.472-.149.166-.312.37-.447.5-.148.14-.302.293-.13.574.173.282.769 1.265 1.65 2.049 1.133.997 2.088 1.306 2.382 1.454.294.148.466.124.64-.074.173-.198.74-.864.938-1.16.197-.296.394-.247.66-.148.265.099 1.688.797 1.978.942.29.145.483.217.556.337.074.12.074.698-.17 1.377z"/></svg>';

  var CHAT_HTML = [
    /* ── Header ── */
    '<div class="wa-cp-header">',
    '  <div class="wa-cp-avatar">', WA_ICON, '</div>',
    '  <div class="wa-cp-meta">',
    '    <span class="wa-cp-name">Assignment Help Global</span>',
    '    <span class="wa-cp-status"><span class="wa-cp-status-dot"></span>Online now</span>',
    '  </div>',
    '  <a class="wa-cp-open" href="' + WA_URL + '" target="_blank" rel="noopener noreferrer">Open ↗</a>',
    '</div>',

    /* ── Messages ── */
    '<div class="wa-cp-body">',

    /* Outgoing: student query */
    '  <div class="wa-cp-msg wa-cp-msg-out">',
    '    <div class="wa-cp-bubble">Hi! I need help with my Statistics assignment due tonight &#128218;</div>',
    '    <div class="wa-cp-time">2:41 PM <span class="wa-cp-ticks">&#10003;&#10003;</span></div>',
    '  </div>',

    /* Incoming: AE reply */
    '  <div class="wa-cp-msg wa-cp-msg-in">',
    '    <div class="wa-cp-bubble">Hey! &#128075; We&#8217;ve got verified stats experts online right now. Share the details and get matched in minutes!</div>',
    '    <div class="wa-cp-time">2:41 PM</div>',
    '  </div>',

    /* Typing dots */
    '  <div class="wa-cp-typing"><span></span><span></span><span></span></div>',

    '</div>',

    /* ── CTA footer ── */
    '<div class="wa-cp-footer">',
    '  <a class="wa-cp-cta" href="' + WA_URL + '" target="_blank" rel="noopener noreferrer">',
    '    <svg viewBox="0 0 20 20" fill="#fff" width="15" height="15" aria-hidden="true"><path d="M10 2C5.582 2 2 5.582 2 10c0 1.48.398 2.867 1.094 4.062L2 18l4.023-1.051A7.963 7.963 0 0 0 10 18c4.418 0 8-3.582 8-8s-3.582-8-8-8z"/></svg>',
    '    Start Chat on WhatsApp',
    '  </a>',
    '</div>'
  ].join('');

  function buildChatbot() {
    /* Remove any stale chatbot elements from earlier versions */
    document.querySelectorAll('#wa-wrap, #whatsapp-float-btn, .whatsapp-chatbot').forEach(function (el) {
      el.remove();
    });

    var wrap = document.createElement('div');
    wrap.id = 'wa-wrap';
    wrap.className = 'wa-wrap';

    wrap.innerHTML = [
      '<span class="wa-ring wa-ring-1" aria-hidden="true"></span>',
      '<span class="wa-ring wa-ring-2" aria-hidden="true"></span>',
      '<span class="wa-badge" id="wa-badge" aria-hidden="true">1</span>',
      '<span class="wa-label" id="wa-label">&#128172; Chat with us</span>',
      '<a id="wa-btn" class="wa-btn" href="' + WA_URL + '"',
      '   target="_blank" rel="noopener noreferrer"',
      '   aria-label="Chat with Assignment Help Global on WhatsApp">',
      WA_ICON,
      '</a>',
      '<div class="wa-chat-preview" id="wa-chat-preview" role="complementary" aria-label="WhatsApp chat preview">',
      CHAT_HTML,
      '</div>'
    ].join('');

    document.body.appendChild(wrap);

    var badge  = document.getElementById('wa-badge');
    var btn    = document.getElementById('wa-btn');

    /* Hide badge once user clicks the button */
    if (btn) {
      btn.addEventListener('click', function () {
        if (badge) badge.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }
})();
