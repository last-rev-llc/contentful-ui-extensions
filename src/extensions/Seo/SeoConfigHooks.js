/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState }from 'react';
import { get } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { 
  EmptyState,
  Button,
  // Heading,
  // Note,
  // Form,
  // SelectField,
  // Option,
  // Table,
  // TableHead,
  // TableBody, 
  // TableCell, 
  // TableRow,
  TextField} from '@contentful/forma-36-react-components';
import './Seo.scss';

import PropTypes from 'prop-types';


class SeoConfig = ({ sdk }) => {
  const {app} = sdk.platformAlpha;

  const [appParameters, setAppParameters] = useState({
    siteName: '',
  });
  const [spaceContentTypes, setSpaceContentTypes] = useState([]);

  
  useEffect(() => {
    //console.log('useEffect', appParameters);
    const fetchData = async (setAppReady) => {
      const result = await app.getParameters();
      const { items: contentTypes } = await sdk.space.getContentTypes();
      setAppParameters(result);
      setSpaceContentTypes(contentTypes);
      setAppReady();
    };
    fetchData(() => {
      app.onConfigure(() => {
        //console.log('appParameters: onConfigure()', appParameters);
        return {
          parameters: appParameters,
          targetState: {
            EditorInterface: {
              seoApp: {
                controls: [
                  {fieldId: 'seo'},
                ]
              }
            }
          }
        };
      });
      app.setReady();
    });
  }, [app]);

  const handleFieldChange = (field) => {
    console.log({
      ...appParameters,
      [field.name]: field.value,
    });
    setAppParameters({
      ...appParameters,
      [field.name]: field.value,
    });
  };

  return (
    <div className="seo-config">
      <EmptyState
        className="into"
        headingProps={{ text: 'SEO' }}
        customImageElement={<img src="https://images.ctfassets.net/9o4l1mrd1tci/3ofhr7KXTuiqBhlwkm8h9h/a88289dcfa95fc23a9fcce8418aab94a/lastrev_logo_blk.png"
          alt="" />}
        descriptionProps={{
          text:
          'Fabio vel iudice vincam, sunt in culpa qui officia. Me non paenitet nullum festiviorem excogitasse ad hoc. Cum sociis natoque penatibus et magnis dis parturient.',
        }}/>
      <div className="fields">
        <TextField id="siteName"
          testid="SeoConfig-siteName"
          name="siteName"
          labelText="Site Name"
          helpText="The title of your website that is appended to the end of your page title"
          textInputProps={{
            maxLength: 10,
            onKeyPress: (e) => handleFieldChange(e.currentTarget),
            onBlur: (e) => handleFieldChange(e.currentTarget),
          }}
          value={get(appParameters, 'siteName' || '')}
          countCharacters
          onChange={(e) => handleFieldChange(e.currentTarget)}
          onBlur={(e) => handleFieldChange(e.currentTarget)} />
        <Button onClick={() => app.onConfigure()}>Save</Button>
      </div>
      {console.log('appParameters state', appParameters)}
    </div>
  );
};


SeoConfig.propTypes = {
  sdk: PropTypes.shape({
    platformAlpha: PropTypes.shape({
      app: PropTypes.shape({
        onConfigure: PropTypes.func.isRequired,
        getParameters: PropTypes.func.isRequired,
        setReady: PropTypes.func.isRequired,
      })
    })
  }).isRequired
};

export default SeoConfig;
