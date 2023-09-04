import { helpRange, helpReduceWithoutStart, numberIdentity } from "./helpers";
import { reduce } from "./imodificaters";

export function avg(iterable: Iterable<number>): number {
    let sum = 0;
    let count = 0;

    for (const num of iterable) {
        sum += num;
        count++;
    }

    return count ? sum / count : sum;
}

export function range(stop: number): Iterable<number>;
export function range(start: number, stop: number, step?: number): Iterable<number>;
export function range(startOrStop: number, definitelyStop?: number, step = 1): Iterable<number> {
    if (definitelyStop !== undefined) {
        return helpRange(startOrStop, definitelyStop, step);
    } else {
        return helpRange(0, startOrStop, step);
    }
}

export function min<T>(iterable: Iterable<T>, cb: (item: T) => number = numberIdentity): T | undefined {
    return helpReduceWithoutStart(iterable, (x, y) => (cb(x) < cb(y) ? x : y));
}

export function max<T>(iterable: Iterable<T>, cb: (item: T) => number = numberIdentity): T | undefined {
    return helpReduceWithoutStart(iterable, (x, y) => (cb(x) > cb(y) ? x : y));
}

export function sum(iterable: Iterable<number>): number {
    return reduce(iterable, (x, y) => x + y, 0);
}

export function* enumerate<T>(iterable: Iterable<T>, start = 0): Iterable<[number, T]> {
    let index: number = start;
    for (const value of iterable) {
        yield [index++, value];
    }
}

export function* repeat<T>(thing: T, times?: number): Iterable<T> {
    if (times === undefined) {
        for (;;) {
            yield thing;
        }
    } else {
        for (const _ of range(times)) {
            yield thing;
        }
    }
}

export function* count(start = 0, step = 1): Iterable<number> {
    let n = start;
    for (;;) {
        yield n;
        n += step;
    }
}

export function* cycle<T>(iterable: Iterable<T>): Iterable<T> {
    const saved = [];
    for (const element of iterable) {
        yield element;
        saved.push(element);
    }

    while (saved.length > 0) {
        for (const element of saved) {
            yield element;
        }
    }
}
