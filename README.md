# Tavily TypeScript SDK

A TypeScript SDK for the [Tavily API](https://tavily.com/), generated using the [Voxgig SDK generator](https://voxgig.com/sdk).

This project was created as part of **Voxgig Mini Task 1 – SDK Generator** to explore the generator's workflow, generated TypeScript client, documentation, and testing experience.

## Overview

The SDK provides a type-safe, asynchronous client for interacting with Tavily's search API. It uses an entity-oriented interface, allowing API operations to be accessed through methods such as `client.Search().create()` rather than requiring callers to construct every HTTP request manually.

### Key features

- TypeScript client with async/await support.
- Entity-oriented API access.
- Direct HTTP requests for endpoints not covered by entity methods.
- Request preparation for inspecting requests before sending them.
- Test transport for running mock-based tests without a live API.
- Extension hooks for customizing request and response processing.

## Installation

This package is not currently published to npm. Install dependencies from the project directory:

```bash
npm install
```

Build the TypeScript package:

```bash
npm run build
```

## Quick start

Create a Tavily API key through the [Tavily platform](https://app.tavily.com/).

Set your API key in an environment variable named `TAVILY_APIKEY`. Do not commit your actual API key or `.env` file.

```typescript
import { TavilySDK } from '@voxgig-sdk/tavily-sdk'

const client = new TavilySDK({
  apikey: process.env.TAVILY_APIKEY,
})

async function main() {
  try {
    const search = await client.Search().create({
      query: 'How do large language models work?',
    })

    console.log(search.data())
  } catch (error) {
    console.error('Tavily request failed:', error)
  }
}

main()
```

The import name above follows the generated package configuration. Use the package's compiled output or the appropriate local package installation when running the example.

## Error handling

Entity operations reject when a request fails, so use `try/catch` when calling them.

```typescript
try {
  const search = await client.Search().create({
    query: 'TypeScript',
  })

  console.log(search.data())
} catch (error) {
  console.error('Search failed:', error)
}
```

For lower-level access, `direct()` returns a result envelope that can be checked before using the response:

```typescript
const result = await client.direct({
  path: '/search',
  method: 'POST',
  body: {
    query: 'TypeScript',
  },
})

if (result.ok) {
  console.log(result.data)
} else {
  console.error('Request failed:', result.status, result.err)
}
```

`prepare()` can be used to inspect a request definition without sending it.

## Testing

Run the package's test suite from this directory:

```bash
npm test
```

The SDK also supports a mock test client:

```typescript
const client = TavilySDK.test()

const search = await client.Search().create({
  query: 'example query',
})

console.log(search.data())
```

### Live API test

A live test requires a valid Tavily API key. Configure the environment variables expected by the local live-test script, then run:

```bash
node test-live.mjs
```

Keep credentials in a local environment file that is excluded by `.gitignore`. Never include real API keys in source code, test fixtures, screenshots, or commits.

## SDK design

### Entity interface

The generated client exposes a `Search` entity with a `create()` operation. Successful entity operations return the entity instance, and `data()` provides access to the stored response data.

### Direct and prepared requests

- `direct()` sends a request and returns a result envelope.
- `prepare()` constructs a request definition for inspection.
- Entity methods provide a higher-level interface for supported operations.

### Extension hooks

The SDK supports extension features that can hook into stages of the operation pipeline, such as request preparation and response processing. This provides a way to customize behavior without rewriting the core client.

## Voxgig generator: developer experience and observations

This project was developed to evaluate the Voxgig SDK generator from a developer's perspective.

### What worked well

- **Entity-oriented interface:** The generated client provides a consistent abstraction over API operations, making the calling code easier to read.
- **Useful lower-level access:** The `direct()` and `prepare()` methods provide additional control when the higher-level entity interface is insufficient.
- **Testing support:** The mock test transport makes it possible to test client behavior without relying on a live API for every test.
- **Documentation and structure:** The generated project includes a README, Report (generator report), API reference, source code, and test suite, providing a useful starting point for exploring the SDK.

### Areas that need manual review

- **Documentation quality:** Some generated field descriptions are sparse, and example values such as placeholder queries need to be replaced with meaningful use cases.
- **Generated output verification:** Generated code and documentation should be checked against the actual API specification and expected API behavior rather than assumed to be correct automatically.
- **Live testing:** Mock tests are useful, but a real API request is still necessary to verify authentication, request construction, and compatibility with the live service.
- **Integration and packaging:** Package metadata, environment-variable instructions, build output, and installation steps should be reviewed before publishing or distributing the package.

### Validation performed

The project was built and its test suite was run during development. A live Tavily request was also tested successfully using a local API key.

The results provide a practical first evaluation of the generator, but they should not be interpreted as proof that every endpoint, input combination, or generated type has been validated.

### Overall assessment

The Voxgig generator provides a useful starting point for creating a structured TypeScript SDK, especially through its entity interface, test transport, and generated documentation. The main lesson from this task is that generation reduces the initial implementation effort, but the developer still needs to validate API behavior, review generated documentation, and test the client against the real service.

This project is an exploratory SDK-generation exercise, not a claim of complete coverage of the Tavily API.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
