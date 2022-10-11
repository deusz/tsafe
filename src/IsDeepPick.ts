/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictEquals } from "./tools/StrictEquals";
import { assert } from "./assert";
import { Equals } from "./Equals";

type Primitive = string | number | symbol;
type GenericObject = Record<Primitive, unknown>;
type GenericArray = Array<unknown>;
type EmptyArray = [];

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, false>;

export type IsDeepPick<A1, A2> = A2 extends A1
    ? IsAny<A1> extends true
        ? IsAny<A2> extends true
            ? true
            : false
        : A1 extends Primitive
        ? StrictEquals<A1, A2>
        : A1 extends EmptyArray
        ? StrictEquals<A1, A2>
        : A1 extends GenericArray
        ? A2 extends GenericArray
            ? IsDeepPick<A1[number], A2[number]>
            : false
        : {
              [K in keyof A1]: A1[K] extends GenericObject
                  ? IsDeepPick<A1[K], A2[K]>
                  : StrictEquals<A1[K], A2[K]>;
          } extends Record<keyof A1, true>
        ? true
        : false
    : false;

assert<Equals<IsDeepPick<"ok", "ok">, true>>();
assert<Equals<IsDeepPick<{ a: "a" }, { a: "a"; b?: "b" }>, true>>();
assert<Equals<IsDeepPick<{ a: "a" }, { a: "a"; b: "b" }>, true>>();
assert<Equals<IsDeepPick<{ a: "a"; b: "b" }, { a: "a"; b: "b" }>, true>>();
assert<Equals<IsDeepPick<{ a: { a: "a" } }, { a: { a: "a"; b: "b" } }>, true>>();

assert<Equals<IsDeepPick<{ a: "a" }[], { a: "a"; b: "b" }[]>, true>>();
assert<Equals<IsDeepPick<{ a: "a" }[][], { a: "a"; b: "b" }[][]>, true>>();
assert<Equals<IsDeepPick<{ c: "a" }[], { a: "a"; b: "b" }[]>, false>>();
assert<Equals<IsDeepPick<{ c: "a" }[], { a: "a"; b: "b" }[]>, false>>();

type Obj = Record<string, unknown>;

class A {
    a = 1;
}
{
    // identity
    assert<Equals<IsDeepPick<any[], any[]>, true>>();
    assert<Equals<IsDeepPick<Obj, Obj>, true>>();
    assert<Equals<IsDeepPick<A, A>, true>>();
}

{
    // never picks only never
    assert<Equals<IsDeepPick<never, any>, false>>();
    assert<Equals<IsDeepPick<never, unknown>, false>>();
}

{
    // arrays
    assert<Equals<IsDeepPick<any, any>, true>>();
    assert<Equals<IsDeepPick<any[], any[]>, true>>();
    assert<Equals<IsDeepPick<[], []>, true>>();
    assert<Equals<IsDeepPick<any[], []>, false>>(); // TODO
    assert<Equals<IsDeepPick<[], any[]>, false>>();
    assert<Equals<IsDeepPick<[], [any]>, false>>();
    assert<Equals<IsDeepPick<[any], any[]>, false>>();
    assert<Equals<IsDeepPick<[any], []>, false>>();
    assert<Equals<IsDeepPick<[1], [number]>, false>>();
    assert<Equals<IsDeepPick<[number], [1]>, false>>();

    assert<Equals<IsDeepPick<[1], [1]>, true>>();
    assert<Equals<IsDeepPick<[1], [2]>, false>>();

    assert<Equals<IsDeepPick<[1, ""], [number, string]>, false>>();
    assert<Equals<IsDeepPick<[1, ""], [number, any]>, false>>();
    assert<Equals<IsDeepPick<[1, ""], [number, never]>, false>>();
    assert<Equals<IsDeepPick<[number, string], [1, ""]>, false>>();
    assert<Equals<IsDeepPick<[number, any], [1, ""]>, false>>();
    assert<Equals<IsDeepPick<[number, never], [1, ""]>, false>>();
}
