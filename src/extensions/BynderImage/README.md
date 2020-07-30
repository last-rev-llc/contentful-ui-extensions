# Last Rev: Bynder Image

The Last Rev Bynder Image extension is a field extension that copies information contained in Bynder Image JSON to Contentful fields.


## Setup Instructions

1. Create a content model with the following ids and fields:
    * bynderId : Symbol
    * imageName : Symbol
    * internalTitle : Symbol
    * altTextOverride : Symbol
    * bynderData : JSON
    
2. Install the extension in Contentful
3. Choose the bynderId field and set it's appearance to use this extension
4. That's it. Whenever the bynder Data is changed the other fields will update with the JSON information. 

## Reporting Issues

If you find any bugs or want to suggest a feature, please submit them on the Github repo Issues tab. Thanks!
