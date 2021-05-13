# ms-ticketing

Requirements:
- Create 'jwt-secret' in kubectl
- Create 'stripe-secret' in kubectl

For github actions:
- DOCKER_USERNAME
- DOCKER_PASSWORD
- DIGITALOCEAN_ACCESS_TOKEN


Run local
- Start the minikube cluster locally.
- Run `skaffold dev`

Info:
- Test case will run only when there are changes in repo and a pull request is created on branch to dev, uat or master
- Deploy will happen only when there is push/merge in main branch.