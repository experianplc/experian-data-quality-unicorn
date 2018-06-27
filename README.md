Experian Unicorn (name pending) is a set of prebuilt workflow for address,
email, and phone integrations used for data quality. For any of the workflows
to work, be sure to check out [Experian
Pegasus](https://github.com/experianplc/experian-data-quality-pegasus) and make sure
you have that on your machine. 

The way Unicorn works is relatively straightforward. After including `EDQ.js` in
your website, you will include the appropriate integration file(s) as well *after* you 
have included `EDQ.js`. So for example your HTML may look like the following:

```html
<body>
<!-- Your body might be here -->
<script>
  /* All configuration will be put here */
</script>
<script src="edq.js"></script>
<script src="unicorn-type.js"></script>
</body>
```

From there the main concern is surrounding properly specifying the configuration parameters.
Please see the notes below on how to specify configuration for each product and which item
means, with examples.

# Address Integration

# Global Intuitive
Global Intuitive has three parameters:
- `GLOBAL_INTUITIVE_AUTH_TOKEN` (string): This should be a valid authentication token given by
  Experian.
- Example: `'xxx-xx-xx-xx-xxxx'`

- `GLOBAL_INTUITIVE_ELEMENT` (Element): This should be the element whose contents will be used to
  generate suggestions
- Example: `document.querySelector('#address-line-one')`

- `GLOBAL_INTUITIVE_MAPPING` (Object[]): This array specifies the mapping between elements on the
  page and the result for selecting a suggestion.
- Example: 
```html
[
  {
    field: document.querySelector('#address-line-one'),
    elements: ['address.addressLine1'],
  },

  {
    field: document.querySelector('#address-line-two'),
    elements: ['address.addressLine2']
  }
]
```

# Email Validate
Email Validate has two parameters:

- `EMAIL_VALIDATE_AUTH_TOKEN` (string): This should be a valid authentication token given by
Experian. 
- Example: `'xxx-xx-xx-xx-xxxx'`


- `EMAIL_ELEMENTS` (Element[]): An array of elements. So for example you might 
- Example: `[document.querySelector('#email')]`

# Phone Validate
Phone Validate has two parameters:

- `GLOBAL_PHONE_VALIDATE_AUTH_TOKEN` (string): This should be a valid authentication token given by
Experian. 
- Example: `'xxx-xx-xx-xx-xxxx'`


- `GLOBAL_PHONE_ELEMENTS` (Element[]): An array of elements. So for example you might 
- Example: `[document.querySelector('#phone')]`
