Language Google Sheets [![Build Status](https://travis-ci.org/OpenFn/language-googlesheets.svg?branch=master)](https://travis-ci.org/OpenFn/language-googlesheets)
======================

Language Pack for building expressions and operations to make Google Sheets API calls.

Documentation
-------------
## appendRows

`https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:E1:append?valueInputOption=USER_ENTERED`

```json
{
  "range": "Sheet1!A1:E1",
  "majorDimension": "ROWS",
  "values": [
    ["Door", "$15", "2", "3/15/2016"],
    ["Engine", "$100", "1", "3/20/2016"],
  ],
}
```


#### sample configuration
```json
{
  "username": "taylor@openfn.org",
  "password": "supersecret",
  "baseUrl": "https://instance_name.surveycto.com",
  "authType": "digest"
}
```

#### sample fetch expression
```js
appendValues("spreadsheetId", {
  "getEndpoint": "api/v1/forms/data/wide/json/mod_coach",
  "query": function(state) {
      return { "date": dataValue("_json[(@.length-1)].SubmissionDate")(state) }
  },
  "postUrl": "http://localhost:4000/inbox/8ad63a29-5c25-4d8d-ba2c-fe6274dcfbab",
})
```

[Docs](docs/index)


Development
-----------

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
