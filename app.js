import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import routes from './routes'

class Application {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.setup();
  }

  setup() {
    this.vars();
    this.middlewares();
    this.routes();
  }

  vars() {
    this.app.set('port', process.env.PORT || 4000);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use('/api', routes);
  }

  start() {
    this.server.listen(this.app.get(process.env.PORT), () => {
      console.log(`🚀 Server running on port ${this.app.get(process.env.PORT || 4000)}`);
    });
  }
}

const app = new Application();

module.exports = app