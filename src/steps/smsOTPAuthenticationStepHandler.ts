import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import {
  addLoadingButtonClickListener,
  generateAlternateBranch,
  getElement,
  sanitizeHtml,
  setMainContent,
} from '../common';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import { OTP_COMPONENT_INPUT_ID, OTPComponent } from '../components/otpComponent';

/**
 * Handles the SMS OTP Authentication step.
 * Manages OTP input, validation, and resend functionality for SMS-based authentication.
 */
export class SmsOTPAuthenticationStepHandler implements StepHandler {
  private otpCodeLength: number = 6;

  protected setOtpCodeLength(otpCodeLength?: number) {
    if (otpCodeLength) {
      this.otpCodeLength = otpCodeLength;
    } else {
      getElement<HTMLDivElement>(`#step-warning`)!.innerHTML =
        `The OTP code length was not provided. It has been set to the default value of ${this.otpCodeLength}.`;
    }
  }

  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>((submitStep: StepResolver) => {
      this.setOtpCodeLength(input?.data?.code_length);

      const html = this.generateHtml();
      setMainContent(html);

      if (input?.errorData?.description) {
        getElement<HTMLDivElement>(`#step-error`)!.innerHTML = input.errorData.description;
      }

      generateAlternateBranch(submitStep, input);

      this.setEventListeners(submitStep);
    });
  }

  protected generateHtml() {
    const otpComponent = OTPComponent(this.otpCodeLength);

    return sanitizeHtml(`
      <div class="alert info">SMS OTP</div>
      <form class="column">
        ${otpComponent}
        <div id="step-warning" class="alert warning"></div>
        <div id="step-error" class="alert error"></div>
      </form>
      <button id="resend" class="secondary full-width">Resend OTP</button>
    `);
  }

  private setEventListeners(submitStep: StepResolver) {
    const otp = new VanillaOTP(`#${OTP_COMPONENT_INPUT_ID}`);

    otp.inputs.forEach((input: Element) =>
      input.addEventListener('input', () => {
        // Submit the OTP when all digits are entered
        const passcode = otp.getValue().replace(new RegExp(otp.emptyChar, 'g'), '');
        if (passcode.length === this.otpCodeLength) {
          submitStep({
            options: ClientResponseOptionType.ClientInput,
            data: { passcode },
          });
        }
      }),
    );

    addLoadingButtonClickListener(`#resend`, () => {
      submitStep({
        options: ClientResponseOptionType.Resend,
      });
    });
  }
}
