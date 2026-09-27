# Jev Avant Boamp

    **Detect reviewable procurement signals in French local deliberations before a matching BOAMP notice appears.**

    [![Tests](https://github.com/gbesse/jev-avant-boamp/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-avant-boamp/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · Public alpha

    ## Try it

    ```sh
    git clone https://github.com/gbesse/jev-avant-boamp.git
    cd jev-avant-boamp
    npm install
    npm run demo
    ```

    The demo uses synthetic records and fixture probabilities. It makes no network call and makes no claim about measured Jev quality.

    ## Use the library

    Import the domain functions from `@gbesse/jev-avant-boamp` and provide either `createJevClient()` from the `./jev` export or the offline `createFakeProvider()` test double. The complete runnable path is in `examples/demo.mjs`.

    ## Decision boundary

    SCDL validation, buyer identity and chronology stay in code. Jev labels procurement intent and project relationships; positive matches are leads for review, never tender forecasts.

    ## Data provenance

    The input contract follows SCDL Délibérations 2.0. BOAMP provides a separate open API for published notices, so the package can later verify whether an early signal became a notice.

    Official references:

    - [https://schema.data.gouv.fr/scdl/deliberations/2.0.0/documentation.html](https://schema.data.gouv.fr/scdl/deliberations/2.0.0/documentation.html)
- [https://www.boamp.fr/pages/api-boamp/](https://www.boamp.fr/pages/api-boamp/)

    Keep upstream attribution, source URLs, retrieval dates and original identifiers with every derived record.

    ## Real Jev requests

    Real requests are opt-in, paid, and sent to `https://api.typesafe.ai/v1/systemone`. The client pins `jev-1.13.0`, validates the returned model and all probabilities, rejects redirects, retries only network failures plus HTTP 429/529, and refuses state above a conservative 24,000-token estimate.

    ```sh
    TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
    ```

    Never send personal data, secrets, or full unredacted case files. Evaluate representative French labels before operational use.

    ## Validation

    `npm run validate` runs syntax checks, strict public-type checks, tests, and the offline demo on Node.js 22 and 24 in CI.

    Independent project; not affiliated with TypeSafe AI or the French administration. See the [Jev API documentation](https://docs.typesafe.ai/api) and [model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
