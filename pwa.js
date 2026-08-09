"use strict";

let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function hideInstallPanel() {
  const panel = document.getElementById("installPanel");
  if (panel) panel.hidden = true;
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const panel = document.getElementById("installPanel");
  if (panel && !isStandalone()) panel.hidden = false;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  hideInstallPanel();
});

window.addEventListener("DOMContentLoaded", () => {
  const installButton = document.getElementById("installApp");
  const dismissButton = document.getElementById("dismissInstall");

  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      hideInstallPanel();
    });
  }

  if (dismissButton) dismissButton.addEventListener("click", hideInstallPanel);
  if (isStandalone()) hideInstallPanel();
});

if ("serviceWorker" in navigator) {
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js?v=7", {updateViaCache:"none"});
      await registration.update();
    } catch (error) {
      console.error("No se pudo actualizar la aplicaciÃ³n sin conexiÃ³n.", error);
    }
  });
}
