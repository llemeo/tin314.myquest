/**
 * Typography normalizer for KVN-97 font
 * Adjusts height of Vietnamese accented uppercase characters so base glyph matches unaccented capitals.
 */

window.KvnHelper = {
  // Regex covering all uppercase Vietnamese accented characters
  ACCENTED_UPPER_REGEX: /([ÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ])/g,

  format(text) {
    if (!text || typeof text !== 'string') return text || '';
    return text.replace(this.ACCENTED_UPPER_REGEX, '<span class="kvn-cap-accent">$1</span>');
  },

  applyAll(root = document) {
    const elements = root.querySelectorAll('.font-kvn');
    elements.forEach(el => {
      // If already processed, skip
      if (el.dataset.kvnFixed === "true") return;
      // Only process direct text nodes or text content
      if (el.children.length === 0) {
        el.innerHTML = this.format(el.textContent);
        el.dataset.kvnFixed = "true";
      }
    });
  }
};
