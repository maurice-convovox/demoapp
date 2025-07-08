import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import * as commonHelpers from '../common';

/**
 * Handles the specific form step of the journey.
 * Provides a tabbed interface for  multiple branches.
 */
export class FormLoginForm1StepHandler implements StepHandler {
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

      <div class="tabs">
        <div class="tab-buttons row">
          <button class="tab-button secondary" id="tab-button-password">Password</button>
          <button class="tab-button secondary" id="tab-button-passkeys">Passkeys</button>
        </div>
        <div class="tab-wrapper">
          <div id="content-password" class="tab-content">
            <form id="form-password" class="column">
              <div class="input-container">
                <input
                  type="text"
                  id="password_username"
                  name="username"
                  ${this.getAuthScriptValueFromIdoResponse(input, 'password', 'username', 'required') ? 'required' : ''}
                  ${this.getAuthScriptValueFromIdoResponse(input, 'password', 'username', 'readonly') ? 'readonly' : ''}
                  placeholder=" "
                />
                <label for="password_username"
                  >Username${this.getAuthScriptValueFromIdoResponse(input, 'password', 'username', 'required')
                    ? '*'
                    : ''}</label
                >
              </div>
              <div class="input-container">
                <input
                  type="password"
                  id="password_password"
                  name="password"
                  ${this.getAuthScriptValueFromIdoResponse(input, 'password', 'password', 'required') ? 'required' : ''}
                  ${this.getAuthScriptValueFromIdoResponse(input, 'password', 'password', 'readonly') ? 'readonly' : ''}
                  placeholder=" "
                />
                <label for="password_password"
                  >Password${this.getAuthScriptValueFromIdoResponse(input, 'password', 'password', 'required')
                    ? '*'
                    : ''}</label
                >
              </div>
              <button type="submit" id="submit-password" class="full-width">Submit</button>
            </form>
          </div>
          <div id="content-passkeys" class="tab-content">
            <form id="form-passkeys" class="column">
              <div class="input-container">
                <input
                  autocomplete="username webauthn"
                  type="text"
                  id="passkey-input"
                  name="webauthn_encoded_result"
                  ${this.getAuthScriptValueFromIdoResponse(input, 'passkeys', 'webauthn_encoded_result', 'required')
                    ? 'required'
                    : ''}
                  ${this.getAuthScriptValueFromIdoResponse(input, 'passkeys', 'webauthn_encoded_result', 'readonly')
                    ? 'readonly'
                    : ''}
                  placeholder=" "
                />
                <label for="passkey-input">UserId *</label>
              </div>
              <button type="submit" id="submit-passkeys" class="full-width">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <div id="button-links-wrapper" class="row">
        <button class="secondary full-width" id="submit-branch_1">Register Now</button>
      </div>
      <div id="step-error" class="alert error"></div>
    ` /* HTML-END */);
  }

  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    window.tsPlatform.webauthn.authenticate.autofill.activate({
      onSuccess: (webauthn_encoded_result: string) => {
        submitStep({
          options: this.getClientResponseOptions('passkeys'),
          data: { type: 'webauthn', webauthn_encoded_result: webauthn_encoded_result },
        });
      },
      onError: (error: any) => {
        console.log(error.message);
      },
    });

    this.setupTabs();

    this.setupFormLinkListeners('password', submitStep);
    this.setupFormLinkListeners('passkeys', submitStep);
    this.setupButtonLinkListeners('branch_1', submitStep);

    if (input?.data?.error_data && input.data.error_data !== 'null') {
      commonHelpers.getElement<HTMLDivElement>(`#step-error`)!.innerHTML = input.data.error_data;
    }
  }

  private setupTabs() {
    const buttons = commonHelpers.getElements('.tab-button');

    // Add click event listener to each button
    buttons.forEach((button) => {
      const tabId = button.id.replace(/^tab-button-/, '');
      button.addEventListener('click', async () => this.selectTab(tabId));
    });

    this.selectTab('password');
  }

  private selectTab(tabId: string) {
    // Hide all tab contents
    commonHelpers.getElements('.tab-content').forEach((tabContent) => {
      (tabContent as HTMLElement).style.display = 'none';
    });

    // Remove 'active' class from all tab links
    commonHelpers.getElements('.tab-button').forEach((tabLink) => {
      tabLink.classList.remove('active');
    });

    // Show the current tab and add 'active' class to the button
    const tabContentElement = commonHelpers.getElement(`#content-${tabId}`);
    if (tabContentElement) {
      tabContentElement.style.display = 'block';
    }

    const tabElement = commonHelpers.getElement(`#tab-button-${tabId}`);
    if (tabElement) {
      tabElement.classList.add('active');
    }
  }


  private setupFormLinkListeners(formId: string, submitStep: StepResolver) {
    const form = commonHelpers.getElement<HTMLFormElement>(`#form-${formId}`);
    if (!form) {
      return;
    }

    // Only prevent form submission - remove other event preventions
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // Handle submission through submit button
    const submitButton = commonHelpers.getElement<HTMLButtonElement>(`#submit-${formId}`);
    if (submitButton) {
      submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        window.tsPlatform.webauthn.authenticate.autofill.abort();

        if (formId === 'passkeys') {
          const username = commonHelpers.getInputValue('#passkey-input');

          try {
            const webauthn_encoded_result = await window.tsPlatform.webauthn.authenticate.modal(username);
            data.webauthn_encoded_result = webauthn_encoded_result;
          } catch (error) {
            data.webauthn_encoded_result = '';
          }
        }

        submitStep({
          options: this.getClientResponseOptions(formId),
          data,
        });
      });
    }
  }


  private setupButtonLinkListeners(buttonId: string, submitStep: StepResolver) {
    commonHelpers.addLoadingButtonClickListener(`#submit-${buttonId}`, () => {
      window.tsPlatform.webauthn.authenticate.autofill.abort();

      submitStep({
        options: this.getClientResponseOptions(buttonId),
        data: {},
      });
    });
  }

  /**
   * Use ClientInput for main form, otherwise use the alternateBranchId as the option type
   */
  private getClientResponseOptions(alternateBranchId: string) {
    return alternateBranchId === 'login_form_1'
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
      // const branch = input.clientResponseOptions[`${formId}`];
      // if (branch?.schema) {
      //   field = branch.schema.find((f: any) => f.name === fieldName);
      // }
    }

    return field?.[`${property}`];
  }
}
