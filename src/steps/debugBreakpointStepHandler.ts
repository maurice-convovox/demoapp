import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import { InformationComponent } from '../components/informationComponent';
import { addLoadingButtonClickListener, sanitizeHtml, setMainContent } from '../common';

export class DebugBreakpointStepHandler implements StepHandler {
  private readonly BUTTON_ID = 'continue_button';

  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>((submitStep: StepResolver) => {
      const html = this.generateHtml();
      setMainContent(html);

      this.setEventListeners(submitStep, input);
    });
  }

  protected generateHtml() {
    const html = InformationComponent(
      'Debug break',
      'The journey is now paused.<br>You can use the browser console to inspect the state of the journey.',
      'Continue',
      this.BUTTON_ID,
      'info',
    );

    return sanitizeHtml(html);
  }

  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    const stepData = input?.data;

    addLoadingButtonClickListener(`#${this.BUTTON_ID}`, () => {
      submitStep({
        options: ClientResponseOptionType.ClientInput,
        data: stepData,
      });
    });
  }
}
