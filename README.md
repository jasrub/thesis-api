# Introduction

This API provides functionality for PubPub Experiments

# Running Locally

First, create a `config.js` file to configure the PostgreSQL URI. See `config.sample.js` for an example.

Then run:

```
npm install
npm start
```

# Workflow for Mechanical Turk Assignments

1. Customize HIT external URL
2. Create the HIT
3. User accepts HIT
4. Website has a complete button that fires a POST request with the assignment ID to the [externalsubmit URL](http://docs.aws.amazon.com/AWSMechTurk/latest/AWSMturkAPI/ApiReference_ExternalQuestionArticle.html)
5. API route also triggered and is given assignmentID. Route fires ApproveAssignment and the HIT is complete. Alternatively, we can set a low auto-approve rate. Though, I suppose savvy turkers could then simply post to the submitID and be completed.

