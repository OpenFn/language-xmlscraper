import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request';
import { resolve as resolveUrl } from 'url';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
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
 * Write a new row to a google sheets table
 * @example
 * execute(
 *   appendValues(table, params)
 * )(state)
 * @function
 * @param {object} params - data to write to the row
 * @returns {Operation}
 */
export function scrape(params) {

  return state => {

    function assembleError({ response, error }) {
      if (response && ([200,201,202].indexOf(response.statusCode) > -1)) return false;
      if (error) return error;
      return new Error(`Server responded with ${response.statusCode}`)
    }

    const { url } = expandReferences(params)(state);

    const { username, password } = state.configuration;

    const req = request.defaults({
      jar: true,
      followAllRedirects: true
    });

    req.post(
      {
        url: url,
        headers : {
          'User-Agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36"
        }
        ,
        formData: {
          "sap-user": username,
          "sap-password": password
        }
      }, function(error, response, body){
        console.log(body);
    	if(!error && response.statusCode == 200){
    		const dom = cheerio.load(body)
        req.post(
          {
            url: "http://dpdercorda.derco.cl:8080/sap(bD1lcyZjPTMwMA==)/bc/bsp/sap/zdp_opermante/c_opermante_ingreso.do"
            ,
            query: {
              "htmlbScrollX": 4,
              "htmlbScrollY": 6,
              "htmlbevt_ty": "htmlb:button:click:null",
              "htmlbevt_frm": "formulario",
              "htmlbevt_oid": "msg_header_buscar_mante",
              "htmlbevt_id": "limpiardatos",
              "htmlbevt_cnt": 0,
              "onInputProcessing": "htmlb",
              "sap-htmlb-design": "",
              "msg_header_dd_marca": "03",
              "msg_header_dd_modelservi": "AREN_MEGANE_III_1.6",
              "msg_header_dd_tipo_mante": "A010"
            }
          }, function(error, response, body){
            // console.log(response.headers);
            // console.log(response.headers['set-cookie']);
            console.log(response);
            // console.log(body);
            if(!error && response.statusCode == 200){
              const dom = cheerio.load(body)
              console.log(dom.html);
            }
          });
    	}
    })




  }
  // curl 'http://dpdercorda.derco.cl:8080/sap(bD1lcyZjPTMwMA==)/bc/bsp/sap/zdp_opermante/c_opermante_ingreso.do' \
  //   -H 'Cookie:
  //   sap-contextid=SID%3aANON%3alprvsaperpa04_VMP_00%3aHgjptoN51bq8qprFbctdhy1NFkAGo89JYPx-VM1b-NEW;
  //   sap-appcontext=c2FwLXNlc3Npb25pZD1TSUQlM2FBTk9OJTNhbHBydnNhcGVycGEwNF9WTVBfMDAlM2FIZ2pwdG9ONTFicThxcHJGYmN0ZGh5MU5Ga0FHbzg5SllQeC1WTTFiLUFUVA%3d%3d;
  //   sap-usercontext=sap-language=S&sap-client=300;
  //   MYSAPSSO2=AjQxMDMBABhGAFQATwBSAFIARQBTAE0AIAAgACAAIAACAAYzADAAMAADABBWAE0AUAAgACAAIAAgACAABAAYMgAwADEAOAAwADIAMQA1ADIAMAAwADYABQAEAAAACAYAAlgACQACUwD%2fAVYwggFSBgkqhkiG9w0BBwKgggFDMIIBPwIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYIBHjCCARoCAQEwbzBkMQswCQYDVQQGEwJERTEcMBoGA1UEChMTU0FQIFRydXN0IENvbW11bml0eTETMBEGA1UECxMKU0FQIFdlYiBBUzEUMBIGA1UECxMLSTAwMjAyODMxMTAxDDAKBgNVBAMTA1ZNUAIHIBIBIxUlUTAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTgwMjE1MjAwNjUxWjAjBgkqhkiG9w0BCQQxFgQUamkwKZoOQUPc9XVHHkwwMvILOfcwCQYHKoZIzjgEAwQvMC0CFQCEU1dZkNwYZtSEqsGKeWWh9kEOhAIUcip3JIHG%21xnMXQC9UCgRP%21RE6ec%3d;
  //   SAP_SESSIONID_VMP_300=1YcCYLZYjw7d5gGU49O-PMKXIh4SixHoox8AUFaUrE0%3d' \
  //   -H 'Origin: http://dpdercorda.derco.cl:8080' \
  //   -H 'Accept-Encoding: gzip, deflate' \
  //   -H 'Accept-Language: en-US,en;q=0.8,es;q=0.6' \
  //   -H 'Upgrade-Insecure-Requests: 1' \
  //   -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36' \
  //   -H 'Content-Type: application/x-www-form-urlencoded' \
  //   -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8' \
  //   -H 'Cache-Control: max-age=0' \
  //   -H 'Referer: http://dpdercorda.derco.cl:8080/sap(bD1lcyZjPTMwMA==)/bc/bsp/sap/zdp_opermante/c_opermante_ingreso.do' \
  //   -H 'Connection: keep-alive' \
  //   --data 'htmlbScrollX=4&htmlbScrollY=6&htmlbevt_ty=htmlb%3Abutton%3Aclick%3Anull&htmlbevt_frm=formulario&htmlbevt_oid=msg_header_buscar_mante&htmlbevt_id=limpiardatos&htmlbevt_cnt=0&onInputProcessing=htmlb&sap-htmlb-design=&msg_header_dd_marca=03&msg_header_dd_modelservi=AREN_MEGANE_III_1.6&msg_header_dd_tipo_mante=A010' --compressed
}

export {
  field, fields, sourceValue, alterState, each,
  merge, dataPath, dataValue, lastReferenceValue
} from 'language-common';
