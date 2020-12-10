# Table of Contents

1.  [Tutorial](#org734677e)
    1.  [General section](#org98e306d)
        1.  [Form type](#org8453f5a)
        2.  [Edit & Copy buttons](#org5477ede)
    2.  [Form Setup section](#org0190d44)
        1.  [Creating a step](#org0036971)
        2.  [Creating a field](#orgb232846)
    3.  [dependsOn](#org8f07898)
    4.  [Video](#org888710d)

<a id="org734677e"></a>

# Tutorial

Upon loading the appropriate content model you should be greeted with something which looks similar to the following:

![img](./images/overview.png)

<a id="org98e306d"></a>

## General section

<a id="org8453f5a"></a>

### Form type

gives us the ability to select the form provider (where will the data get sent)
Upon selecting specific providers we&rsquo;ll be able to input a formId or portalId (hubspot)

<a id="org5477ede"></a>

### Edit & Copy buttons

The edit button allows to manually edit the JSON, this is an advanced feature as it can be easy
to make a mistake while manually editing the form data.

The copy button copies the raw JSON from the form to enable ease of pasting to another content model.

<a id="org0190d44"></a>

## Form Setup section

This is the real meat of our form builder software.
The following image gives a breakdown of the components:

![img](./images/overview_description.png)

<a id="org0036971"></a>

### Creating a step

Clicking &ldquo;Add step&rdquo; adds a template step which can be edited by clicking anywhere on the main body of the step.

Steps can have `dependsOn` logic, please see the appropriate section

<a id="orgb232846"></a>

### Creating a field

Clicking the small plus button below the last field adds a template field which can be edited by clicking anywhere on the main body of the field.

Fields by default have the following attributes:

- Label (what will be displayed to the user)
- Key (where the value will be saved in the formState)
- Type (which type of field to render to the user)

Fields can have `dependsOn` logic, please see the appropriate section

For some field types, other input fields will appear automatically. For more information on field types please see the documentation here:

[Field documentation](https://github.com/Impossible-Foods/impossiblefoods.com/blob/master/src/components/ModuleForm/DynamicForm/Fields/Fields.org)

<a id="org8f07898"></a>

## dependsOn

Fields & steps can be toggled on and off by using dependsOn logic.
Currently we use [jsonLogic](http://jsonlogic.com/) which is a JSON enabled programming structure. In future we hope to improve this with a more user-friendly approach.

To begin edit any step or field and click &ldquo;Enable `dependsOn`&rdquo;

You will see a few new text fields appear:

- Depends on
- Tests (if you have added some)

An example of a depends on logic might be the following:

    {
        "!!": { "var": "isCustomBusiness" }
    }

Which would enable the step or field when someone has selected `isCustomBusiness` (which would be set from another field key).

This offers quite a robust and detailed process as we can toggle other items based on more complex logic such as:

    {
      "and": [
        { ">": [{ "var": "age" }, 20] },
        { "==": [{ "var": "gender" }, "male"] },
        { "==": [{ "var": "country" }, "USA"] }
      ]
    }

Which would only enable the step or field if the following are true

- User is older than 20 AND
- User is male AND
- User is in the USA

<a id="org888710d"></a>

## Video

<https://streamable.com/ufuns4>
