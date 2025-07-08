import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import * as commonHelpers from '../common';

/**
 * Handles the specific form step of the journey.
 * Provides a tabbed interface for  multiple branches.
 */
export class FormGetInfoFromClient1StepHandler implements StepHandler {
  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>((submitStep: StepResolver) => {
      const html = this.generateHtml(input);
      commonHelpers.setMainContent(html);

      this.setEventListeners(submitStep, input);
    });
  }

  protected generateHtml(input?: IdoServiceResponse) {
    return commonHelpers.sanitizeHtml(/* HTML */ `
      ${input?.data?.form_title ? `<h1 class= "center">${input?.data?.form_title}</h1>` : ''}
      ${input?.data?.form_description ? `<div class="alert info">${input?.data?.form_description}</div>` : ''}

      <form id="form-get_info_from_client_1" class="column">
        <div class="input-container">
          <input
            type="email"
            id="get_info_from_client_1_userEmail"
            name="userEmail"
            ${this.getAuthScriptValueFromIdoResponse(input, 'get_info_from_client_1', 'userEmail', 'required')
              ? 'required'
              : ''}
            ${this.getAuthScriptValueFromIdoResponse(input, 'get_info_from_client_1', 'userEmail', 'readonly')
              ? 'readonly'
              : ''}
            placeholder=" "
          />
          <label for="get_info_from_client_1_userEmail"
            >Email${this.getAuthScriptValueFromIdoResponse(input, 'get_info_from_client_1', 'userEmail', 'required')
              ? '*'
              : ''}</label
          >
        </div>
        <button type="submit" id="submit-get_info_from_client_1" class="full-width">Submit</button>
      </form>
      <div id="step-error" class="alert error"></div>
    ` /* HTML-END */);
  }

  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    this.setupFormLinkListeners('get_info_from_client_1', submitStep);

    if (input?.data?.error_data && input.data.error_data !== 'null') {
      commonHelpers.getElement<HTMLDivElement>(`#step-error`)!.innerHTML = input.data.error_data;
    }
  }

  private setupFormLinkListeners(formId: string, submitStep: StepResolver) {
    commonHelpers.addLoadingButtonClickListener(
      `#form-${formId}`,
      async () => {
        const form = commonHelpers.getElement<HTMLFormElement>(`#form-${formId}`);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        submitStep({
          options: this.getClientResponseOptions(formId),
          data,
        });
      },
      'submit',
    );
  }

  /**
   * Use ClientInput for main form, otherwise use the alternateBranchId as the option type
   */
  private getClientResponseOptions(alternateBranchId: string) {
    return alternateBranchId === 'get_info_from_client_1'
      ? ClientResponseOptionType.ClientInput
      : (alternateBranchId as ClientResponseOptionType);
  }

  private getAuthScriptValueFromIdoResponse(
    input?: IdoServiceResponse,
    formId?: string,
    fieldName?: string,
    property?: string,
  ) {
    if (!input) {
      return undefined;
    }

    let field;
    if (input.journeyStepId === formId && input.data?.form_schema) {
      field = input.data.form_schema.find((f: any) => f.name === fieldName);
    } else if (input.clientResponseOptions) {
      const branch = input.clientResponseOptions[`${formId}`];
      if (branch?.schema) {
        field = branch.schema.find((f: any) => f.name === fieldName);
      }
    }

    return field?.[`${property}`];
  }
}
