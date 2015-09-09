/**
 * Created by yunfei on 9/9/15.
 */
var test = require('unit.js'),
    _ = require('lodash'),
    jClass = require('../jClass'),
    lib = require('./lib');

describe('Test Object Mixin', function () {
    it('Basic Mixin', function () {
        // Test Case: Three mixins with super call
        // Test Target: Basic mixin function - prop inherit, super func call
        lib.resetOut();
        var mx = jClass.mixin(
            _.assign({prop: 'mx1'}, lib.mx_fn),
            [_.assign({prop: 'mx2'}, lib.mx_super_constr), lib.mx_super]
        );
        mx.fn();
        test.string(mx.prop).is('mx2');
        test.array(lib.getOut()).is([
            'mx_fn:fn',
            'mx_super_constr:fn',
            'mx_super:fn'
        ]);
    });
});