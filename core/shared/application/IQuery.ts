import { Result } from '../domain/Result';

export interface IQuery<G, R> {
    query(params: G): Result<R>;
}
