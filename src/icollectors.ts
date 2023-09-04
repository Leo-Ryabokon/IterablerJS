import { Predicate } from "./types";
import { iter } from "./helpers";

export function* iTake<T>(iterable: Iterable<T>, n: number): Iterable<T> {
    const it = iter(iterable);
    let count = n;
    while (count-- > 0) {
        const s = it.next();
        if (!s.done) {
            yield s.value;
        } else {
            return;
        }
    }
}

export function take<T>(iterable: Iterable<T>, n: number): T[] {
    return Array.from(iTake(iterable, n));
}

export function* takeWhile<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
    for (const value of iterable) {
        if (!predicate(value)) return;
        yield value;
    }
}

export function* dropWhile<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
    const it = iter(iterable);
    for (const value of it) {
        if (!predicate(value)) {
            yield value;
            break;
        }
    }

    for (const value of it) {
        yield value;
    }
}

export function* chunked<T>(iterable: Iterable<T>, size: number): Iterable<T[]> {
    if (size < 1) {
        throw new Error(`Invalid chunk size: ${size}`);
    }

    const it = iter(iterable);
    for (;;) {
        const chunk = take(it, size);
        if (chunk.length > 0) {
            yield chunk;
        }
        if (chunk.length < size) {
            return;
        }
    }
}
