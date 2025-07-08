import { StepHandlers, UiStepType } from './stepHandlers';
import {addClickListener, getElement, restartApp} from './common';
import { config } from './config';
import { brandingService } from './config/brandingService'


document.addEventListener('DOMContentLoaded', async function () {
  initializeSdk();
  brandingService.applyBrandingToDOM(); // Apply initial branding
  await startOrResumeJourney();
});

addClickListener('#restart-button', () => {
  restartApp();
});

function initializeSdk() {
  window.tsPlatform.initialize({
    clientId: `${config.clientId}`,
    ido: { serverPath: `${config.idoServerUrl}`, applicationId: `${config.appId}` },
    drs: {
      enabled: true,
    },
  });
}




async function startOrResumeJourney() {
  revealApplication();
  // const sdkState = SdkState.getState();

  // if (sdkState) {
  //   // If we have a serialized state, restore it and continue the journey
  //   const executor = new JourneyExecutor();
  //   await executor.resumeJourney(sdkState);
  // } else {
    // Otherwise, start the journey
    await StepHandlers[UiStepType.Start].handle();
  // }
}

// Solution of flash of unstyled content problem
// Reveals the application by making the HTML document visible
// According to style="display: none" on <html> element in index.html page
function revealApplication() {
  const element = getElement<HTMLHtmlElement>('html');
  if (element) {
    element.style.display = 'block';
  }
}
