// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const startBtn = document.querySelector('button[data-start]');
const resetBtn = document.querySelector('button[data-reset]');
const datetimePicker = document.querySelector('#datetime-picker');
let seconds = document.querySelector('span[data-seconds]');
let minutes = document.querySelector('span[data-minutes]');
let hours = document.querySelector('span[data-hours]');
let days = document.querySelector('span[data-days]');
let selectedDate = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = Date.parse(selectedDates[0]);
    const currentDate = Date.now();
    if (selectedDate < currentDate) {
      iziToast.error({
        position: 'topRight',
        backgroundColor: '#bd221dff',
        messageColor: '#fff',
        message: 'Please choose a date in the future',
        close: false,
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startBtn.addEventListener('click', () => {
  datetimePicker.disabled = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;
  timeRender();
  const intervalId = setInterval(() => setTimer(intervalId), 1000);
});
resetBtn.addEventListener('click', () => {
  reset();
  selectedDate = null;
});

function setTimer(intervalId) {
  timeRender();
  if (selectedDate - Date.now() < 1000) {
    clearInterval(intervalId);
    reset(intervalId);
  }
}
function reset(intervalId) {
  datetimePicker.disabled = false;
  resetBtn.disabled = true;
  clearInterval(intervalId);
  seconds.textContent = '00';
  minutes.textContent = '00';
  hours.textContent = '00';
  days.textContent = '00';
}
function timeRender() {
  const timeComponents = convertMs(selectedDate - Date.now());
  seconds.textContent = timeComponents.seconds.toString().padStart(2, '0');
  minutes.textContent = timeComponents.minutes.toString().padStart(2, '0');
  hours.textContent = timeComponents.hours.toString().padStart(2, '0');
  days.textContent = timeComponents.days.toString().padStart(2, '0');
}