async function init() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    startLoop(config.schedule);
  } catch (error) {
    console.error('Failed to load config:', error);
  }

  // Exit button removed; OS window close will terminate the app
}

function startLoop(schedule) {
  let currentIndex = 0;
  const container = document.getElementById('player-container');

  function playNext() {
    const item = schedule[currentIndex];
    console.log(`Playing item ${currentIndex}:`, item);

    // Clear previous content
    container.innerHTML = '';

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      container.appendChild(img);
    } else if (item.type === 'url') {
      const iframe = document.createElement('iframe');
      iframe.src = item.src;
      container.appendChild(iframe);
    }

    // Schedule next item
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % schedule.length;
      playNext();
    }, item.duration * 1000);
  }

  playNext();
}

init();
