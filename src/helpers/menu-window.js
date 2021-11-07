let sessionQueue = [];

const sessionQueueList = document.getElementById('sessionQueueList');
const session = document.querySelector('input[name=time]');
const sessionBreak = document.querySelector('input[name=break]');
const timerTitle = document.querySelector('input[name=title');
const breakType = [...document.querySelectorAll('input[name=breakType]')];
const entryForm = document.getElementById('entryForm');
const timer = document.getElementById('timer');
const errors = document.getElementById('form-errors');

const getErrors = () => {
  const errorList = { withErrors: [], empty: [], short: [] };
  if (timerTitle.value === '') {
    errorList.empty.push('Title');
    errorList.withErrors.push(timerTitle);
  }
  if (sessionBreak.value === '') {
    errorList.empty.push('Break');
    errorList.withErrors.push(sessionBreak);
  } else if (window.dateFns.convertToMilliseconds(sessionBreak.value) < 60000) {
    errorList.short.push('Break');
    errorList.withErrors.push(sessionBreak);
  }
  if (session.value === '') {
    errorList.empty.push('Session');
    errorList.withErrors.push(session);
  } else if (window.dateFns.convertToMilliseconds(session.value) < 60000) {
    errorList.short.push('Session');
    errorList.withErrors.push(session);
  }
  return errorList;
};

const addSession = () => {
  [session, sessionBreak, timerTitle].map(input =>
    input.classList.remove('error')
  );
  errors.innerHTML = '';
  const sessionTimeValue = session.value;
  const breakTimeValue = sessionBreak.value;
  const title = timerTitle.value;

  if ([sessionTimeValue, breakTimeValue, title].some(input => input === '')) {
    const { withErrors, empty, short } = getErrors();
    const someEmpty = empty.length > 0;
    const someTooShort = short.length > 0;

    const emptyNode = document.createElement('p');

    emptyNode.innerHTML = someEmpty
      ? `${empty.map(input => ' '.concat(input))} can't be empty.`
      : '';

    const shortNode = document.createElement('p');

    shortNode.innerHTML = someTooShort
      ? `${short.map(input =>
          ' '.concat(input)
        )} can't be less than 1 minute <3.`
      : '';

    const topErrorMessage = document.createElement('p');
    topErrorMessage.innerHTML = 'Oh noes!';

    errors.appendChild(topErrorMessage);
    errors.appendChild(emptyNode);
    errors.appendChild(shortNode);
    return withErrors.map(node => node.classList.add('error'));
  }
  const newListItem = {
    sessionTime: window.dateFns.convertToMilliseconds(sessionTimeValue),
    breakTime: window.dateFns.convertToMilliseconds(breakTimeValue),
    title,
    showFullScreen:
      breakType.filter(input => input.checked)[0].value === 'fullscreen'
  };

  sessionQueue.push(newListItem);

  const listNode = document.createElement('li');
  const listText = document.createTextNode(
    `${title} - Timer: ${sessionTimeValue}, Break: ${breakTimeValue}`
  );

  listNode.appendChild(listText);
  sessionQueueList.appendChild(listNode);

  entryForm.reset();
};

const clearQueue = () => {
  sessionQueue = [];
  sessionQueueList.innerHTML = '';
};

const runTimeOut = (type, list) => {
  const newList = list;
  if (list.length === 0) {
    entryForm.style.display = 'block';
    timer.style.display = 'none';
    return;
  }
  if (type === 'timer') {
    const { title, sessionTime } = newList[0];
    timer.innerHTML = title;

    setTimeout(() => {
      runTimeOut('break', newList);
    }, sessionTime);
    return;
  }
  if (type === 'break') {
    const currentTimer = newList.shift();
    const { title, breakTime, showFullScreen } = currentTimer;

    if (showFullScreen) {
      window.electron.openBreakWindow(currentTimer);
      timer.innerHTML = `${title} break`;

      setTimeout(() => {
        window.electron.closeBreakWindow();
        runTimeOut('timer', newList);
      }, breakTime);
      return;
    }

    const notification = new Notification(title, { body: title });
    runTimeOut('timer', newList);
  }
};

const startQueue = () => {
  const startedList = [...sessionQueue];

  entryForm.style.display = 'none';
  timer.style.display = 'block';
  runTimeOut('timer', startedList);
};
