import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { getUrlParams, showErrorPage } from '../common';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';

/**
 * Handles document verification steps using a hosted solution.
 * Manages redirection to the verification endpoint and processes the returned session data.
 *
 * NOTE: The redirect scenario is enabled by saving and restoring the SDK state,
 * as can be seen in the event loop. This allows the handler to maintain context
 * across page reloads and external redirects during the document verification process.
 */
export class DocumentVerificationHostedStepHandler implements StepHandler {
  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>(async (submitStep: StepResolver) => {
      try {
        await this.setEventListeners(submitStep, input);
      } catch (e: any) {
        showErrorPage(e);
      }
    });
  }
  protected setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    const params = getUrlParams();

    if (params.sessionId) {
      // Remove the query params from the URL
      window.history.replaceState({}, document.title, window.location.pathname);

      submitStep({
        options: ClientResponseOptionType.ClientInput,
        data: {
          payload: {
            state: params.state,
            sessionId: params.sessionId,
          },
        },
      });
    } else {
      window.location.href = input?.data?.payload.endpoint;
    }
  }
}
