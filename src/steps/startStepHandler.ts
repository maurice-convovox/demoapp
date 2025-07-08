import { StepHandler, StepResponse } from '../types/stepHandler';
import { InformationComponent } from '../components/informationComponent';
import { JourneyExecutor } from '../journeyExecutor';
import { addLoadingButtonClickListener, sanitizeHtml, getInputValue } from '../common';

export class StartStepHandler implements StepHandler {
  private readonly BUTTON_ID = 'start_journey_button';

  public async handle(): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>(() => {
      const executor = new JourneyExecutor();
      // Execute journey immediately
      executor.startJourney();
    });
  }


  protected generateHtml() {
    const html = /* HTML */ `<div class="column">
      ${InformationComponent(
        'Welcome',
        `Click the button below to start the journey <b>sso-test-ao</b>`,
        'Start journey',
        this.BUTTON_ID,
      )}
      <div id="additional_params" class="column">
        <textarea id="additional_params_input" placeholder="Additional params json object"></textarea>
      </div>
    </div>`;

    return sanitizeHtml(html);
  }

  protected setEventListeners() {
    addLoadingButtonClickListener(`#${this.BUTTON_ID}`, () => {
      const executor = new JourneyExecutor();

      const additionalParamsInput = getInputValue('#additional_params_input');
      if (additionalParamsInput) {
        try {
          executor.startJourney();
        } catch (e) {
          throw e;
        }
      } else {
        executor.startJourney();
      }
    });
  }
}
