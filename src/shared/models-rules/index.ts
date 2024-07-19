import { AppRequest } from '../models'

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(_request: AppRequest): string {
  return '7b92aff8-7446-4ef7-ad46-dce4fb4057cc'
  //return request.user && request.user.id;
}
