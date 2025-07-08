import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { addLoadingButtonClickListener, generateAlternateBranch, sanitizeHtml, setMainContent } from '../common';
import { InformationComponent } from '../components/informationComponent';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';

/**
 * Handles the Passkeys (WebAuthn) Registration step.
 * Manages the process of registering a new passkey for the user.
 */
export class RegisterPasskeysStepHandler implements StepHandler {
  private readonly BUTTON_ID = 'webauthn_registration_button';

  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>((submitStep: StepResolver) => {
      const html = this.generateHtml();
      setMainContent(html);

      generateAlternateBranch(submitStep, input);

      this.setEventListeners(submitStep, input);
    });
  }

  protected generateHtml() {
    const html = InformationComponent(
      'Passkeys Registration',
      'About to register a passkey key',
      'Register',
      this.BUTTON_ID,
    );
    return sanitizeHtml(html);
  }

  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    const stepData = input?.data;

    addLoadingButtonClickListener(`#${this.BUTTON_ID}`, async () => {
      try {
        // Initiate WebAuthn registration process
        const webauthn_encoded_result = await window.tsPlatform.webauthn.register(stepData?.username, {
          allowCrossPlatformAuthenticators: stepData?.allow_cross_platform_authenticators,
          registerAsDiscoverable: stepData?.register_as_discoverable,
          displayName: stepData?.display_name,
        });

        // Submit the registration result
        submitStep({
          options: ClientResponseOptionType.ClientInput,
          data: { webauthn_encoded_result },
        });
      } catch (error) {
        submitStep({
          options: ClientResponseOptionType.Fail,
          data: { error },
        });
      }
    });
  }
}
