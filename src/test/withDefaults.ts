/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { doExtends } from "../typeSafety/doExtends";
import { withDefaults } from "../typeSafety/withDefaults";

// eslint-disable-next-line @typescript-eslint/no-empty-function
function notAny(_arg: { __notAnyBrand: unknown }): void {}

//function test1<T, U, V>() {
function test1<T, U, V>() {
    const f: (params: { foo: T; bar: U }) => V = null as any;

    const got = withDefaults(f, { "bar": (null as any) as U });

    const expected: (params: { foo: T; bar: U }) => V = null as any;

    //@ts-expect-error
    notAny(got);
    doExtends<typeof got, typeof expected>();
    doExtends<typeof expected, typeof got>();
}

function test2<T>() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const f: (params: {}) => T = null as any;

    //@ts-expect-error
    withDefaults(f, { "foo": null as any });
}

function test3<T, U, V>() {
    const f: (params: { foo?: T; bar: U }) => V = null as any;

    const got = withDefaults(f, { "bar": (null as any) as U });
    const expected: (params: { foo?: T; bar?: U }) => V = null as any;

    //@ts-expect-error
    notAny(got);
    doExtends<typeof got, typeof expected>();
    doExtends<typeof expected, typeof got>();
}

export {};