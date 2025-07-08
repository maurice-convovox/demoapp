import { StepHandler, StepResponse } from '../types/stepHandler';
import { IdoServiceResponse } from '../types/sdk_interfaces';
import { InformationComponent } from '../components/informationComponent';
import { sanitizeHtml, setMainContent } from '../common';

export class RejectAccessStepHandler implements StepHandler {
  private readonly BUTTON_ID = 'restart_button';
  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    // @ts-ignore
    if (input.redirectUrl) {
      // @ts-ignore
      window.location.href = input.redirectUrl;
      return;
    }

    return new Promise<StepResponse | void>(() => {
      const html = this.generateHtml(input);
      setMainContent(html);

      this.setEventListeners();
    });
  }

  protected generateHtml(input?: IdoServiceResponse) {
    const inputData = input?.data;

    const title = inputData?.title || 'Journey rejected';
    const text = `<div>${inputData?.text || 'Journey rejected without a message'}</div>`;
    const buttonText = inputData?.button_text || 'Restart';

    let html = InformationComponent(title, text, buttonText, this.BUTTON_ID, 'error');
    return sanitizeHtml(html);
  }

  protected setEventListeners() {
    // addLoadingButtonClickListener(`#${this.BUTTON_ID}`, () => {
    //   restartApp();
    // });
    //
    // if (this.additionalData) {
    //   addClickListener(`#${this.ADDITIONAL_DATA_BUTTON_ID}`, () => {
    //     ModalComponent('Additional data', `<pre>${JSON.stringify(this.additionalData, undefined, 2)}</pre>`);
    //   });
    // }
  }
}
