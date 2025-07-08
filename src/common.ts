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
  getElement<HTMLElement>(selector)?.addEventListener(event, callback);
}

export function addClickListener(selector: string, callback: (e: Event) => void) {
  addEventListener(selector, 'click', callback);
}

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
  addClickListener(selector, async (e: Event) => {
    const button = e.target as HTMLButtonElement;

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
