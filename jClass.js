/**
 * Created by yunfei on 9/8/15.
 */
(function () {
    var PSuper = '$super',
        PConstructor = '$constructor',
        SuperFnsMap = '_superFns',
        IsWrapperForAny = '_isWrapperForAny',
        InheritedForAny = '_inheritedForAny',
        SuperIdSearchChain = '_idChain',
        Identifier = '_id';

    var idCount = 0;
    function getUniqueIdentifier() {
        return 'jClass_id_' + (idCount++);
    }

    function wrapFunc(inherited, override) {
        var wrapperFn = function () {
            var oldInherited = this._inherited;
            this[InheritedForAny] = inherited;
            var result = override.apply(this, arguments);
            this[InheritedForAny] = oldInherited;
            return result;
        };
        wrapperFn[IsWrapperForAny] = true;
        return wrapperFn;
    }

    function callSuper() {
        var fnCallingSuper = callSuper.caller;
        if (fnCallingSuper.caller && fnCallingSuper.caller[IsWrapperForAny]) {
            return this[InheritedForAny] && this[InheritedForAny].apply(this, arguments);
        } else {
            var superFnsMap = fnCallingSuper[SuperFnsMap];
            if (superFnsMap) {
                var idChain = this[SuperIdSearchChain];
                for (var i = 0; i < idChain.length; i++) {
                    var superFn = superFnsMap[idChain[i]];
                    if (superFn) {
                        return superFn.apply(this, arguments);
                    }
                }
            }
        }
    }

    function mixin(target, mixins) {
        if (!target[PSuper]) {
            target[PSuper] = callSuper;
        }
        var identifier = target.hasOwnProperty(Identifier) ? target[Identifier] : null;
        for (var i = 0; i < mixins.length; i++) {
            var src = mixins[i];
            for (var key in src) {
                var val = src[key];
                if (val instanceof Function && target[key] instanceof Function) {
                    if (identifier) {
                        var superFnsMap = val[SuperFnsMap] = val[SuperFnsMap] || {};
                        superFnsMap[identifier] = target[key];
                    } else {
                        val = wrapFunc(target[key], val);
                    }
                }
                target[key] = val;
            }
        }
        return target;
    }

    var jClass = {
        declare: function declare(SuperClass, mixins, classProps) {
            var id = getUniqueIdentifier(),
                superProto = SuperClass && SuperClass.prototype,
                proto = superProto ? Object.create(superProto) : {};
            proto[Identifier] = id;
            proto[SuperIdSearchChain] = [id].concat(superProto && superProto[SuperIdSearchChain] || []);
            mixin(proto, (mixins || []).concat(classProps ? [classProps] : []));
            function Constructor() {
                this[PConstructor] && this[PConstructor].apply(this, arguments);
            }
            Constructor.prototype = proto;
            proto._Class = Constructor;
            return Constructor;
        },
        mixin: mixin
    };

    if (typeof window !== 'undefined') window.jClass = jClass;
    if (typeof module !== 'undefined') {
        module.exports = jClass;
    } else if (typeof define === 'function') {
        define(jClass);
    }
}());
