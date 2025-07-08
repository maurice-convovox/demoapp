export function Spinner(message?: string) {
  return /* HTML */ ` <div class="column center">
    ${message ? `<div>${message}</div>` : ''}
    <div id="spinner"></div>
  </div>`;
}
