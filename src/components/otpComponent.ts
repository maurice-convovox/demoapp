'use strict';

export const OTP_COMPONENT_INPUT_ID = 'otp-input';

export function OTPComponent(inputCount: number): string {
  let inputsHtml = '';
  for (let i = 0; i < inputCount; i++) {
    inputsHtml += '<input type="text" />';
  }

  return `
    <div id="${OTP_COMPONENT_INPUT_ID}" class="otp">
      ${inputsHtml}
    </div>
    `;
}
