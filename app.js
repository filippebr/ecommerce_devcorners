import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { Server } from 'http'

import routes from '@routes'

class Application {
  constructor() {
    this.app = express();
    this.server = Server;

    this.setup();
  }

  vars() {
    this.app.set('port', process.env.PORT);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use(routes);
  }

  async database() {
    await this.prisma.$connect();
  }

  setup() {
    const self = this;

    function vars() {
      self.vars();
    }

    function middlewares() {
      self.middlewares();
    }

    function routes() {
      self.routes();
    }

    function database() {
      self.database();
    }

    vars();
    middlewares();
    routes();
    database();
  }

  start() {
    const server = this.app.listen(this.app.get('port'), () => {
      console.log(`🚀 Server running on port ${server.address().port}`);
    });

    this.server = server;
  }

  get instance() {
    return this.app;
  }

  get httpServer() {
    return this.server;
  }
}

const app = new Application();

export default app;