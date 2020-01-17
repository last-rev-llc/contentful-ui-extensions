/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import {Tabs, Tab, TabPanel, TextField, FieldGroup, RadioButtonField, FormLabel, Note, AssetCard, HelpText, Button} from '@contentful/forma-36-react-components';
import { get, isEmpty } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import './Seo.scss';
import PropTypes from 'prop-types';

const Seo = ({ sdk }) => {
  const [seoObject, setSeoObject] = useState({});
  const [selected, setSelected] = useState('preview');
  const [pageTitleValue, setPageTitleValue] = useState('');

  useEffect(() => {
    setSeoObject(sdk.field.getValue());
  }, [sdk.field]);  

  const onFieldChange = (field) => {
    setSeoObject({
      ...seoObject,
      [field.name]: {
        name: field.name,
        value: field.value
      },
    });
    sdk.field.setValue(seoObject);
  };

  const isSearchVisible = () => {
    return get(seoObject, 'robots.value', '') === 'index,follow';
  };

  const renderTabs = () => {
    return (
      <Tabs withDivider>
        <Tab id="preview"
          selected={selected === 'preview'}
          onSelect={() => setSelected('preview')}>Preview</Tab>
        <Tab id="general"
          selected={selected === 'general'}
          onSelect={() => setSelected('general')}>General</Tab>
        <Tab id="facebook"
          selected={selected === 'facebook'}
          onSelect={() => setSelected('facebook')}>Facebook</Tab>
        <Tab id="twitter"
          selected={selected === 'twitter'}
          onSelect={() => setSelected('twitter')}>Twitter</Tab>
      </Tabs>
    );
  };

  const renderPreview = () => {
    return (
      <TabPanel id="preview"
        className="tab-panel">
        <div className="search-preview">
          <a href="#">
            <h3 className="">{get(seoObject, 'title.value', 'Please enter a page Title')}</h3>
            <br />
            <div className="cite">
              <cite className="">https://www.lastrev.com › company › about</cite>
            </div>
            <div className="description">
              {get(seoObject, 'description.value', 'Please enter a meta description that is between 100 and 250 characters long')}
            </div>
          </a>
        </div>
      </TabPanel>
    );
  };

  // sdk.entry.fields.title.onValueChanged((value) => {
  //   console.log('VALUE', value);
  //   if(value && value !== pageTitleValue) {
  //     console.log('will change');
  //     onFieldChange({
  //       name: 'title',
  //       value: `${get(sdk, 'parameters.installation.siteName', '')} | ${value}`
  //     });
  //   }
  // });


  const renderGeneralTab = () => {
    return (
      <TabPanel id="general"
        className="tab-panel">
        {console.log('CURRENT TITLE', get(seoObject, 'title.value'))}
        <TextField id="title"
          testid="Seo-title"
          name="title"
          labelText="Page Title"
          helpText="Browser tab and search engine result display."
          textInputProps={{
            maxLength: 60,
            onKeyPress: (e) => onFieldChange(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          value={
            isEmpty(get(seoObject, 'title.value')) ?
              get(sdk, 'parameters.installation.siteName', '') :
              get(seoObject, 'title.value')
          }
          countCharacters
          onChange={(e) => onFieldChange(e.currentTarget)}
          onBlur={(e) => onFieldChange(e.currentTarget)}
          className="fieldset" />
        <TextField id="description"
          textarea
          testid="Seo-description"
          name="description"
          labelText="Description"
          value={get(seoObject, 'description.value') || ''}
          helpText="The short description in search engine result display."
          textInputProps={{
            maxLength: 158
          }}
          countCharacters
          onChange={(e) => onFieldChange(e.currentTarget)}
          onBlur={(e) => onFieldChange(e.currentTarget)}
          className="fieldset" />
        <TextField id="keywords"
          testid="Seo-keywords"
          name="keywords"
          labelText="Keywords"
          value={get(seoObject, 'keywords.value') || ''}
          helpText="Keywords used for search engine indexing."
          textInputProps={{
            maxLength: 255
          }}
          countCharacters
          onChange={(e) => onFieldChange(e.currentTarget)}
          onBlur={(e) => onFieldChange(e.currentTarget)}
          className="fieldset" />
        <FieldGroup className="fieldset">
          <FormLabel className="fieldset"
            htmlFor="robots">Would you like this content to be indexed by search engines?</FormLabel>
          <RadioButtonField
            labelText="Yes"
            name="robots"
            checked={isSearchVisible()}
            value="index,follow"
            onChange={(e) => onFieldChange(e.currentTarget)}
            id="robots1"
            inputProps={{
              onBlur: (e) => onFieldChange(e.currentTarget)
            }}/>
          <RadioButtonField
            labelText="No"
            name="robots"
            checked={!isSearchVisible()}
            value="noindex,nofollow"
            onChange={(e) => onFieldChange(e.currentTarget)}
            id="robots2"
            inputProps={{
              onBlur: (e) => onFieldChange(e.currentTarget)
            }}/>
        </FieldGroup>
        {isSearchVisible() ?  null : <Note noteType="warning">Your content is not being indexed</Note>}
      </TabPanel>
    );
  };

  const handleAssetSelection = async (metaTagName) => {
    const asset = await sdk.dialogs.selectSingleAsset({
      locale: sdk.field.locale,
    });
    // TODO: add status https://www.contentful.com/developers/docs/tutorials/general/determine-entry-asset-state/
    onFieldChange({
      name: metaTagName,
      value: {
        url: `https:${get(asset, `fields.file.${get(sdk, 'field.locale')}.url`)}`,
        id: get(asset, 'sys.id'),
        title: get(asset, `fields.title.${get(sdk, 'field.locale')}`),
      }});
  };

  const renderSocialImage = (metaTag) => {
    const image = get(seoObject, metaTag);

    if(image && image.value) {
      return (
        <div>
          <AssetCard
            className="social-image"
            status="published"
            type="image"
            isLoading={false}
            src={image.value.url}
            title={image.value.title}
            size="default" />
        </div>
      );

    }
    return (
      <div>
        <Button buttonType="positive"
          onClick={() => handleAssetSelection('og:image')}>Select an Image</Button>
      </div>
    );
  };

  const renderFacebookTab = () => {
    // TODO: Add a preview for facebook https://github.com/hugodias/facebook-post-preview/blob/master/src/components/facebook-mobile-post/FacebookMobilePost.js
    return (
      <TabPanel id="facebook"
        className="tab-panel">        
        <TextField id="og:title"
          testid="Seo-facebook-og:title"
          name="og:title"
          labelText="Post Title"
          helpText="The title of your article without any branding such as your site name."
          textInputProps={{
            maxLength: 60,
            onKeyPress: (e) => onFieldChange(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          value={get(seoObject, 'og:title.value' || '')}
          countCharacters
          onChange={(e) => onFieldChange(e.currentTarget)}
          onBlur={(e) => onFieldChange(e.currentTarget)} />
        <TextField id="og:description"
          textarea
          testid="Seo-og:description"
          name="og:description"
          labelText="Description"
          value={get(seoObject, 'og:description.value') || ''}
          helpText="A brief description of the content, usually between 2 and 4 sentences. This will displayed below the title of the post on Facebook."
          textInputProps={{
            maxLength: 255
          }}
          countCharacters
          onChange={(e) => onFieldChange(e.currentTarget)}
          onBlur={(e) => onFieldChange(e.currentTarget)}
          className="fieldset" />
        <FormLabel className="fieldset"
          htmlFor="robots">Post Image</FormLabel>
        {renderSocialImage('og:image')}
        <HelpText>Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels to display link page posts with larger images.</HelpText>

      </TabPanel>
    );
  };

  const renderTwitterTab = () => {
    return (
      <TabPanel id="facebook"
        className="tab-panel">Twitter</TabPanel>
    );
  };

  const renderUiExtension = () => {
    return (
      <>
        {renderTabs()}
        {selected === 'preview' && (
          renderPreview()
        )}
        {selected === 'general' && (
          renderGeneralTab()
        )}
        {selected === 'facebook' && (
          renderFacebookTab()
        )}
        {selected === 'twitter' && (
          renderTwitterTab()
        )}
      </>
    );
  };

  return (
    <>
      {renderUiExtension()}
      {console.log(sdk)}
    </>
  );

  
};

Seo.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
    }),
    dialogs: PropTypes.shape({
      selectSingleAsset: PropTypes.func.isRequired,
    }).isRequired
  }).isRequired
};

export default Seo;
