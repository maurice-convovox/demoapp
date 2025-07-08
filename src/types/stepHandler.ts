import { ClientResponseOptionType, IdoServiceResponse } from './sdk_interfaces.ts';

export interface StepResponse {
  options: ClientResponseOptionType | string;
  data?: any;
}
export interface StepHandler {
  handle(input?: IdoServiceResponse): Promise<StepResponse | void>;
}
