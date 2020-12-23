import layouts from './layouts';
import './style.scss';

import backspaceIcon from './assets/icons/backspace.svg';
import keyboardArrowLeftIcon from './assets/icons/keyboard_arrow_left.svg';
import keyboardArrowRightIcon from './assets/icons/keyboard_arrow_right.svg';
import languageIcon from './assets/icons/language.svg';
import micIcon from './assets/icons/mic.svg';
import micOffIcon from './assets/icons/mic_off.svg';
import volumeOffIcon from './assets/icons/volume_off.svg';
import volumeUpIcon from './assets/icons/volume_up.svg';
import keyboardCapsLockButton from './assets/icons/keyboard_capslock.svg';
import keyboardReturnButton from './assets/icons/keyboard_return.svg';
import northIcon from './assets/icons/north.svg';
import checkCircleIcon from './assets/icons/check_circle.svg';
import spaceBarIcon from './assets/icons/space_bar.svg';

import backSound from './assets/sounds/back.wav';
import capsSound from './assets/sounds/caps.wav';
import enSound from './assets/sounds/en.wav';
import enterSound from './assets/sounds/enter.wav';
import ruSound from './assets/sounds/ru.wav';
import shiftSound from './assets/sounds/shift.wav';

const iconMap = {
  backspace: backspaceIcon,
  keyboard_arrow_left: keyboardArrowLeftIcon,
  keyboard_arrow_right: keyboardArrowRightIcon,
  keyboard_capslock: keyboardCapsLockButton,
  keyboard_return: keyboardReturnButton,
  north: northIcon,
  check_circle: checkCircleIcon,
  language: languageIcon,
  mic: micIcon,
  mic_off: micOffIcon,
  volume_off: volumeOffIcon,
  volume_up: volumeUpIcon,
  space_bar: spaceBarIcon,
};

const soundMap = {
  back: backSound,
  caps: capsSound,
  en: enSound,
  enter: enterSound,
  ru: ruSound,
  shift: shiftSound,
};

const getSound = (soundName) => new Audio(soundMap[soundName]);

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    shift: null,
    lang: null,
    recognition: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    lang: 'en',
    muted: false,
    recording: false,
    transcript: null,
  },

  init(inputListener) {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this.elements.recognition = new SpeechRecognition();

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key',
    );
    this.elements.recognition.interimResults = true;
    this.elements.recognition.lang = this.properties.lang;
    this.elements.recognition.continuous = true;

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.textArea = document.getElementById('search__input');
    const element = this.elements.textArea;
    element.addEventListener('focus', () => {
      this.open(element.value, (currentValue) => {
        const { value, selectionStart } = element;
        const elementRef = element;
        if (currentValue.length > value.length) {
          elementRef.value =
            value.slice(0, selectionStart) +
            currentValue.slice(-1) +
            value.slice(selectionStart);
          elementRef.setSelectionRange(selectionStart + 1, selectionStart + 1);
          inputListener(elementRef.value);
        } else {
          if (selectionStart <= 0) return;

          elementRef.value =
            value.slice(0, selectionStart - 1) + value.slice(selectionStart);
          elementRef.setSelectionRange(selectionStart - 1, selectionStart - 1);
          this.properties.value = elementRef.value;
          inputListener(elementRef.value);
        }
        if (this.properties.shift) {
          this.toggleShift();
        }
      });
      element.addEventListener('blur', (e) => {
        if (
          e.relatedTarget &&
          e.relatedTarget.classList.contains('keyboard__key')
        ) {
          if (!e.relatedTarget.classList.contains('done__button')) {
            this.onTextareaBlur(e);
          }
        } else {
          this.close();
        }
      });
    });
    element.addEventListener('keydown', this.onKeyDown.bind(this));
    element.addEventListener('input', (e) => {
      this.properties.value = e.target.value;
    });
    this.elements.recognition.addEventListener('result', (e) => {
      if (this.properties.recording) {
        const { transcript } = e.results[e.results.length - 1][0];

        const txtArea = this.elements.textArea;
        txtArea.value = [transcript, ' '].join('');
        this.properties.transcript = transcript;
        this.properties.value = txtArea.value;
        this.triggerEvent('oninput');
      }
    });
    this.elements.recognition.addEventListener('end', (e) => {
      this.properties.value += `${this.properties.transcript} `;
      this.properties.transcript = null;
      const newCursorPos = this.properties.value.length;
      const txtArea = this.elements.textArea;
      txtArea.setSelectionRange(newCursorPos, newCursorPos);
      txtArea.focus();
      if (this.properties.recording) {
        e.target.start();
      }
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      [...layouts[0], 'backspace'],
      [...layouts[1]],
      ['caps', ...layouts[2], 'enter'],
      ['done', ...layouts[3], 'shift'],
      ['mic', 'mute', 'lang', 'space', 'left', 'right'],
    ];

    keyLayout.forEach((row) => {
      row.forEach((keyRef) => {
        const keyElement = document.createElement('button');
        let key = keyRef;

        keyElement.setAttribute('type', 'button');
        if (typeof key === 'object') {
          keyElement.setAttribute('data-code', key.code);
          keyElement.setAttribute('data-base_en', key.en.base);
          keyElement.setAttribute('data-base_ru', key.ru.base);
          if (key.en.shift) {
            keyElement.setAttribute('data-shift_en', key.en.shift);
          }
          if (key.ru.shift) {
            keyElement.setAttribute('data-shift_ru', key.ru.shift);
          }
          key = key[this.properties.lang].base;
        }
        keyElement.classList.add('keyboard__key');
        keyElement.addEventListener('mousedown', (e) => {
          e.target.classList.add('keyboard__key--down');
          if (key === 'mute') return;
          const audio = getSound(e.target.dataset.sound);
          if (!audio) return;
          audio.currentTime = 0;
          audio.play();
        });
        keyElement.addEventListener('mouseup', (e) => {
          e.target.classList.remove('keyboard__key--down');
        });

        switch (key) {
          case 'backspace':
            keyElement.classList.add('keyboard__key--wide');
            keyElement.innerHTML = this.createIconHTML('backspace');
            keyElement.setAttribute('data-code', 'Backspace');
            keyElement.setAttribute('data-sound', 'back');

            keyElement.addEventListener('mousedown', () => {
              this.triggerEvent('oninput');
            });

            break;

          case 'caps':
            keyElement.classList.add(
              'keyboard__key--wide',
              'keyboard__key--activatable',
            );
            keyElement.innerHTML = this.createIconHTML('keyboard_capslock');
            keyElement.setAttribute('data-code', 'CapsLock');
            keyElement.setAttribute('data-sound', 'caps');

            keyElement.addEventListener('mousedown', () => {
              this.toggleCapsLock();
              keyElement.classList.toggle(
                'keyboard__key--active',
                this.properties.capsLock,
              );
            });

            break;

          case 'enter':
            keyElement.innerHTML = this.createIconHTML('keyboard_return');
            keyElement.setAttribute('data-code', 'Enter');
            keyElement.setAttribute('data-sound', 'enter');

            keyElement.addEventListener('mousedown', () => {
              this.properties.value += '\n';
              this.triggerEvent('oninput');
            });

            break;

          case 'space':
            keyElement.classList.add('keyboard__key--extra-wide');
            keyElement.innerHTML = this.createIconHTML('space_bar');
            keyElement.setAttribute('data-code', 'Space');
            keyElement.setAttribute('data-sound', this.properties.lang);

            keyElement.addEventListener('mousedown', () => {
              this.properties.value += ' ';
              this.triggerEvent('oninput');
            });

            break;

          case 'done':
            keyElement.classList.add('keyboard__key--dark', 'done__button');
            keyElement.innerHTML = this.createIconHTML('check_circle');
            keyElement.setAttribute('data-sound', this.properties.lang);

            keyElement.addEventListener('click', () => {
              this.close();
              this.triggerEvent('onclose');
            });

            break;

          case 'shift':
            keyElement.classList.add(
              'keyboard__key--medium-wide',
              'keyboard__key--activatable',
            );
            keyElement.innerHTML = `${this.createIconHTML('north')} Shift`;
            keyElement.setAttribute('data-code', 'Shift');
            keyElement.setAttribute('data-sound', 'shift');
            keyElement.addEventListener('mousedown', () => {
              this.elements.shift = keyElement;
              this.toggleShift();
            });

            break;

          case 'lang':
            keyElement.classList.add('keyboard__key--wide');
            keyElement.setAttribute('data-sound', this.properties.lang);
            keyElement.innerHTML = [
              this.createIconHTML('language'),
              '&nbsp;',
              this.properties.lang,
            ].join('');

            keyElement.addEventListener('click', () => {
              this.elements.lang = keyElement;
              this.toggleLang();
            });

            break;

          case 'left':
            keyElement.innerHTML = this.createIconHTML('keyboard_arrow_left');
            keyElement.setAttribute('data-code', 'ArrowLeft');
            keyElement.setAttribute('data-sound', this.properties.lang);

            keyElement.addEventListener('mousedown', () => {
              const textarea = this.elements.textArea;
              const newCurPos = textarea.selectionStart - 1;
              if (newCurPos >= 0) {
                textarea.setSelectionRange(newCurPos, newCurPos);
              }
            });

            break;

          case 'right':
            keyElement.innerHTML = this.createIconHTML('keyboard_arrow_right');
            keyElement.setAttribute('data-code', 'ArrowRight');
            keyElement.setAttribute('data-sound', this.properties.lang);

            keyElement.addEventListener('mousedown', () => {
              const textarea = this.elements.textArea;
              const newCurPos = textarea.selectionStart + 1;
              if (newCurPos <= textarea.textLength) {
                textarea.setSelectionRange(newCurPos, newCurPos);
              }
            });

            break;

          case 'mute':
            keyElement.innerHTML = this.createIconHTML('volume_up');
            keyElement.addEventListener('click', this.toggleMute.bind(this));

            break;

          case 'mic':
            keyElement.innerHTML = this.createIconHTML('mic_off');
            keyElement.addEventListener('click', this.toggleMic.bind(this));

            break;

          default:
            keyElement.textContent = key.toLowerCase();
            keyElement.setAttribute('data-sound', this.properties.lang);
            keyElement.addEventListener('mousedown', () => {
              if (keyElement.dataset[`shift_${this.properties.lang}`]) {
                this.properties.value += this.properties.shift
                  ? keyElement.dataset[`shift_${this.properties.lang}`]
                  : keyElement.dataset[`base_${this.properties.lang}`];
              } else {
                this.properties.value += keyElement.textContent;
              }
              this.triggerEvent('oninput');
            });

            break;
        }

        fragment.appendChild(keyElement);
      });

      fragment.appendChild(document.createElement('br'));
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      if (key.childElementCount === 0) {
        const keyRef = key;
        keyRef.textContent =
          key.textContent === key.textContent.toLowerCase()
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase();
      }
    });
  },

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.elements.keys.forEach((key) => {
      if (key.childElementCount === 0) {
        const keyRef = key;
        if (key.dataset && key.dataset[`shift_${this.properties.lang}`]) {
          keyRef.textContent = this.properties.shift
            ? key.dataset[`shift_${this.properties.lang}`]
            : key.dataset[`base_${this.properties.lang}`];
        } else {
          keyRef.textContent =
            key.textContent === key.textContent.toLowerCase()
              ? key.textContent.toUpperCase()
              : key.textContent.toLowerCase();
        }
      }
    });
    this.elements.shift.classList.toggle(
      'keyboard__key--active',
      this.properties.shift,
    );
  },

  toggleLang() {
    const prevLang = this.properties.lang;
    this.properties.lang = prevLang === 'en' ? 'ru' : 'en';
    this.elements.keys.forEach((key) => {
      if (key.dataset.sound === prevLang) {
        key.setAttribute('data-sound', this.properties.lang);
      }

      if (key.childElementCount == 0) {
        if (key.dataset[`shift_${this.properties.lang}`]) {
          key.textContent = this.properties.shift
            ? key.dataset[`shift_${this.properties.lang}`]
            : key.dataset[`base_${this.properties.lang}`];
        } else {
          key.textContent =
            key.textContent === key.textContent.toLowerCase()
              ? key.dataset[`base_${this.properties.lang}`].toLowerCase()
              : key.dataset[`base_${this.properties.lang}`].toUpperCase();
        }
      }
    });
    this.elements.lang.innerHTML = [
      this.createIconHTML('language'),
      '&nbsp;',
      this.properties.lang,
    ].join('');
    this.elements.recognition.stop();
    this.elements.recognition.lang = this.properties.lang;
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },

  createIconHTML(iconName) {
    return `<img src="${iconMap[iconName]}" alt="${iconName}">`;
  },

  onTextareaBlur(e) {
    if (
      e.relatedTarget &&
      !(
        e.relatedTarget.innerText === 'check_circle' ||
        e.relatedTarget.innerText.startsWith('mic')
      )
    ) {
      e.target.focus();
    }
  },

  onKeyDown(e) {
    const keyCode =
      e.code === 'ShiftLeft' || e.code === 'ShiftRight' ? 'Shift' : e.code;
    const keyButton = Array.from(this.elements.keys).find(
      (key) => key.dataset.code === keyCode,
    );
    if (keyButton) {
      e.preventDefault();
      keyButton.dispatchEvent(new Event('mousedown'));
      setTimeout(() => {
        keyButton.dispatchEvent(new Event('mouseup'));
      }, 500);
    }
  },

  toggleMute(e) {
    if (this.properties.muted) {
      this.properties.muted = false;
      e.target.innerHTML = this.createIconHTML('volume_up');
    } else {
      this.properties.muted = true;
      e.target.innerHTML = this.createIconHTML('volume_off');
    }
    document.querySelectorAll('audio').forEach((el) => {
      const elRef = el;
      elRef.muted = this.properties.muted;
    });
  },

  toggleMic(e) {
    if (this.properties.recording) {
      this.properties.recording = false;
      e.target.innerHTML = this.createIconHTML('mic_off');
      this.elements.recognition.stop();
    } else {
      this.properties.recording = true;
      e.target.innerHTML = this.createIconHTML('mic');
      this.elements.recognition.start();
    }
  },
};

export default Keyboard;
