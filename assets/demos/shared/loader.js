const mounted = new WeakSet();
const modules = new Map();

function loadModule(url) {
  if (!modules.has(url)) modules.set(url, import(url));
  return modules.get(url);
}

async function mountDemo(root) {
  if (mounted.has(root)) return;
  mounted.add(root);

  try {
    const implementation = await loadModule(root.dataset.moduleSrc);
    await implementation.mount(root, {
      autoplay: root.dataset.autoplay !== "false"
    });
    root.dataset.demoReady = String(root.dataset.phase !== "error");
  } catch (error) {
    root.dataset.phase = "error";
    root.dataset.demoReady = "false";
    const detail = root.querySelector('[data-role="detail"]');
    if (detail) detail.textContent = "The demonstration could not load. Please refresh to try again.";
    console.error("Unable to initialize demonstration", error);
  }
}

function mountAll() {
  document.querySelectorAll("[data-demo][data-module-src]").forEach(mountDemo);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll, { once: true });
} else {
  mountAll();
}
