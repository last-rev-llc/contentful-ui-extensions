# Table of Contents

1.  [Tutorial](#orgc9f910a)
    1.  [General section](#orgef98c31)
        1.  [Form type](#org6e71110)
        2.  [Edit & Copy buttons](#org13ee6d9)
    2.  [Form Setup section](#orgd95ffc7)
    3.  [Form editor modal](#org1bc6446)
        1.  [Creating a step](#orga260326)
        2.  [Creating a field](#orgf7d9047)
    4.  [dependsOn](#orgadd2178)
        1.  [Notes on usability](#org1fb9cb3)
    5.  [Video](#org306d1ce)

<a id="orgc9f910a"></a>

# Tutorial

<a id="orgef98c31"></a>

## General section

<a id="org6e71110"></a>

### Form type

gives us the ability to select the form provider (where will the form response be sent)
Upon selecting specific providers we&rsquo;ll be able to input a formId or portalId (hubspot)

<a id="org13ee6d9"></a>

### Edit & Copy buttons

The edit button allows to manually edit the JSON, this is an advanced feature as it can be easy
to make a mistake while manually editing the form data.

The copy button copies the raw JSON from the form to enable ease of pasting to another content model.

<a id="orgd95ffc7"></a>

## Form Setup section

[overview](./images/overview.png)

<a id="org1bc6446"></a>

## Form editor modal

When we click on an individual field (or the Edit Form button), we&rsquo;ll be greeted with a modal which looks similar to the following:

[Modal Editor](./images/ModalEditor.png)

<a id="orga260326"></a>

### Creating a step

Clicking &ldquo;Add step&rdquo; adds a template step which can be edited by clicking anywhere on the main body of the step.

Clicking on the blue collapse children button will hide or show the children of the step, which can be useful when working on a larg form.
Steps can be re-ordered by dragging the handle on the left side of the step.

Steps can have `dependsOn` logic, please see the appropriate section

<a id="orgf7d9047"></a>

### Creating a field

Clicking the small plus button below the last field adds a template field which can be edited by clicking anywhere on the main body of the field.

Fields by default have the following attributes:

- Label (what will be displayed to the user)
- Key (where the value will be saved in the formState)
- Type (which type of field to render to the user)

Fields can have `dependsOn` logic, please see the appropriate section

For some field types, other input fields will appear automatically. For more information on field types please see the documentation here:

[Field documentation](https://github.com/Impossible-Foods/impossiblefoods.com/blob/master/src/components/ModuleForm/DynamicForm/Fields/Fields.org)

[Modal Field Editor](./images/ModalField.png)
[Modal Field Editor 2](./images/ModalField2.png)

<a id="orgadd2178"></a>

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

<a id="org1fb9cb3"></a>

### Notes on usability

In future we hope to create a simpler UI interface around the dependsOn system which will include commonly used functionality.

<a id="org306d1ce"></a>

## Video

<https://streamable.com/ufuns4>
