import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request';
import cheerio from 'cheerio';

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  }

  return state => {
    return commonExecute(...operations)({ ...initialState, ...state })
  };

}

/**
 * Parse
 * @example
 *   parse(params)
 * @function
 * @param {object} params - data to write to the row
 * @returns {Operation}
 */
export function parse(params) {

  return state => {

    // function assembleError({ response, error }) {
    //   if (response && ([200,201,202].indexOf(response.statusCode) > -1)) return false;
    //   if (error) return error;
    //   return new Error(`Server responded with ${response.statusCode}`)
    // }

    const { body } = expandReferences(params)(state);

    const dom = cheerio.load(body)

  }
}

export {
  field, fields, sourceValue, alterState, each,
  merge, dataPath, dataValue, lastReferenceValue
} from 'language-common';

export {
  get, post, put, patch, del
} from 'language-http';
