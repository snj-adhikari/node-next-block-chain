# Workflow

- All work should be done on a feature branch.
- Once the work is complete, create a pull request from the feature branch to the `develop` branch.
- After the pull request is approved and merged into `develop`, the `develop` branch will be deployed to a staging environment for further testing.
- Once the changes are verified in the staging environment, a pull request will be created from the `develop` branch to the `main` branch.
- The pull request to `main` must be approved by the project owner before it can be merged.
- The `main` branch is protected and can only be merged into by the project owner.
