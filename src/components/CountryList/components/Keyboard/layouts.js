const layouts = [
  [
    {
      code: 'Digit1',
      en: {
        base: '1',
        shift: '!',
      },
      ru: {
        base: '1',
        shift: '!',
      },
    },
    {
      code: 'Digit2',
      en: {
        base: '2',
        shift: '@',
      },
      ru: {
        base: '2',
        shift: '"',
      },
    },
    {
      code: 'Digit3',
      en: {
        base: '3',
        shift: '#',
      },
      ru: {
        base: '3',
        shift: '№',
      },
    },
    {
      code: 'Digit4',
      en: {
        base: '4',
        shift: '$',
      },
      ru: {
        base: '4',
        shift: ';',
      },
    },
    {
      code: 'Digit5',
      en: {
        base: '5',
        shift: '%',
      },
      ru: {
        base: '5',
        shift: '%',
      },
    },
    {
      code: 'Digit6',
      en: {
        base: '6',
        shift: '^',
      },
      ru: {
        base: '6',
        shift: ':',
      },
    },
    {
      code: 'Digit7',
      en: {
        base: '7',
        shift: '&',
      },
      ru: {
        base: '7',
        shift: '?',
      },
    },
    {
      code: 'Digit8',
      en: {
        base: '8',
        shift: '*',
      },
      ru: {
        base: '8',
        shift: '*',
      },
    },
    {
      code: 'Digit9',
      en: {
        base: '9',
        shift: '(',
      },
      ru: {
        base: '9',
        shift: '(',
      },
    },
    {
      code: 'Digit0',
      en: {
        base: '0',
        shift: ')',
      },
      ru: {
        base: '0',
        shift: ')',
      },
    },
  ],
  [
    {
      code: 'KeyQ',
      en: {
        base: 'q',
      },
      ru: {
        base: 'й',
      },
    },
    {
      code: 'KeyW',
      en: {
        base: 'w',
      },
      ru: {
        base: 'ц',
      },
    },
    {
      code: 'KeyE',
      en: {
        base: 'e',
      },
      ru: {
        base: 'у',
      },
    },
    {
      code: 'KeyR',
      en: {
        base: 'r',
      },
      ru: {
        base: 'к',
      },
    },
    {
      code: 'KeyT',
      en: {
        base: 't',
      },
      ru: {
        base: 'е',
      },
    },
    {
      code: 'KeyY',
      en: {
        base: 'y',
      },
      ru: {
        base: 'н',
      },
    },
    {
      code: 'KeyU',
      en: {
        base: 'u',
      },
      ru: {
        base: 'г',
      },
    },
    {
      code: 'KeyI',
      en: {
        base: 'i',
      },
      ru: {
        base: 'ш',
      },
    },
    {
      code: 'KeyO',
      en: {
        base: 'o',
      },
      ru: {
        base: 'щ',
      },
    },
    {
      code: 'KeyP',
      en: {
        base: 'p',
      },
      ru: {
        base: 'з',
      },
    },
    {
      code: 'BracketLeft',
      en: {
        base: '[',
        shift: '{',
      },
      ru: {
        base: 'х',
      },
    },
    {
      code: 'BracketRight',
      en: {
        base: ']',
        shift: '}',
      },
      ru: {
        base: 'ъ',
      },
    },
  ],
  [
    {
      code: 'KeyA',
      en: {
        base: 'a',
      },
      ru: {
        base: 'ф',
      },
    },
    {
      code: 'KeyS',
      en: {
        base: 's',
      },
      ru: {
        base: 'ы',
      },
    },
    {
      code: 'KeyD',
      en: {
        base: 'd',
      },
      ru: {
        base: 'в',
      },
    },
    {
      code: 'KeyF',
      en: {
        base: 'f',
      },
      ru: {
        base: 'а',
      },
    },
    {
      code: 'KeyG',
      en: {
        base: 'g',
      },
      ru: {
        base: 'п',
      },
    },
    {
      code: 'KeyH',
      en: {
        base: 'h',
      },
      ru: {
        base: 'р',
      },
    },
    {
      code: 'KeyJ',
      en: {
        base: 'j',
      },
      ru: {
        base: 'о',
      },
    },
    {
      code: 'KeyK',
      en: {
        base: 'k',
      },
      ru: {
        base: 'л',
      },
    },
    {
      code: 'KeyL',
      en: {
        base: 'l',
      },
      ru: {
        base: 'д',
      },
    },
    {
      code: 'Semicolon',
      en: {
        base: ';',
        shift: ':',
      },
      ru: {
        base: 'ж',
      },
    },
    {
      code: 'Quote',
      en: {
        base: "'",
        shift: '"',
      },
      ru: {
        base: 'э',
      },
    },
  ],
  [
    {
      code: 'KeyZ',
      en: {
        base: 'z',
      },
      ru: {
        base: 'я',
      },
    },
    {
      code: 'KeyX',
      en: {
        base: 'x',
      },
      ru: {
        base: 'ч',
      },
    },
    {
      code: 'KeyC',
      en: {
        base: 'c',
      },
      ru: {
        base: 'с',
      },
    },
    {
      code: 'KeyV',
      en: {
        base: 'v',
      },
      ru: {
        base: 'м',
      },
    },
    {
      code: 'KeyB',
      en: {
        base: 'b',
      },
      ru: {
        base: 'и',
      },
    },
    {
      code: 'KeyN',
      en: {
        base: 'n',
      },
      ru: {
        base: 'т',
      },
    },
    {
      code: 'KeyM',
      en: {
        base: 'm',
      },
      ru: {
        base: 'ь',
      },
    },
    {
      code: 'Comma',
      en: {
        base: ',',
        shift: '<',
      },
      ru: {
        base: 'б',
      },
    },
    {
      code: 'Period',
      en: {
        base: '.',
        shift: '>',
      },
      ru: {
        base: 'ю',
      },
    },
    {
      code: 'Slash',
      en: {
        base: '/',
        shift: '?',
      },
      ru: {
        base: '.',
        shift: ',',
      },
    },
  ],
];

export default layouts;
