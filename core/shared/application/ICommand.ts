import { Result } from '../domain/Result';

export interface ICommand<T, G> {
    run(request: T): Promise<Result<G>>;
}
