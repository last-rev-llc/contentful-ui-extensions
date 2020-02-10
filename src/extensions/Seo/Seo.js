/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState } from 'react';
import {Tabs, Tab, TabPanel, TextField, FieldGroup, RadioButtonField, FormLabel, Note, HelpText } from '@contentful/forma-36-react-components';
import { get, isEmpty, omit, debounce } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import './Seo.scss';
import PropTypes from 'prop-types';
import SingleAssetWithButton from '../../shared/components/SingleAssetWithButton';

const Seo = ({ sdk }) => {
  const [seoObject, setSeoObject] = useState(sdk.field.getValue());
  const [selected, setSelected] = useState('preview'); 

  const onFieldChange = (field) => {
    sdk.field.setValue({
      ...seoObject,
      [field.name]: {
        name: field.name,
        value: field.value
      },
    }).then((response) => {
      setSeoObject(response);
    });
  };

  const onFieldChangeDebounce = debounce((field) => {
    return onFieldChange(field);
  }, 500, {
    leading: false,
  });

  const removeFieldProperty = (metaTagName) => {
    sdk.field.setValue(omit(seoObject, metaTagName))
      .then((response) => {
        setSeoObject(response);
      });
  };

  const handleAssetFieldChange = (metaTagName, asset) => {
    onFieldChange({
      name: metaTagName,
      value: {
        url: `https:${get(asset, `fields.file.${get(sdk, 'field.locale')}.url`)}`,
        id: get(asset, 'sys.id'),
        title: get(asset, `fields.title.${get(sdk, 'field.locale')}`),
      }});
  };

  const isSearchVisible = () => {
    return get(seoObject, 'robots.value', 'index,follow') === 'index,follow';
  };

  const renderTabs = () => {
    return (
      <Tabs withDivider
        testId="Seo-tabs">
        <Tab id="preview"
          selected={selected === 'preview'}
          onSelect={() => setSelected('preview')}
          testId="Seo-tab-preview">Preview</Tab>
        <Tab id="general"
          selected={selected === 'general'}
          onSelect={() => setSelected('general')}
          testId="Seo-tab-general">General</Tab>
        <Tab id="facebook"
          selected={selected === 'facebook'}
          onSelect={() => setSelected('facebook')}
          testId="Seo-tab-facebook">Facebook</Tab>
        <Tab id="twitter"
          selected={selected === 'twitter'}
          onSelect={() => setSelected('twitter')}
          testId="Seo-tab-twitter">Twitter</Tab>
      </Tabs>
    );
  };

  const renderPreview = () => {
    return (
      <TabPanel id="preview"
        className="tab-panel"
        testId="Seo-tabpanel-preview">
        <div className="search-preview">
          <a href="#">
            <h3 className=""
              data-test-id="Seo-tabpanel-preview-title">{get(seoObject, 'title.value', 'Please enter a page title')}</h3>
            <br />
            <div className="cite">
              <cite className=""
                data-test-id="Seo-tabpanel-preview-cite">https://www.example.com › path › slug</cite>
            </div>
            <div className="description"
              data-test-id="Seo-tabpanel-preview-description">
              {get(seoObject, 'description.value', 'Please enter a meta description that is between 100 and 250 characters long')}
            </div>
          </a>
        </div>
      </TabPanel>
    );
  };

  const renderGeneralTab = () => {
    return (
      <TabPanel id="general"
        className="tab-panel"
        testId="Seo-tabpanel-general">
        <TextField id="title"
          name="title"
          labelText="Page Title"
          helpText="Browser tab and search engine result display."
          textInputProps={{
            maxLength: 60,
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
            testId: "Seo-tabpanel-general-title"
          }}
          value={
            isEmpty(get(seoObject, 'title.value')) ?
              get(sdk, 'parameters.installation.siteName', '') :
              get(seoObject, 'title.value')
          }
          countCharacters
          className="fieldset" />
        <TextField id="description"
          textarea
          name="description"
          labelText="Description"
          value={get(seoObject, 'description.value') || ''}
          helpText="The short description in search engine result display."
          textInputProps={{
            maxLength: 158,
            testId: "Seo-tabpanel-general-description",
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          countCharacters
          className="fieldset" />
        <TextField id="keywords"
          name="keywords"
          labelText="Keywords"
          value={get(seoObject, 'keywords.value') || ''}
          helpText="Keywords used for search engine indexing."
          textInputProps={{
            maxLength: 255,
            testId: "Seo-tabpanel-general-keywords",
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          countCharacters
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
              onBlur: (e) => onFieldChange(e.currentTarget),
              testId: "Seo-tabpanel-general-robots-true"
            }} />
          <RadioButtonField
            labelText="No"
            name="robots"
            checked={!isSearchVisible()}
            value="noindex,nofollow"
            onChange={(e) => onFieldChange(e.currentTarget)}
            id="robots2"
            inputProps={{
              onBlur: (e) => onFieldChange(e.currentTarget),
              testId: "Seo-tabpanel-general-robots-false"
            }} />
        </FieldGroup>
        {isSearchVisible() ?  null : <Note noteType="warning"
          testId="Seo-tabpanel-general-noindex-note">Your content is not being indexed</Note>}
      </TabPanel>
    );
  };

  const renderFacebookTab = () => {
    // IDEA: Add a preview for facebook https://github.com/hugodias/facebook-post-preview/blob/master/src/components/facebook-mobile-post/FacebookMobilePost.js
    return (
      <TabPanel id="facebook"
        className="tab-panel"
        testId="Seo-tabpanel-facebook">        
        <TextField id="og:title"
          name="og:title"
          labelText="Post Title"
          helpText="The title of your article without any branding such as your site name."
          textInputProps={{
            maxLength: 60,
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
            testId: "Seo-tabpanel-og:title"
          }}
          value={get(seoObject, 'og:title.value', get(seoObject, 'title.value'))}
          countCharacters />
        <TextField id="og:description"
          textarea
          name="og:description"
          labelText="Description"
          value={get(seoObject, 'og:description.value', get(seoObject, 'description.value'))}
          helpText="A brief description of the content, usually between 2 and 4 sentences. This will displayed below the title of the post on Facebook."
          textInputProps={{
            testId: "Seo-tabpanel-og:description",
            maxLength: 255,
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          countCharacters
          className="fieldset" />
        <FormLabel className="fieldset"
          htmlFor="og:image">Post Image</FormLabel>
        <SingleAssetWithButton sdk={sdk}
          assetId={get(seoObject, 'og:image.value.id')}
          handleFieldChange={(asset) => handleAssetFieldChange('og:image', asset)}
          handleRemoveImage={() => removeFieldProperty('og:image')} />
        <HelpText>Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels to display link page posts with larger images.</HelpText>

      </TabPanel>
    );
  };

  const renderTwitterTab = () => {
    return (
      <TabPanel id="twitter"
        className="tab-panel"
        testId="Seo-tabpanel-twitter">
        <TextField id="twitter:title"
          name="twitter:title"
          labelText="Post Title"
          helpText="The title of your article without any branding such as your site name."
          textInputProps={{
            maxLength: 60,
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
            testId: "Seo-tabpanel-twitter:title"
          }}
          value={get(seoObject, 'twitter:title.value', get(seoObject, 'title.value'))}
          countCharacters />
        <TextField id="twitter:description"
          textarea
          
          name="twitter:description"
          labelText="Description"
          value={get(seoObject, 'twitter:description.value', get(seoObject, 'description.value'))}
          helpText="A description that concisely summarizes the content as appropriate for presentation within a Tweet. You should not re-use the title as the description or use this field to describe the general services provided by the website."
          textInputProps={{
            maxLength: 255,
            testId: "Seo-tabpanel-twitter:description",
            onKeyPress: (e) => onFieldChangeDebounce(e.currentTarget),
            onBlur: (e) => onFieldChange(e.currentTarget),
          }}
          countCharacters
          className="fieldset" />
        <FormLabel className="fieldset"
          htmlFor="twitter:image">Post Image</FormLabel>
        
        <SingleAssetWithButton sdk={sdk}
          assetId={get(seoObject, 'twitter:image.value.id')}
          handleFieldChange={(asset) => handleAssetFieldChange('twitter:image', asset)}
          handleRemoveImage={() => removeFieldProperty('twitter:image')} />
        <HelpText>Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels to display link page posts with larger images.</HelpText>
      </TabPanel>
    );
  };

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
      <pre>
        {JSON.stringify(seoObject, null, 2)}
      </pre>
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
  }).isRequired
};

export default Seo;
