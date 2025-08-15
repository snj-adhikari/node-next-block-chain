# Workflow

- All work should be done on a feature branch.
- Once the work is complete, create a pull request from the feature branch to the `develop` branch.
- After the pull request is approved and merged into `develop`, the `develop` branch will be deployed to a staging environment for further testing.
- They should do both automated testing as well as by building the code , eslint testing , and running the code on browser.
- It should pass all automated QA and functionality before it get's passed to reviewer and QA agent should have intial look.
- Agent should work from develop branch and create their own branch based on feature , and it's should be reviewed by reviewer before merging it to `develop`
- Once merged to `develop` QA should verify the changes by unit testing and end to end testing
- Then `Product Manager` agent should should do UAT 
- Once the changes are verified in the staging environment (`develop`), a pull request will be created from the `develop` branch to the `main` branch.
- The pull request to `main` must be approved by the project owner before ( human ) it can be merged.
- The `main` branch is protected and can only be merged into by the project owner. (human)
