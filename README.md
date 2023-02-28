1ed7546# _⚠️ MOVED TO [OpenFn/adaptors](https://github.com/OpenFn/adaptors)! ⚠️_

**N.B.: New versions are available at:
https://github.com/OpenFn/adaptors/tree/main/packages/xml**

# Language XML Scraper (Archived)


Language Pack for scraping XML data from websites.

Documentation
-------------

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
fetch("spreadsheetId", {
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
