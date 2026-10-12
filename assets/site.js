// Load clips only near the viewport; never run offscreen background playback.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
const clips = [...document.querySelectorAll('.scene-video')].map(video => {
  const button = video.closest('.project-scene').querySelector('.playback');
  const state = { video, button, visible: false, manual: false, pausedByUser: false };
  video.muted = true;
  // Playback is scheduled here so autoplay respects accessibility preferences.
  video.autoplay = false;
  button.hidden = false;
  const update = () => {
    const playing = !video.paused;
    button.querySelector('.playback-label').textContent = playing ? 'Pause clip' : 'Play clip';
    button.querySelector('.playback-icon').textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${video.getAttribute('aria-label').replace(', silent', '')} background video`);
  };
  ['play', 'pause', 'ended'].forEach(event => video.addEventListener(event, update));
  button.addEventListener('click', () => {
    state.manual = true;
    state.pausedByUser = !video.paused;
    if (state.pausedByUser) video.pause();
    else { load(state); video.play().catch(update); }
  });
  return state;
});
function allowed(state) { return state.manual || (!reducedMotion.matches && !connection?.saveData); }
function load(state) {
  if (!state.video.hasAttribute('src')) {
    state.video.src = state.video.dataset.src;
    state.video.load();
  }
}
function sync(state) {
  if (state.visible && !document.hidden && !state.pausedByUser && allowed(state)) {
    load(state);
    state.video.play().catch(() => {}); // Posters and manual controls remain when autoplay is blocked.
  } else state.video.pause();
}
const nearby = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const state = clips.find(item => item.video === entry.target);
    if (entry.isIntersecting && allowed(state)) { load(state); nearby.unobserve(entry.target); }
  }
}, { rootMargin: '200px' });
const visible = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const state = clips.find(item => item.video === entry.target);
    state.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
    sync(state);
  }
}, { threshold: [0, .25] });
clips.forEach(state => { nearby.observe(state.video); visible.observe(state.video); });
document.addEventListener('visibilitychange', () => clips.forEach(sync));
reducedMotion.addEventListener('change', () => { clips.forEach(state => { state.manual = false; sync(state); }); });
connection?.addEventListener('change', () => clips.forEach(sync));
