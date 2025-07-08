import { StepHandler, StepResponse } from '../types/stepHandler';
import { InformationComponent } from '../components/informationComponent';
import { addLoadingButtonClickListener, parseJwt, restartApp, sanitizeHtml } from '../common';
import { IdoServiceResponse } from '../types/sdk_interfaces';

export class CompleteJourneyStepHandler implements StepHandler {
  private readonly BUTTON_ID = 'restart_button';

  public async handle(idoServiceResponse: IdoServiceResponse): Promise<StepResponse | void> {
    if (idoServiceResponse.redirectUrl) {
      window.location.href = idoServiceResponse.redirectUrl;
      return;
    }

    // If no redirect URL is present, you might want to show a success message
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  protected generateHtml(input?: IdoServiceResponse) {
    const token = input?.token && parseJwt(input.token);
    const html = InformationComponent(
      'Journey completed successfully!',
      token
        ? `<div>Token received:</div>
           <pre>${token}</pre>`
        : '',
      'Restart',
      this.BUTTON_ID,
    );

    return sanitizeHtml(html);
  }

  protected setEventListeners() {
    addLoadingButtonClickListener(`#${this.BUTTON_ID}`, () => {
      restartApp();
    });
  }
}
