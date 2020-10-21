import { each } from "lodash";

/* global Coveo */
class CoveoSearchService {
  static async getInstance({ sdk, listeners }) {
    if (!CoveoSearchService._instance) {
      CoveoSearchService._instance = new CoveoSearchService({ sdk });
      await CoveoSearchService._instance.init(listeners);
    }
    return CoveoSearchService._instance;
  }

  constructor({ sdk }) {
    this.endpoint = sdk.parameters.installation.endpoint;
  }

  async init() {
    let counter = 0;
    while (counter < 5 && typeof Coveo === "undefined") {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 1000));
      counter += 1;
    }

    if (typeof Coveo === "undefined") {
      throw Error("Unable to initialize Coveo library!");
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify({
        action: "GET_API_DATA"
      })
    });

    const {
      data: { apiKey, org }
    } = await response.json();

    await Coveo.SearchEndpoint.configureCloudV2Endpoint(org, apiKey);
  }

  // eslint-disable-next-line class-methods-use-this
  async initCoveo(searchContainer, listeners = [], existingState) {
    let counter = 0;
    while (counter < 5 && typeof Coveo === "undefined") {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 1000));
      counter += 1;
    }

    if (typeof Coveo === "undefined") {
      throw Error("Unable to initialize Coveo library!");
    }

    Coveo.init(searchContainer);

    const root = document.querySelector("#search");

    if (existingState) {
      Coveo.state(root, existingState);
      Coveo.executeQuery(root);
    }

    each(listeners, (handle, key) => {
      Coveo.$$(root).on(key, (_e, args) => {
        handle(args, Coveo.state(root).attributes);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  initSearchbox(searchBox, searchPageUri, options = {}) {
    Coveo.initSearchbox(searchBox, searchPageUri, options);
  }
}

// TODO: Not sure why static class members aren't accepted
// So had to write it in this format ?!?
CoveoSearchService._instance = null;

export default CoveoSearchService;
