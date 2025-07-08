import { StepHandlers, UiStepType } from './stepHandlers';
import { getElement } from './common.ts';
//import { config } from './config';
import { IdoJourneyActionType, IdoServiceResponse } from './types/sdk_interfaces';
import { IdoSdkState, SdkState } from './sdkState';

export class JourneyExecutor {
  public async startJourney() {
    console.log('Starting journey');

    try {
      const interactionId = (new URLSearchParams(window.location.search)).get("src_interaction");
      const idoResponse = await window.tsPlatform.ido.startSsoJourney(interactionId);
      //const idoResponse = await window.tsPlatform.ido.startJourney(config.journeyName, { additionalParams });
      let debugPin: string | undefined;

      if (this.isJourneyActive(idoResponse.journeyStepId)) {
        debugPin = await window.tsPlatform.ido.generateDebugPin();
      }

      await this.executeJourney(idoResponse, debugPin);
    } catch (e: any) {
      console.error('Failed to start journey', e);
      await StepHandlers[UiStepType.Error].handle(e);
    }
  }

  public async resumeJourney(state: IdoSdkState) {
    console.log('Restoring from serialized state');

    try {
      const idoResponse = window.tsPlatform.ido.restoreFromSerializedState(state.state);
      const debugPin = state.debugPin;

      await this.executeJourney(idoResponse, debugPin);
    } catch (e: any) {
      console.error('Failed to resume journey', e);
      await StepHandlers[UiStepType.Error].handle(e);
    }
  }

  private async executeJourney(idoResponse: IdoServiceResponse | undefined, debugPin: string | undefined) {
    try {
      do {
        // Save the state after each step
        await SdkState.setState(debugPin);
        this.setDebugPin(debugPin);

        console.log('Handling step', idoResponse);
        idoResponse = await this.handleJourneyStep(idoResponse);
      } while (idoResponse);
    } catch (e: any) {
      console.error('Failed during executing journey', e);
      await StepHandlers[UiStepType.Error].handle(e);
    }
  }

  private async handleJourneyStep(
    idoResponse: IdoServiceResponse | undefined,
  ): Promise<IdoServiceResponse | undefined> {
    if (!idoResponse) {
      throw new Error(`No response`);
    }

    const stepId = idoResponse.journeyStepId;
    if (!stepId) {
      throw new Error(`No journey step ID in response`);
    }

    console.debug(`handle journey step ${stepId}`);
    const handler = StepHandlers[stepId];
    if (!handler) {
      throw new Error(
        `No handler for journey step ${stepId}.</br></br>If you modified the journey after the code was downloaded,</br>downloading new code will fix this problem.`,
      );
    }

    const uiResponse = await handler.handle(idoResponse);
    if (!uiResponse) {
      return;
    }

    return window.tsPlatform.ido.submitClientResponse(uiResponse.options, uiResponse.data);
  }

  private isJourneyActive(journeyStepId: IdoJourneyActionType | string | undefined) {
    return IdoJourneyActionType.Success !== journeyStepId && IdoJourneyActionType.Rejection !== journeyStepId;
  }

  private setDebugPin(debugPin?: string) {
    if (debugPin) {
      getElement<HTMLDivElement>('#debug-pin')!.innerHTML = /* HTML */ `<img
          src="/grey-info.svg"
          title="Use this pin in the journey debugger in order to debug this experience"
        />
        <div class="key">Debug PIN:</div>
        <div class="value">${debugPin}</div>
        <img src="/copy.svg" id="debug-pin-copy" />`;

      const copyButton = getElement<HTMLImageElement>('#debug-pin-copy');
      copyButton?.addEventListener('click', () => {
        navigator.clipboard.writeText(debugPin!);
        copyButton.src = '/check.svg';
        setTimeout(() => {
          copyButton.src = '/copy.svg';
        }, 3000);
      });
    }
  }
}
