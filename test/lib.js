/**
 * Created by yunfei on 9/9/15.
 */
var _ = require('lodash'),
    output = [],
    p_constr = function (id) {
        return {
            constructor: function () {
                this.Super();
                output.push(id + ':constr');
            }
        };
    },
    p_super = function (id) {
        return {
            fn: function () {
                this.Super();
                output.push(id + ':fn');
            }
        };
    },
    p_fn = function (id) {
        return {
            fn: function () {
                output.push(id + ':fn');
            }
        };
    },
    p_super_constr = function (id) {
        return _.assign(p_constr(id), p_super(id));
    };

module.exports = {
    resetOut: function () {
        output = []
    },
    getOut: function () {
        return output;
    },
    p_constr: p_constr,
    p_super: p_super,
    p_fn: p_fn,
    p_super_constr: p_super_constr,
    mx_super_constr: p_super_constr('mx_super_constr'),
    mx_super: p_super('mx_super'),
    mx_fn: p_fn('mx_fn'),
    mx_constr: p_constr('mx_constr')
};