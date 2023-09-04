import { Predicate } from "./types";
import { helpReduceWithoutStart, helpReduceWithStart, iter, predicateIdentity } from "./helpers";

export function* map<T, V>(iterable: Iterable<T>, mapper: (item: T) => V): Iterable<V> {
    for (const value of iterable) {
        yield mapper(value);
    }
}

export function* flatten<T>(iterableOfIterables: Iterable<Iterable<T>>): Iterable<T> {
    for (const iterable of iterableOfIterables) {
        for (const item of iterable) {
            yield item;
        }
    }
}

export function flatmap<T, S>(iterable: Iterable<T>, mapper: (item: T) => Iterable<S>): Iterable<S> {
    return flatten(map(iterable, mapper));
}

export function find<T>(iterable: Iterable<T>, cb?: Predicate<T>): T | undefined {
    if (cb === undefined) {
        for (const value of iterable) {
            return value;
        }
        return undefined;
    } else {
        for (const value of iterable) {
            if (cb(value)) {
                return value;
            }
        }
        return undefined;
    }
}

export function filter<T, N extends T>(iterable: Iterable<T>, predicate: (item: T) => item is N): Iterable<N>;
export function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T>;
export function* filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
    for (const value of iterable) {
        if (predicate(value)) {
            yield value;
        }
    }
}

export function reduce<T>(iterable: Iterable<T>, reducer: (agg: T, item: T, index: number) => T): T | undefined;
export function reduce<T, O>(iterable: Iterable<T>, reducer: (agg: O, item: T, index: number) => O, start: O): O;
export function reduce<T>(iterable: Iterable<T>, reducer: (agg: T, item: T, index: number) => T): T | undefined;
export function reduce<T, O>(iterable: Iterable<T>, reducer: (agg: O, item: T, index: number) => O, start: O): O;
export function reduce<T, O>(
    iterable: Iterable<T>,
    reducer: ((agg: T, item: T, index: number) => T) | ((agg: O, item: T, index: number) => O),
    start?: O
): O | (T | undefined) {
    if (start === undefined) {
        return helpReduceWithoutStart(iterable, reducer as (agg: T, item: T, index: number) => T);
    } else {
        return helpReduceWithStart(iterable, reducer as (agg: O, item: T, index: number) => O, start);
    }
}

export function every<T>(iterable: Iterable<T>, cb: Predicate<T> = predicateIdentity): boolean {
    for (const item of iterable) {
        if (!cb(item)) {
            return false;
        }
    }

    return true;
}

export function some<T>(iterable: Iterable<T>, cb: Predicate<T> = predicateIdentity): boolean {
    for (const item of iterable) {
        if (cb(item)) {
            return true;
        }
    }

    return false;
}

export function contains<T>(iterable: Iterable<T>, searchEl: T): boolean {
    return some(iterable, (x) => x === searchEl);
}

export function chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
    return flatten(iterables);
}

export function compact<T>(iterable: Iterable<T | null | undefined>): Iterable<T> {
    return filter(iterable, el => el != null);
}

export function compactObject<K extends string, V>(obj: Record<K, V | null | undefined>): Record<K, V> {
    const result = {} as Record<K, V>;
    for (const [key, val] of Object.entries(obj)) {
        const value = val as V | null | undefined;
        if (value != null) {
            result[key as K] = value;
        }
    }
    return result;
}
