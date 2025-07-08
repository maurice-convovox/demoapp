import { StepHandler, StepResponse } from '../types/stepHandler';
import { StepResolver } from '../stepHandlers';
import { ClientResponseOptionType, IdoServiceResponse } from '../types/sdk_interfaces';
import { showErrorPage } from '../common';

/**
 * Handles the Risk Recommendations step of the journey.
 * Triggers a risk assessment action and submits the resulting action token.
 */
export class RiskRecommendationsStepHandler implements StepHandler {
  public async handle(input?: IdoServiceResponse): Promise<StepResponse | void> {
    return new Promise<StepResponse | void>(async (submitStep: StepResolver) => {
      try {
        await this.setEventListeners(submitStep, input);
      } catch (e: any) {
        showErrorPage(e);
      }
    });
  }
  protected async setEventListeners(submitStep: StepResolver, input?: IdoServiceResponse) {
    const correlationId = input?.data?.correlation_id;
    if (!correlationId) {
      throw new Error('Missing correlationId in IDO service response');
    }

    const { actionToken } = await window.tsPlatform.drs.triggerActionEvent(input?.data?.action_type, {
      correlationId: input?.data?.correlation_id,
      claimedUserId: input?.data?.user_id,
    });

    submitStep({
      options: ClientResponseOptionType.ClientInput,
      data: { action_token: actionToken },
    });
  }
}
