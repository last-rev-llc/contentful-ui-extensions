const array = [
  {
    sys: {
      space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
      id: "seoApp",
      type: "ContentType",
      createdAt: "2020-01-16T19:49:47.854Z",
      updatedAt: "2020-01-16T19:49:48.265Z",
      environment: {
        sys: { id: "master", type: "Link", linkType: "Environment" }
      },
      publishedVersion: 1,
      publishedAt: "2020-01-16T19:49:48.265Z",
      firstPublishedAt: "2020-01-16T19:49:48.265Z",
      createdBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      updatedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      publishedCounter: 1,
      version: 2,
      publishedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      }
    },
    displayField: "title",
    name: "SEO App",
    description: "",
    fields: [
      {
        id: "title",
        name: "Title",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "description",
        name: "Description",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "mainImage",
        name: "Main Image",
        type: "Link",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        linkType: "Asset"
      },
      {
        id: "seo",
        name: "SEO",
        type: "Object",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
      id: "uiExtensionShowcase",
      type: "ContentType",
      createdAt: "2019-10-24T05:20:32.176Z",
      updatedAt: "2020-01-15T17:56:39.260Z",
      environment: {
        sys: { id: "master", type: "Link", linkType: "Environment" }
      },
      publishedVersion: 57,
      publishedAt: "2020-01-15T17:56:39.260Z",
      firstPublishedAt: "2019-10-24T05:20:32.762Z",
      createdBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      updatedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      publishedCounter: 29,
      version: 58,
      publishedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      }
    },
    displayField: "colorPicker",
    name: "UI Extension Showcase",
    description: "",
    fields: [
      {
        id: "layoutBuilder",
        name: "Layout Builder",
        type: "Array",
        localized: false,
        required: false,
        validations: [],
        disabled: true,
        omitted: false,
        items: { type: "Link", validations: [], linkType: "Entry" }
      },
      {
        id: "layoutConfig",
        name: "Layout Config",
        type: "Object",
        localized: false,
        required: false,
        validations: [],
        disabled: true,
        omitted: false
      },
      {
        id: "colorPicker",
        name: "Color Picker",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [{ in: ["#FFFFFF", "#FF0000", "#00FF00", "#000000"] }],
        disabled: false,
        omitted: false
      },
      {
        id: "seoFields",
        name: "SEO Fields",
        type: "Object",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "categories",
        name: "Categories",
        type: "Array",
        localized: false,
        required: false,
        validations: [],
        disabled: true,
        omitted: false,
        items: { type: "Link", validations: [], linkType: "Entry" }
      },
      {
        id: "optimizelyResults",
        name: "Optimizely Results",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: true,
        omitted: false
      },
      {
        id: "templates",
        name: "Templates",
        type: "Array",
        localized: false,
        required: false,
        validations: [],
        disabled: true,
        omitted: false,
        items: { type: "Link", validations: [], linkType: "Entry" }
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
      id: "indexPage",
      type: "ContentType",
      createdAt: "2019-08-31T00:39:07.719Z",
      updatedAt: "2019-08-31T00:39:08.260Z",
      environment: {
        sys: { id: "master", type: "Link", linkType: "Environment" }
      },
      publishedVersion: 1,
      publishedAt: "2019-08-31T00:39:08.260Z",
      firstPublishedAt: "2019-08-31T00:39:08.260Z",
      createdBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      updatedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      publishedCounter: 1,
      version: 2,
      publishedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      }
    },
    displayField: "pageTitle",
    name: "Index Page",
    description: "",
    fields: [
      {
        id: "pageTitle",
        name: "Page Title",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "slug",
        name: "Slug",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "sections",
        name: "Sections",
        type: "Array",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        items: {
          type: "Link",
          validations: [{ linkContentType: ["sectionHero"] }],
          linkType: "Entry"
        }
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
      id: "sectionHero",
      type: "ContentType",
      createdAt: "2019-08-30T23:05:14.737Z",
      updatedAt: "2019-08-30T23:05:15.306Z",
      environment: {
        sys: { id: "master", type: "Link", linkType: "Environment" }
      },
      publishedVersion: 1,
      publishedAt: "2019-08-30T23:05:15.306Z",
      firstPublishedAt: "2019-08-30T23:05:15.306Z",
      createdBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      updatedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      },
      publishedCounter: 1,
      version: 2,
      publishedBy: {
        sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
      }
    },
    displayField: "headline",
    name: "Section Hero",
    description: "",
    fields: [
      {
        id: "headline",
        name: "Headline",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: "summary",
        name: "Summary",
        type: "Symbol",
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      }
    ]
  }
];

const single = {
  sys: {
    space: { sys: { type: "Link", linkType: "Space", id: "9o4l1mrd1tci" } },
    id: "seoApp",
    type: "ContentType",
    createdAt: "2020-01-16T19:49:47.854Z",
    updatedAt: "2020-01-16T19:49:48.265Z",
    environment: {
      sys: { id: "master", type: "Link", linkType: "Environment" }
    },
    publishedVersion: 1,
    publishedAt: "2020-01-16T19:49:48.265Z",
    firstPublishedAt: "2020-01-16T19:49:48.265Z",
    createdBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    },
    updatedBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    },
    publishedCounter: 1,
    version: 2,
    publishedBy: {
      sys: { type: "Link", linkType: "User", id: "6Ntte0Bfc9VTOdBwRFarLv" }
    }
  },
  displayField: "title",
  name: "SEO App",
  description: "",
  fields: [
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false
    },
    {
      id: "description",
      name: "Description",
      type: "Symbol",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false
    },
    {
      id: "mainImage",
      name: "Main Image",
      type: "Link",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
      linkType: "Asset"
    },
    {
      id: "seo",
      name: "SEO",
      type: "Object",
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false
    }
  ]
};

const mockContentfulContentType = {
  array, single
};

export default mockContentfulContentType;
