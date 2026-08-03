const app = require('./app');
const taskRepository = require('./models/taskRepository');

const port = Number(process.env.PORT || 3000);

async function start() {
  await taskRepository.init();
  app.listen(port, () => {
    console.log(`Todo API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
