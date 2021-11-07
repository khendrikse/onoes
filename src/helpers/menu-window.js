let sessionQueue = [];

const sessionQueueList = document.getElementById('sessionQueueList');
const sessionTimeValue = document.querySelector('input[name=time]');
const breakTimeValue = document.querySelector('input[name=break]');
const timerTitle = document.querySelector('input[name=title');
const breakType = [...document.querySelectorAll('input[name=breakType]')];
const entryForm = document.getElementById('entryForm');
const timer = document.getElementById('timer');

const addSession = () => {
  const newListItem = {
    sessionTime: window.dateFns.convertToMilliseconds(sessionTimeValue.value),
    breakTime: window.dateFns.convertToMilliseconds(breakTimeValue.value),
    title: timerTitle.value,
    showFullScreen:
      breakType.filter(input => input.checked)[0].value === 'fullscreen'
  };

  sessionQueue.push(newListItem);

  const listNode = document.createElement('li');
  const listText = document.createTextNode(
    `${newListItem.title} - Timer: ${sessionTimeValue.value}, Break: ${breakTimeValue.value}`
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
