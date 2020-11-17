const success = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '9o4l1mrd1tci'
      }
    },
    id: '2OjCqPfrMWmUxlCHOT4ovc',
    type: 'Asset',
    createdAt: '2019-10-29T17:31:31.862Z',
    updatedAt: '2020-01-24T22:44:10.955Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment'
      }
    },
    publishedVersion: 9,
    publishedAt: '2020-01-24T22:44:10.955Z',
    firstPublishedAt: '2020-01-24T22:40:38.664Z',
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '6Ntte0Bfc9VTOdBwRFarLv'
      }
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '6Ntte0Bfc9VTOdBwRFarLv'
      }
    },
    publishedCounter: 2,
    version: 10,
    publishedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '6Ntte0Bfc9VTOdBwRFarLv'
      }
    }
  },
  fields: {
    title: {
      'en-US': 'Screen Shot 2020-01-23 at 8.09.12 AM'
    },
    description: {
      'en-US': 'asdfasdfasdf'
    },
    file: {
      'en-US': {
        url:
          '//images.ctfassets.net/9o4l1mrd1tci/2OjCqPfrMWmUxlCHOT4ovc/e61c74e8219f0b1e8dd0c9d10b4c426b/Screen_Shot_2020-01-23_at_8.09.12_AM.png',
        details: {
          size: 131089,
          image: {
            width: 1936,
            height: 1118
          }
        },
        fileName: 'Screen Shot 2020-01-23 at 8.09.12 AM.png',
        contentType: 'image/png'
      }
    }
  }
};

const error = {
  sys: {
    type: 'Error',
    id: 'NotFound'
  },
  message: 'The resource could not be found.',
  details: {
    type: 'Asset',
    id: '2OjCqPfrMWmUxlCHOT4ov',
    environment: 'master',
    space: '9o4l1mrd1tci'
  },
  requestId: '7d52556546b10f7b1064055a1c8fee18'
};

const mockContentfulAsset = {
  success,
  error
};

export default mockContentfulAsset;
