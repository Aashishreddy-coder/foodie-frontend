// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

beforeAll(() => {
  // Suppress React Router v7 warnings
  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('React Router Future Flag Warning') ||
       msg.includes('Relative route resolution within Splat routes'))
    ) return;

    console.warn(msg, ...args);
  });

  // Optionally suppress deprecation warnings (e.g., punycode)
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('punycode module is deprecated')
    ) return;

    console.error(msg, ...args);
  });

  // For scrollIntoView issues in JSDOM environment
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});
