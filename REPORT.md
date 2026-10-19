# Voxgig SDK Generator — Developer Experience Report

## 1. Objective

The objective of this mini task was to use the Voxgig SDK generator to build an open-source SDK under the MIT License for an API not already represented in Voxgig's open-source SDK catalogue, publish the project on my own GitHub account, and document my observations of the generator.

I chose the **Tavily Search API** and generated a TypeScript SDK.

## 2. Workflow

I started by defining the API contract in an OpenAPI specification, including the search endpoint, request parameters, authentication, and response structure. I then used the Voxgig SDK generation workflow to create the TypeScript SDK project.

The generated project included client and operation code, package configuration, documentation, automated tests, and supporting test utilities. I reviewed the project structure, installed the required dependencies, and configured a local environment variable for my Tavily API key. I also used `dotenv` to load the key for a separate live-test script, keeping the credential out of the source code.

After building and testing the SDK, I published the project to my GitHub repository:

[https://github.com/khadeejah-01/tavily-sdk](https://github.com/khadeejah-01/tavily-sdk)

## 3. Validation

The TypeScript build completed successfully. The automated test run reported **205 passed, 0 failed, and 9 skipped tests**. The skipped tests related to features that were not generated, according to the test output.

I also ran a live request against the Tavily Search API through the generated SDK. The request succeeded and returned search results, providing evidence that the generated client could communicate with the real service for this use case.

These checks cover the build, the generated test suite, and one live search request. They do not establish complete API coverage or verify every possible request, response, and error condition.

## 4. Observations on the generator

A useful aspect of the generator was the amount of project structure it produced from the API specification. Rather than starting with an empty TypeScript project, I received client and operation code alongside documentation, package configuration, and tests. This provided a concrete starting point for inspecting and validating the SDK.

The entity-oriented interface, such as `client.Search().create(...)`, offered a readable way to invoke a search operation. The generated project also included lower-level request methods and mock-testing support, providing additional ways to inspect requests and test behavior without always depending on the live service.

The experience also showed me that generation does not remove the need to review the API contract and generated output. Documentation examples and field descriptions need to be checked for relevance and clarity, while package metadata and repository links need attention before publication. The specification must accurately describe the API, and a successful build or mock test alone cannot establish that the SDK behaves correctly against the real service.

## 5. Limitations and conclusion

My validation was limited to the generated test suite and a successful live search request. I did not verify every endpoint, parameter combination, or error scenario, so I cannot claim comprehensive coverage.

Overall, the generator provided a useful starting point for producing a structured TypeScript SDK. My main takeaway is that the quality of the result depends not only on code generation, but also on the accuracy of the OpenAPI specification, review of the generated project, and appropriate testing against the actual API.
