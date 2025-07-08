import { StepHandler, StepResponse } from './types/stepHandler';
import { IdoJourneyActionType } from './types/sdk_interfaces';
import { StartStepHandler } from './steps/startStepHandler';
import { ErrorStepHandler } from './steps/errorStepHandler';
import { RejectAccessStepHandler } from './steps/rejectAccessStepHandler';
import { DebugBreakpointStepHandler } from './steps/debugBreakpointStepHandler';
import { CompleteJourneyStepHandler } from './steps/completeJourneyStepHandler';
import { FormLoginStepHandler } from './steps/formLoginStepHandler';
import {DisplayInformationStepHandler} from "./steps/displayInformationStepHandler.ts";
import {EmailOTPAuthenticationStepHandler} from "./steps/emailOTPAuthenticationStepHandler.ts";
import { FormGetInfoFromClient1StepHandler } from './steps/formGetInfoFromClient1StepHandler';
import { FormLoginForm1StepHandler } from './steps/formLoginForm1StepHandler';

export const UiStepType = {
  ...IdoJourneyActionType,
  ['Start']: 'step:start',
  ['Error']: 'step:error',
  ['Login']: 'login',
  ['GetInfoFromClient1']: 'get_info_from_client_1',
  ['LoginForm1']: 'login_form_1',
};

export type StepResolver = (value: PromiseLike<StepResponse | void> | StepResponse | void) => void;

export const StepHandlers: { [key: string]: StepHandler } = {
  [UiStepType['Start']]: new StartStepHandler(),
  [UiStepType['Error']]: new ErrorStepHandler(),
  [UiStepType['Rejection']]: new RejectAccessStepHandler(),
  [UiStepType['DebugBreak']]: new DebugBreakpointStepHandler(),
  [UiStepType['Success']]: new CompleteJourneyStepHandler(),
  [UiStepType['Login']]: new FormLoginStepHandler(),
  [UiStepType['Information']]: new DisplayInformationStepHandler(),
  [UiStepType['EmailOTPAuthentication']]: new EmailOTPAuthenticationStepHandler(),
  [UiStepType['Login']]: new FormLoginStepHandler(),
  [UiStepType['GetInfoFromClient1']]: new FormGetInfoFromClient1StepHandler(),
  [UiStepType['LoginForm1']]: new FormLoginForm1StepHandler(),
};
