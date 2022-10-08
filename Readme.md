[![Vercel](http://therealsujitk-vercel-badge.vercel.app/?app=therealsujitk-vercel-badge)]
[![Backend](https://github.com/scottdkey/rollmein/actions/workflows/Backend.yaml/badge.svg)](https://github.com/scottdkey/rollmein/actions/workflows/Backend.yaml)



Current Tools used:
Kubernetes - Backend and database deploy
Host - Linode Single Node Kuberenetes Cluster
CDN - Netlify Frontend and CDN, build and host
Github actions - CICD
Database - Postgres 13
In Memory Cache - Redis


Frontend: {
  framework: react
  static site generator: Nextjs
  ui framework: Chakra-ui
}
Backend: {
  server: Nodejs - Koa
  graphql: apollo
  authentication: Jwt
  orm: MikroORM
}

To run this project locally, without docker-compose(Development docker-compose has fallen by the wayside since CICD, its a todo to get it back working again):

cd api && yarn dev
cd web && yarn dev

ToDo: 
 1. Better tests(with mocks)
 2. integration tests
 3. Kubernetes readyness and liveness probes
 4. convert frontend to Jwt
 5. Build more of the UI
