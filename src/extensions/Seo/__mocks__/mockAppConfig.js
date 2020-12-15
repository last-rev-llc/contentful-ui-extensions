const mockAppConfig = {
  siteName: 'Last Rev',
  pageTitleDelimiter: '|',
  editorInterface: {
    seoApp: {
      controls: [
        {
          fieldId: 'seo',
          settings: {
            defaultNoIndex: false,
            defaultPageTitleField: 'title',
            defaultDescriptionField: 'description',
            defaultCanonicalField: 'canonical',
            defaultSocialImageField: 'mainImage'
          }
        }
      ]
    }
  }
};

export default mockAppConfig;
