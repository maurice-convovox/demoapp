import { SdkState } from './sdkState.ts';
import { ClientResponseOptionType, IdoServiceResponse } from './types/sdk_interfaces.ts';
import { StepHandlers, StepResolver, UiStepType } from './stepHandlers';
import DOMPurify from 'dompurify';

export function getElement<T extends HTMLElement>(selector: string): T | undefined {
  const elem = document.querySelector<T>(selector)!;

  if (!elem) {
    console.warn(`Element ${selector} not found`);
  }

  return elem;
}

export function getElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector)!;
}

export function setMainContent(content: string) {
  getElement<HTMLDivElement>('#app')!.innerHTML = content;
}

export function addOverlay(id: string, content: string) {
  const overlays = getElement<HTMLDivElement>('#overlays')!;
  const overlay = document.createElement('div');

  overlay.id = id;
  overlay.classList.add('overlay');
  overlay.innerHTML = content;

  overlays.append(overlay);
}

export function addEventListener(selector: string, event: string, callback: (e: Event) => void) {
  const element = getElement<HTMLElement>(selector);
  if (!element) return;

  // If this is a form, prevent default submission
  if (element instanceof HTMLFormElement) {
    element.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // Also prevent Enter key submission on all inputs
    const inputs = element.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          return false;
        }
      });
    });
  }

  element.addEventListener(event, callback);
}

export function addClickListener(selector: string, callback: (e: Event) => void) {
  const element = document.querySelector(selector);
  if (!element) return;

  // If this is a form, we want to listen for clicks on its submit button
  if (element instanceof HTMLFormElement) {
    const formId = element.id.replace('form-', '');
    const submitButton = element.querySelector(`#submit-${formId}`);

    if (submitButton) {
      submitButton.addEventListener('click', callback);
    } else {
      // Fallback to form click if no submit button found
      element.addEventListener('click', callback);
    }

    // Prevent form submission
    element.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  } else {
    // For non-form elements, use normal click handling
    element.addEventListener('click', (e: Event) => {
      if (e.target === element) {
        callback(e);
      }
    });
  }
}

// export function addClickListener(selector: string, callback: (e: Event) => void) {
//   addEventListener(selector, 'click', callback);
// }

export function getInputValue(selector: string) {
  return getElement<HTMLInputElement | HTMLTextAreaElement>(selector)?.value.trim();
}

export function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlParams.entries());
}

export function restartApp() {
  SdkState.clearSessionStorage();
  window.location.href = '/';
}

export function parseJwt(token: string) {
  return token && JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2);
}

export function generateId(length = 5) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

export function generateAlternateBranch(submitStep: StepResolver, input?: IdoServiceResponse) {
  const alternateBranchingOptions =
    input?.clientResponseOptions &&
    Object.values(input.clientResponseOptions).filter((option) =>
      [ClientResponseOptionType.Cancel, ClientResponseOptionType.Custom].includes(option.type),
    );
  if (!alternateBranchingOptions?.length) return;

  const alternateBranchDiv = document.createElement('div');
  alternateBranchDiv.classList.add('column');

  alternateBranchingOptions.forEach((option) => {
    const button = document.createElement('button');
    button.classList.add('full-width', 'secondary');
    button.innerHTML = option.label || option.id;

    button.addEventListener('click', () => {
      button.classList.add('loading');
      button.disabled = true;

      submitStep({ options: option.id, data: {} });
    });

    alternateBranchDiv.append(button);
  });

  document.querySelector('#app')?.append(alternateBranchDiv);
}

export function sanitizeHtml(html: string) {
  // DOMPurify implements DOM Clobbering Protection which may remove the "name" and "id" attributes although they have valid values
  // { SANITIZE_DOM: false } only disables the DOM Clobbering Protection
  // https://github.com/cure53/DOMPurify/blob/main/src/purify.js#L1152
  return DOMPurify.sanitize(html, { SANITIZE_DOM: false });
}

export function addLoadingButtonClickListener(selector: string, callback: () => void | Promise<void>) {
  const element = document.querySelector(selector);
  if (!element) return;

  // If selector points to a form, find its submit button
  const button = element instanceof HTMLFormElement
      ? element.querySelector(`#submit-${element.id.replace('form-', '')}`) as HTMLButtonElement
      : element as HTMLButtonElement;

  if (!button) return;

  addClickListener(selector, async (e: Event) => {
    button.classList.add('loading');
    button.disabled = true;

    try {
      await callback();
    } catch (e: any) {
      await StepHandlers[UiStepType.Error].handle(e);
    }
  });
}

export async function showErrorPage(e: any) {
  await StepHandlers[UiStepType.Error].handle(e);
}
