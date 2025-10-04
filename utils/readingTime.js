/**
 * Calculates estimated reading time for a given text
 * @param {String} text - The text of the blog
 * @param {Number} wordsPerMinute - Average reading speed, default 200 WPM
 * @returns {String} - Estimated reading time, e.g., "3 min"
 */
const calculateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return '0 min';

  // Count words in text
  const words = text.trim().split(/\s+/).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min`;
};

module.exports = { calculateReadingTime };
