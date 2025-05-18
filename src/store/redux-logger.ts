import { createLogger } from 'redux-logger';

const logger = createLogger({
  collapsed: true,
});

export { logger as reduxLogger };