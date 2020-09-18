<h1 align="center">
  <code>newsletter-action</code>
</h1>
<h3 align="center">
  A GitHub Action for sending email formatted using Markdown.
</h3>

<p align="center">
    &nbsp;
    <a href="./LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" title="License" />
    </a>
</p>

# Set up

You will need a SendGrid account and have completed these steps:
- [Set Up Domain Authentication](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/)
- [Create Full Access API Key](https://app.sendgrid.com/settings/api_keys)

Add the generated API Key as a secret named `SENDGRID_API_KEY` in your repo settings.

It should look like this:

![github com_KNawm_release-radar_settings_secrets](https://user-images.githubusercontent.com/7613080/93562875-3bdf8300-f95d-11ea-869b-7dba1ef83f21.png)

- [Create Signup Forms](https://mc.sendgrid.com/forms/signup)

Once you create it, go to [Contacts](https://mc.sendgrid.com/contacts) and open the list that was created automatically, to view it's ID open the list and check the URL, the ID will look like this: `81f44a3f-f1c2-4f47-a9a9-df79dd32d246`. This will be your `list_id`.

- [Create Unsubscribe Group](https://mc.sendgrid.com/unsubscribe-groups)

Once you create it, you will be able to see it's ID, it will look like this: `22584`. This will be your `suppression_group_id`.

- [Add a Sender](https://mc.sendgrid.com/senders/new)

Once you create it, click the 3 dots in the right of the Sender Management page and Edit the entry, check the URL and you will find a number that looks like this: `1057550`. This will be your `sender_id`.

## Inputs

**All inputs are REQUIRED**

| Input Value  | Description |
| :-------------  |:------------- |
`subject` | The subject line of the newsletter.
`list_id` | The recipient List ID that will receive the newsletter.
`suppression_group_id` | The ID of the Suppression Group to allow recipients to unsubscribe.
`sender_id` | The ID of the verified Sender.

## Example usage

```yml
name: Newsletter
on:
  workflow_dispatch:
    inputs:
      subject:
        description: 'Subject'
        required: true

jobs:
  newsletter:
    runs-on: ubuntu-latest
    name: Send newsletter
    steps:
    - name: Send newsletter
      uses: KNawm/newsletter-action@v1
      env:
        SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
      with:
        subject: ${{ github.event.inputs.subject }}
        list_id: '81f44a3f-f1c2-4f47-a9a9-df79dd32d246'
        suppression_group_id: 22584
        sender_id: 1057550
```

Demo: [KNawm/release-radar](https://github.com/KNawm/release-radar)

You need to trigger the workflow manually going to the Actions page of your repo and provide a subject line.

![](https://user-images.githubusercontent.com/7613080/93563874-2408fe80-f95f-11ea-8563-ff75fb7899a9.png)

Once it's triggered it will send to your list of recipients the contents of the README of the repo.
