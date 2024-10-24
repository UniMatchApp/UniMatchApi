import app from './AppConfig';
import { InMemoryEventBus } from '@/core/shared/infrastructure/InMemoryEventBus';

const port = process.env.PORT || 3000;

const eventBus = new InMemoryEventBus();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


export { eventBus };
