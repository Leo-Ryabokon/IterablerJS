import { find } from "./imodificaters";
import { count } from "./iaggregators";
import { takeWhile } from "./icollectors";


export function predicateIdentity(val: unknown): boolean {
    return !!val;
}

export function numberIdentity(val: unknown): number {
    if (typeof val !== 'number') {
        throw new Error('Inputs must be numbers');
    }
    return val;
}

export function helpRange(start: number, stop: number, step: number): Iterable<number> {
    const counter = count(start, step);
    const pred = step >= 0 ? (n: number) => n < stop : (n: number) => n > stop;
    return takeWhile(counter, pred);
}

export function helpReduceWithStart<T, O>(iterable: Iterable<T>, reducer: (agg: O, item: T, index: number) => O, start: O): O {
    let output = start;
    let index = 0;
    for (const item of iterable) {
        output = reducer(output, item, index++);
    }
    return output;
}

export function helpReduceWithoutStart<T>(iterable: Iterable<T>, reducer: (agg: T, item: T, index: number) => T): T | undefined {
    const it = iter(iterable);
    const start = find(it);
    if (start === undefined) {
        return undefined;
    } else {
        return helpReduceWithStart(it, reducer, start);
    }
}

export function iter<T>(iterable: Iterable<T>): IterableIterator<T> {
    return iterable[Symbol.iterator]() as IterableIterator<T>;
}
