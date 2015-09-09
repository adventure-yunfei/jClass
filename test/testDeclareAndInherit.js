/**
 * Created by yunfei on 9/8/15.
 */
var test = require('unit.js'),
    _ = require('lodash'),
    jClass = require('../jClass'),
    lib = require('./lib');

describe('Test Class Declaration and Inheritance', function() {
    it('Class instantiation without constructor', function () {
        // Test Case: Class instantiation without constructor
        // Test Target: null constructor check
        var Base = jClass.declare(null, null, null),
            baseInst = new Base();
    });

    it('Basic Inheritance', function() {
        // Test Case: Constructor inherit with super call, Func prop inherit with super call, Normal prop inherit.
        // Test Target: Basic function of super call, constructor call, prop inherit
        lib.resetOut();
        var Base = jClass.declare(null, null, _.assign(lib.p_super_constr('base'), {
                prop: 'base'
            })),
            Sub = jClass.declare(Base, null, _.assign(lib.p_super_constr('sub'), {
                prop: 'sub'
            }));
        test.array(lib.getOut()).is([]);

        lib.resetOut();
        var baseInst = new Base();
        test.array(lib.getOut()).is(['base:constr']);
        test.string(baseInst.prop).is('base');

        lib.resetOut();
        var subInst = new Sub();
        test.array(lib.getOut()).is([
            'base:constr',
            'sub:constr'
        ]);
        test.string(subInst.prop).is('sub');

        lib.resetOut();
        baseInst.fn();
        test.array(lib.getOut()).is(['base:fn']);

        lib.resetOut();
        subInst.fn();
        test.array(lib.getOut()).is([
            'base:fn',
            'sub:fn'
        ]);
    });

    it('Class with Mixin of super call', function () {
        // Test Case: Declare class with two mixins, the first has super-call 'fn', the second has no 'fn'
        // Test Target: Mixin, and prop inherit of mixin, and super call in mixin, and jumping func inherit
        lib.resetOut();
        var Cls = jClass.declare(null, [
                _.assign({
                    prop: 'mx1'
                }, lib.mx_super_constr),
                _.assign({
                    prop: 'mx2'
                }, lib.mx_constr)
            ], lib.p_super_constr('cls')),
            inst = new Cls();
        test.array(lib.getOut()).is([
            'mx_super_constr:constr',
            'mx_constr:constr',
            'cls:constr'
        ]);
        test.string(inst.prop).is('mx2');

        lib.resetOut();
        inst.fn();
        test.array(lib.getOut()).is([
            'mx_super_constr:fn',
            'cls:fn'
        ]);
    });

    it('Class with Mixin of breaking super call', function () {
        // Test Case: Declare class with two mixins, the first has super-call 'fn', the second has no-super-call 'fn'
        // Test Target: No-super-call func inherit should break further super call
        var Cls = jClass.declare(null, [lib.mx_super, lib.mx_fn], lib.p_super('cls')),
            inst = new Cls();
        lib.resetOut();
        inst.fn();
        test.array(lib.getOut()).is([
            'mx_fn:fn',
            'cls:fn'
        ]);
    });
});