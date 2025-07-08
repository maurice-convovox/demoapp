import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import * as commonHelpers from '../common';

export class FormLoginStepHandler implements StepHandler {
  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>((submitStep: StepResolver) => {
      const html = this.generateHtml();
      commonHelpers.setMainContent(html);

      this.setEventListeners(submitStep, input);
    });
  }


  protected generateHtml(input?: IdoServiceResponse) {
    return commonHelpers.sanitizeHtml(/* HTML */ `
      ${input?.data?.form_title ? `<h1 class= "center">${input?.data?.form_title}</h1>` : ''}
      ${input?.data?.form_description ? `<div class="alert info">${input?.data?.form_description}</div>` : ''}

      <div class="tabs">
        <div class="tab-buttons row">
          <button class="tab-button secondary" id="tab-button-password">Password</button>
          <button class="tab-button secondary" id="tab-button-passkeys">Passkeys</button>
        </div>
        <div class="tab-wrapper">
          <div id="content-password" class="tab-content">
            <form id="form-password" class="column">
              <!-- ... other form fields ... -->
              <button type="button" id="submit-password" class="full-width">Submit</button>
            </form>
          </div>
          <div id="content-passkeys" class="tab-content">
            <form id="form-passkeys" class="column">
              <!-- ... other form fields ... -->
              <button type="button" id="submit-passkeys" class="full-width">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <!-- ... rest of the HTML ... -->
    `);
  }

  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    // Add keydown handlers to prevent form submission on enter
    const forms = ['password', 'passkeys'];
    forms.forEach(formId => {
      const form = commonHelpers.getElement<HTMLFormElement>(`#form-${formId}`);
      if (form) {
        // Prevent form submission
        form.addEventListener('submit', (e) => {
          e.preventDefault();
        });

        // Prevent enter key submission
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              return false;
            }
          });
        });
      }
    });

    this.setupFormLinkListeners('password', submitStep);
    this.setupFormLinkListeners('passkeys', submitStep);

    if (input?.data?.error_data && input.data.error_data !== 'null') {
      commonHelpers.getElement<HTMLDivElement>(`#step-error`)!.innerHTML = input.data.error_data;
    }
  }


  private setupFormLinkListeners(formId: string, submitStep: StepResolver) {
    const form = commonHelpers.getElement<HTMLFormElement>(`#form-${formId}`);
    if (!form) {
      return;
    }

    // Prevent automatic form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    commonHelpers.addLoadingButtonClickListener(
        `#submit-${formId}`,  // Target the submit button instead of the form
        async () => {
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          submitStep({
            options: this.getClientResponseOptions(formId),
            data,
          });
        }
    );
  }

  private getClientResponseOptions(alternateBranchId: string) {
    return alternateBranchId === 'login'
      ? ClientResponseOptionType.ClientInput
      : (alternateBranchId as ClientResponseOptionType);
  }
}
