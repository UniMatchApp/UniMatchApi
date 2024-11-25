export function TransformFromUndefinedToNull(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;
  
    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
  
      const transform = (value: any): any => {
        if (value === undefined) return null;
        if (Array.isArray(value)) return value.map(transform);
        if (value !== null && typeof value === 'object') {
          return Object.keys(value).reduce((acc, key) => {
            acc[key] = transform(value[key]);
            return acc;
          }, {} as Record<string, any>);
        }
        return value;
      };
  
      return transform(result);
    };
  }