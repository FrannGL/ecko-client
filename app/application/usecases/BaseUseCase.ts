/**
 * Base Use Case Class
 * Abstract class for all use cases following Clean Architecture principles
 */

export abstract class UseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}
