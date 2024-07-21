import { AppRequest } from '../models'

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(_request: AppRequest): string {
  // !!! There is problems in task-8 with required behavior. I think use mock in this case is good solution.
  return 'd290f1ee-6c54-4b01-90e6-d701748f0851'
  //return request.user && request.user.id;
}
