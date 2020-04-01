/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM). All Rights Reserved.    *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.       *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative.(See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This library encapsulates the intrinsic functions supported by the Bali Nebula™
 * Virtual Processor.
 */
const bali = require('bali-component-framework').api();
const validator = bali.validator();

// This private constant sets the POSIX end of line character
const EOL = '\n';

// PUBLIC INTERFACE

/**
 * This function returns the public interace for the virtual machine intrinsic functions.
 *
 * @param {Boolean|Number} debug An optional number in the range [0..3] that controls
 * the level of debugging that occurs:
 * <pre>
 *   0 (or false): debugging turned off
 *   1 (or true): log exceptions to console.error
 *   2: perform argument validation and log exceptions to console.error
 *   3: perform argument validation and log exceptions to console.error and debug info to console.log
 * </pre>
 * @returns {Object} An object that implements the intrinsic functions interface.
 */
exports.api = function(debug) {
    if (debug === null || debug === undefined) debug = 0;  // default is off

    // PUBLIC FUNCTIONS

    /**
     * This function returns the virtual machine index for the specified intrinsic function name.
     *
     * @param {String} name The name of the intrinsic function.
     * @returns {Number} The index of the corresponding intrinsic function.
     */
    const index = function(name) {
        const result = names.indexOf(name);
        if (result < 1) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$index',
                $exception: '$invalidName',
                $name: name,
                $text: 'Attempted to retrieve the index of an invalid intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return result;
    };

    /**
     * This function invokes the intrinsic function associated with the specified index using
     * the specified arguments.
     *
     * @param {Number} index The index of the intrinsic function to invoke.
     * @param {Array} args The arguments to be passed to the function invocation.
     * @returns {Object} The result of the intrinsic function invocation.
     */
    const invoke = function(index, ...args) {
        if (index < 1 || index >= names.length) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$invoke',
                $exception: '$invalidIndex',
                $index: index,
                $text: 'Attempted to invoke an intrinsic function using an invalid index.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return functions[names[index]](args[0], args[1], args[2]);
    };


    // PRIVATE FUNCTIONS

    const validateSameType = function(procedure, first, second) {
        const firstType = first.getType();
        const secondType = second.getType();
        if (firstType !== secondType) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$parameterType',
                $first: firstType,
                $second: secondType,
                $text: 'The arguments passed into the intrinsic function are not the same type.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateTypeArgument = function(procedure, type, parameter) {
        if (!parameter.isType(type)) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$parameterType',
                $expected: type,
                $actual: parameter.getAncestry(),
                $text: 'An argument passed into an intrinsic function does not have the required ancestry.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateOptionalTypeArgument = function(procedure, type, parameter) {
        if (parameter && !parameter.isEqualTo(bali.pattern.NONE)) {
            validateTypeArgument(procedure, type, parameter);
        }
    };

    const validateInterfaceArgument = function(procedure, iface, parameter) {
        if (!parameter.supportsInterface(iface)) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$parameterType',
                $expected: iface,
                $actual: parameter.getType(),
                $text: 'An argument passed into an intrinsic function does not support a required interface.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateOptionalInterfaceArgument = function(procedure, iface, parameter) {
        if (parameter && !parameter.isEqualTo(bali.pattern.NONE)) {
            validateInterfaceArgument(procedure, iface, parameter);
        }
    };

    const validateIndex = function(procedure, size, index) {
        index = Math.abs(index);
        if (index === 0 || index > size) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$parameterValue',
                $expected: bali.range(1, size),
                $actual: index,
                $text: 'An invalid index was passed into an intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };


    /*
     * The list of intrinsic functions supported by the virtual machine.
     */
    const functions = {

        $invalid: function() {
            throw new Error('PROCESSOR: No intrinsic function should have an index of zero.');
        },

        $addItem: function(collection, item) {
            validateTypeArgument('$addItem', '/bali/abstractions/Collection', collection);
            collection.addItem(item);
            return collection;
        },

        $addItems: function(collection, items) {
            validateTypeArgument('$addItems', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$addItems', '/bali/abstractions/Collection', items);
            collection.addItems(items);
            return collection;
        },

        $ancestry: function(component) {
            return bali.list(component.getAncestry());
        },

        $and: function(first, second) {
            validateInterfaceArgument('$and', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$and', '/bali/interfaces/Logical', second);
            validateSameType('$and', first, second);
            return first.constructor.and(first, second);
        },

        $arccosine: function(ratio) {
            validateTypeArgument('$arccosine', '/bali/elements/Number', ratio);
            return bali.angle.arccosine(ratio.toNumber());
        },

        $arcsine: function(ratio) {
            validateTypeArgument('$arcsine', '/bali/elements/Number', ratio);
            return bali.angle.arcsine(ratio.toNumber());
        },

        $arctangent: function(opposite, adjacent) {
            validateTypeArgument('$arctangent', '/bali/elements/Number', opposite);
            validateTypeArgument('$arctangent', '/bali/elements/Number', adjacent);
            return bali.angle.arctangent(opposite.toNumber(), adjacent.toNumber());
        },

        $association: function(key, value) {
            validateTypeArgument('$association', '/bali/abstractions/Element', key);
            return bali.association(key, value);
        },

        $authority: function(reference) {
            validateTypeArgument('$authority', '/bali/elements/Reference', reference);
            return bali.text(reference.getAuthority());
        },

        $base2: function(binary, indentation) {
            validateTypeArgument('$base2', '/bali/elements/Binary', binary);
            validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            if (indentation) indentation = indentation.getValue();
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base2Encode(binary.getValue()));
        },

        $base16: function(binary, indentation) {
            validateTypeArgument('$base16', '/bali/elements/Binary', binary);
            validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            if (indentation) indentation = indentation.getValue();
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base16Encode(binary.getValue()));
        },

        $base32: function(binary, indentation) {
            validateTypeArgument('$base32', '/bali/elements/Binary', binary);
            validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            if (indentation) indentation = indentation.getValue();
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base32Encode(binary.getValue()));
        },

        $base64: function(binary, indentation) {
            validateTypeArgument('$base64', '/bali/elements/Binary', binary);
            validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            if (indentation) indentation = indentation.getValue();
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base64Encode(binary.getValue()));
        },

        $binary: function(number, parameters) {
            validateTypeArgument('$binary', '/bali/elements/Number', number);
            validateTypeArgument('$binary', '/bali/collections/Catalog', parameters);
            const bytes = bali.generator.generateBytes(number.toNumber());
            return bali.binary(bytes, parameters.toObject());
        },

        $boolean: function(component) {
            return bali.probability(component.toBoolean());
        },

        $bytes: function(tag) {
            validateTypeArgument('$bytes', '/bali/elements/Tag', tag);
            return bali.binary(tag.getBytes());
        },

        $catalog: function(items, parameters) {
            validateOptionalTypeArgument('$catalog', '/bali/abstractions/Collection', items);
            validateOptionalTypeArgument('$catalog', '/bali/collections/Catalog', parameters);
            return bali.catalog(items, parameters);
        },

        $coinToss: function(probability) {
            validateTypeArgument('$coinToss', '/bali/elements/Probability', probability);
            return bali.probability(bali.generator.flipCoin(probability.toNumber()));
        },

        $comparison: function(first, second) {
            validateSameType('$comparison', first, second);
            return bali.number(first.comparedTo(second));
        },

        $complement: function(angle) {
            validateTypeArgument('$complement', '/bali/elements/Angle', angle);
            return bali.angle.complement(angle);
        },

        $component: function(source) {
            validateTypeArgument('$component', '/bali/elements/Text', source);
            return bali.component(source.getValue());
        },

        $concatenation: function(first, second) {
            validateInterfaceArgument('$concatenation', '/bali/interfaces/Chainable', first);
            validateInterfaceArgument('$concatenation', '/bali/interfaces/Chainable', second);
            validateSameType('$concatenation', first, second);
            return first.constructor.concatenation(first, second);
        },

        $conjugate: function(number) {
            validateTypeArgument('$conjugate', '/bali/elements/Number', number);
            return bali.number.conjugate(number);
        },

        $containsAll: function(collection, items) {
            validateTypeArgument('$containsAll', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$containsAll', '/bali/abstractions/Collection', items);
            return bali.probability(collection.containsAll(items));
        },

        $containsAny: function(collection, items) {
            validateTypeArgument('$containsAny', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$containsAny', '/bali/abstractions/Collection', items);
            return bali.probability(collection.containsAny(items));
        },

        $containsItem: function(collection, item) {
            validateTypeArgument('$containsItem', '/bali/abstractions/Collection', collection);
            return bali.probability(collection.containsItem(item));
        },

        $cosine: function(angle) {
            validateTypeArgument('$cosine', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.cosine(angle));
        },

        $default: function(component, defaultValue) {
            return !component.isEqualTo(bali.pattern.NONE) ? component : defaultValue;
        },

        $degrees: function(angle) {
            validateTypeArgument('$degrees', '/bali/elements/Angle', angle);
            return bali.number(angle.getDegrees());
        },

        $difference: function(first, second) {
            validateInterfaceArgument('$difference', '/bali/interfaces/Scalable', first);
            validateInterfaceArgument('$difference', '/bali/interfaces/Scalable', second);
            validateSameType('$difference', first, second);
            return first.constructor.difference(first, second);
        },

        $document: function(component, indentation) {
            validateTypeArgument('$document', '/bali/elements/Text', indentation);
            return bali.text(EOL + component.toBDN(indentation.getValue()) + EOL);
        },

        $duplicate: function(component) {
            return component.duplicate();
        },

        $duration: function(firstMoment, lastMoment) {
            validateTypeArgument('$duration', '/bali/elements/Moment', firstMoment);
            validateTypeArgument('$duration', '/bali/elements/Moment', lastMoment);
            return bali.moment.duration(firstMoment, lastMoment);
        },

        $earlier: function(moment, duration) {
            validateTypeArgument('$earlier', '/bali/elements/Moment', moment);
            validateTypeArgument('$earlier', '/bali/elements/Duration', duration);
            return bali.moment.earlier(moment, duration);
        },

        $equal: function(first, second) {
            return bali.probability(first.isEqualTo(second));
        },

        $exponential: function(base, exponent) {
            validateTypeArgument('$exponential', '/bali/elements/Number', base);
            validateTypeArgument('$exponential', '/bali/elements/Number', exponent);
            return bali.number.exponential(base, exponent);
        },

        $extraction: function(catalog, keys) {
            validateTypeArgument('$extraction', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$extraction', '/bali/collections/List', keys);
            return bali.catalog.extraction(catalog, keys);
        },

        $factorial: function(number) {
            validateTypeArgument('$factorial', '/bali/elements/Number', number);
            return bali.number.factorial(number);
        },

        $format: function(moment) {
            validateTypeArgument('$format', '/bali/elements/Moment', moment);
            return bali.Text(moment.getFormat());
        },

        $fragment: function(reference) {
            validateTypeArgument('$fragment', '/bali/elements/Reference', reference);
            return bali.Text(reference.getFragment());
        },

        $getFirst: function(range) {
            validateTypeArgument('$getFirst', '/bali/collections/Range', range);
            return range.getFirstItem();
        },

        $getHead: function(queue) {
            validateTypeArgument('$getHead', '/bali/collections/Queue', queue);
            return queue.headItem();
        },

        $getIndex: function(collection, item) {
            validateTypeArgument('$getIndex', '/bali/abstractions/Collection', collection);
            return bali.number(collection.getIndex(item));
        },

        $getItem: function(collection, index) {
            validateTypeArgument('$getItem', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$getItem', '/bali/elements/Number', index);
            validateIndex('$getItem', collection.getSize(), index);
            return collection.getItem(index.getNumber());
        },

        $getItems: function(collection, range) {
            validateTypeArgument('$getItems', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$getItems', '/bali/collections/Range', range);
            return collection.getItems(range);
        },

        $getLast: function(range) {
            validateTypeArgument('$getLast', '/bali/collections/Range', range);
            return range.getLast();
        },

        $getNext: function(iterator) {
            validateTypeArgument('$getNext', '/bali/abstractions/Iterator', iterator);
            return iterator.getNext();
        },

        $getParameter: function(component, key) {
            validateTypeArgument('$getParameter', '/bali/abstractions/Element', key);
            return component.getParameter(key);
        },

        $getPrevious: function(iterator) {
            validateTypeArgument('$getPrevious', '/bali/abstractions/Iterator', iterator);
            return iterator.getNext();
        },

        $getTop: function(stack) {
            validateTypeArgument('$getTop', '/bali/collections/Stack', stack);
            return stack.topItem();
        },

        $getValue: function(catalog, key) {
            validateTypeArgument('$getValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$getValue', '/bali/abstractions/Element', key);
            return catalog.getValue(key) || bali.pattern.NONE;
        },

        $getValues: function(catalog, keys) {
            validateTypeArgument('$getValues', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$getValues', '/bali/collections/List', keys);
            return catalog.getValues(keys);
        },

        $hash: function(component) {
            return bali.number(component.getHash());
        },

        $hasNext: function(iterator) {
            validateTypeArgument('$hasNext', '/bali/abstractions/Iterator', iterator);
            return iterator.hasNext();
        },

        $hasPrevious: function(iterator) {
            validateTypeArgument('$hasPrevious', '/bali/abstractions/Iterator', iterator);
            return iterator.hasPrevious();
        },

        $HTML: function(component, style) {
            validateTypeArgument('$HTML', '/bali/elements/Reference', style);
            return bali.text(EOL + component.toHTML(style.getValue().toString()) + EOL);
        },

        $imaginary: function(number) {
            validateTypeArgument('$imaginary', '/bali/elements/Number', number);
            return bali.number(number.getImaginary());
        },

        $insertItem: function(list, index, item) {
            validateTypeArgument('$insertItem', '/bali/collections/List', list);
            validateTypeArgument('$insertItem', '/bali/elements/Number', index);
            validateIndex('$insertItem', list.getSize(), index);
            list.insertItem(index.getNumber(), item);
            return list;
        },

        $insertItems: function(list, index, items) {
            validateTypeArgument('$insertItems', '/bali/collections/List', list);
            validateTypeArgument('$insertItems', '/bali/elements/Number', index);
            validateTypeArgument('$insertItems', '/bali/abstractions/Collection', items);
            validateIndex('$insertItems', list.getSize(), index);
            list.insertItems(index.getNumber(), items);
            return list;
        },

        $interfaces: function(component) {
            return bali.list(component.getInterfaces());
        },

        $inverse: function(scalable) {
            validateInterfaceArgument('$inverse', '/bali/interfaces/Scalable', scalable);
            return scalable.constructor.inverse(scalable);
        },

        $isEmpty: function(sequential) {
            validateInterfaceArgument('$isEmpty', '/bali/interfaces/Sequential', sequential);
            return bali.probability(sequential.isEmpty());
        },

        $isInfinite: function(number) {
            validateTypeArgument('$isInfinite', '/bali/elements/Number', number);
            return bali.probability(number.isInfinite());
        },

        $isParameterized: function(component) {
            return bali.probability(component.isParameterized());
        },

        $isType: function(component, type) {
            validateTypeArgument('$isType', '/bali/elements/Name', type);
            return bali.probability(component.isType(type.toString()));
        },

        $isUndefined: function(number) {
            validateTypeArgument('$isUndefined', '/bali/elements/Number', number);
            return bali.probability(number.isUndefined());
        },

        $isZero: function(number) {
            validateTypeArgument('$isZero', '/bali/elements/Number', number);
            return bali.probability(number.isZero());
        },

        $iterator: function(collection) {
            validateTypeArgument('$iterator', '/bali/abstractions/Collection', collection);
            return collection.getIterator();
        },

        $key: function(association) {
            validateTypeArgument('$key', '/bali/composites/Association', association);
            return association.getKey();
        },

        $keys: function(catalog) {
            validateTypeArgument('$keys', '/bali/collections/Catalog', catalog);
            return catalog.getKeys();
        },

        $later: function(moment, duration) {
            validateTypeArgument('$later', '/bali/elements/Moment', moment);
            validateTypeArgument('$later', '/bali/elements/Duration', duration);
            return bali.moment.later(moment, duration);
        },

        $less: function(first, second) {
            return bali.probability(first.comparedTo(second) < 0);
        },

        $levels: function(version) {
            validateTypeArgument('$levels', '/bali/elements/Version' , version);
            return bali.list(version.getValue());
        },

        $list: function(items, parameters) {
            validateOptionalTypeArgument('$list', '/bali/abstractions/Collection', items);
            validateOptionalTypeArgument('$list', '/bali/collections/Catalog', parameters);
            return bali.list(items, parameters);
        },

        $logarithm: function(number) {
            validateTypeArgument('$logarithm', '/bali/elements/Number', number);
            return bali.number.logarithm(number);
        },

        $magnitude: function(number) {
            validateTypeArgument('$magnitude', '/bali/elements/Number', number);
            return bali.number(number.getMagnitude());
        },

        $matches: function(component, pattern) {
            validateTypeArgument('$matches', '/bali/elements/Pattern', pattern);
            return bali.probability(component.isMatchedBy(pattern));
        },

        $more: function(first, second) {
            return bali.probability(first.comparedTo(second) > 0);
        },

        $nextVersion: function(version, level) {
            validateTypeArgument('$nextVersion', '/bali/elements/Version', version);
            validateTypeArgument('$nextVersion', '/bali/elements/Number', level);
            validateIndex('$nextVersion', version.getSize() + 1, level);  // allow for the next subversion
            return bali.version.nextVersion(version, level);
        },

        $not: function(logical) {
            validateInterfaceArgument('$not', '/bali/interfaces/Logical', logical);
            return logical.constructor.not(logical);
        },

        $now: function() {
            return bali.moment();
        },

        $number: function(numeric) {
            return bali.number(numeric.toNumber());
        },

        $or: function(first, second) {
            validateInterfaceArgument('$or', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$or', '/bali/interfaces/Logical', second);
            validateSameType('$or', first, second);
            return first.constructor.or(first, second);
        },

        $parameters: function(component) {
            return bali.catalog(component.getParameters());
        },

        $parent: function(tree) {
            validateTypeArgument('$parent', '/bali/collections/Tree', tree);
            return tree.getParent();
        },

        $path: function(reference) {
            validateTypeArgument('$path', '/bali/elements/Reference', reference);
            return bali.text(reference.getPath());
        },

        $phase: function(number) {
            validateTypeArgument('$phase', '/bali/elements/Number', number);
            return number.getPhase();
        },

        $probability: function() {
            return bali.probability.random();
        },

        $procedure: function(statements, parameters) {
            validateTypeArgument('$procedure', '/bali/collections/Tree', statements);
            validateTypeArgument('$procedure', '/bali/collections/Catalog', parameters);
            return bali.procedure(statements, parameters);
        },

        $product: function(first, second) {
            validateTypeArgument('$product', '/bali/elements/Number', first);
            validateTypeArgument('$product', '/bali/elements/Number', second);
            return bali.number.product(first, second);
        },

        $query: function(reference) {
            validateTypeArgument('$query', '/bali/elements/Reference', reference);
            return bali.text(reference.getQuery());
        },

        $queue: function(items, parameters) {
            validateOptionalTypeArgument('$queue', '/bali/abstractions/Collection', items);
            validateOptionalTypeArgument('$queue', '/bali/collections/Catalog', parameters);
            return bali.queue(items, parameters);
        },

        $quotient: function(first, second) {
            validateTypeArgument('$quotient', '/bali/elements/Number', first);
            validateTypeArgument('$quotient', '/bali/elements/Number', second);
            return bali.number.quotient(first, second);
        },

        $radians: function(angle) {
            validateTypeArgument('$radians', '/bali/elements/Angle', angle);
            return bali.number(angle.getRadians());
        },

        $range: function(first, last, parameters) {
            validateAreSameType('$range', first, last);
            validateOptionalTypeArgument('$range', '/bali/collections/Catalog', parameters);
            return bali.range(first, last, parameters);
        },

        $real: function(number) {
            validateTypeArgument('$real', '/bali/elements/Number', number);
            return bali.number(number.getReal());
        },

        $reciprocal: function(number) {
            validateTypeArgument('$reciprocal', '/bali/elements/Number', number);
            return bali.number.reciprocal(number);
        },

        $remainder: function(first, second) {
            validateTypeArgument('$remainder', '/bali/elements/Number', first);
            validateTypeArgument('$remainder', '/bali/elements/Number', second);
            return bali.number.remainder(first, second);
        },

        $removeAll: function(collection) {
            validateTypeArgument('$removeAll', '/bali/abstractions/Collection', collection);
            collection.removeAll();
            return collection;
        },

        $removeHead: function(queue) {
            validateTypeArgument('$removeHead', '/bali/collections/Queue', queue);
            return queue.removeItem();
        },

        $removeIndex: function(list, index) {
            validateTypeArgument('$removeIndex', '/bali/collections/List', list);
            validateTypeArgument('$removeIndex', '/bali/elements/Number', index);
            validateIndex('$removeIndex', list.getSize(), index);
            return list.removeItem(index);
        },

        $removeItem: function(set, item) {
            validateTypeArgument('$removeItem', '/bali/collections/Set', set);
            return bali.probability(set.removeItem(item));
        },

        $removeItems: function(set, items) {
            validateTypeArgument('$removeItems', '/bali/collections/Set', set);
            validateTypeArgument('$removeItems', '/bali/abstractions/Collection', items);
            return bali.number(set.removeItems(items));
        },

        $removeRange: function(list, range) {
            validateTypeArgument('$removeRange', '/bali/collections/List', list);
            validateTypeArgument('$removeRange', '/bali/collections/Range', range);
            return list.removeItems(range);
        },

        $removeTop: function(stack) {
            validateTypeArgument('$removeTop', '/bali/collections/Stack', stack);
            return stack.removeItem();
        },

        $removeValue: function(catalog, key) {
            validateTypeArgument('$removeValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeValue', '/bali/abstractions/Element', key);
            return catalog.removeValue(key);
        },

        $removeValues: function(catalog, keys) {
            validateTypeArgument('$removeValues', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeValues', '/bali/collections/List', keys);
            return catalog.removeValues(keys);
        },

        $reverseItems: function(sortable) {
            validateInterfaceArgument('$reverseItems', '/bali/interfaces/Sortable', sortable);
            sortable.reverseItems();
            return sortable;
        },

        $same: function(first, second) {
            return bali.probability(first === second);
        },

        $sans: function(first, second) {
            validateInterfaceArgument('$sans', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$sans', '/bali/interfaces/Logical', second);
            validateAreSameType('$sans', first, second);
            return first.constructor.sans(first, second);
        },

        $scaled: function(scalable, factor) {
            validateInterfaceArgument('$scaled', '/bali/interfaces/Scalable', scalable);
            validateTypeArgument('$scaled', '/bali/elements/Number', factor);
            return scalable.constructor.scaled(scalable, factor);
        },

        $scheme: function(reference) {
            validateTypeArgument('$scheme', '/bali/elements/Reference', reference);
            return bali.text(reference.getScheme());
        },

        $set: function(items, parameters) {
            validateOptionalTypeArgument('$set', '/bali/abstractions/Collection', items);
            validateOptionalTypeArgument('$set', '/bali/collections/Catalog', parameters);
            return bali.set(items, parameters);
        },

        $setItem: function(list, index, item) {
            validateTypeArgument('$setItem', '/bali/collections/List', list);
            validateTypeArgument('$setItem', '/bali/elements/Number', index);
            validateIndex('$setItem', list.getSize(), index);
            list.setItem(index, item);
            return list;
        },

        $setValue: function(catalog, key, value) {
            validateTypeArgument('$setValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$setValue', '/bali/abstractions/Element', key);
            catalog.setValue(key, value);
            return catalog;
        },

        $shuffleItems: function(list) {
            validateTypeArgument('$shuffleItems', '/bali/collections/List', list);
            list.shuffleItems();
            return list;
        },

        $sine: function(angle) {
            validateTypeArgument('$sine', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.sine(angle));
        },

        $size: function(sequential) {
            validateInterfaceArgument('$size', '/bali/interfaces/Sequential', sequential);
            return bali.number(sequential.getSize());
        },

        $sortItems: function(sortable) {
            validateInterfaceArgument('$sortItems', '/bali/interfaces/Sortable', sortable);
            sortable.sortItems();
            return sortable;
        },

        $stack: function(items, parameters) {
            validateOptionalTypeArgument('$stack', '/bali/abstractions/Collection', items);
            validateOptionalTypeArgument('$stack', '/bali/collections/Catalog', parameters);
            return bali.stack(items, parameters);
        },

        $statements: function(procedure) {
            validateTypeArgument('$statements', '/bali/composites/Procedure', procedure);
            return procedure.getStatements();
        },

        $sum: function(first, second) {
            validateInterfaceArgument('$sum', '/bali/interfaces/Scalable', first);
            validateInterfaceArgument('$sum', '/bali/interfaces/Scalable', second);
            validateAreSameType('$sum', first, second);
            return first.constructor.sum(first, second);
        },

        $supplement: function(angle) {
            validateTypeArgument('$supplement', '/bali/elements/Angle', angle);
            return bali.angle.supplement(angle);
        },

        $supportsInterface: function(component, iface) {
            validateTypeArgument('$supportsInterface', '/bali/elements/Name', iface);
            return component.supportsInterface(iface);
        },

        $tag: function(size) {
            validateOptionalTypeArgument('$tag', '/bali/elements/Number', size);
            return bali.tag(size);
        },

        $tangent: function(angle) {
            validateTypeArgument('$tangent', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.tangent(angle));
        },

        $toEnd: function(iterator) {
            validateTypeArgument('$toEnd', '/bali/abstractions/Iterator', iterator);
            iterator.toEnd();
            return iterator;
        },

        $toSlot: function(iterator, slot) {
            validateTypeArgument('$toSlot', '/bali/abstractions/Iterator', iterator);
            validateTypeArgument('$toSlot', '/bali/elements/Number', slot);
            iterator.toSlot(slot);
            return iterator;
        },

        $toStart: function(iterator) {
            validateTypeArgument('$toStart', '/bali/abstractions/Iterator', iterator);
            iterator.toStart();
            return iterator;
        },

        $tree: function(type, children) {
            validateTypeArgument('$tree', '/bali/elements/Name', type);
            validateOptionalTypeArgument('$tree', '/bali/abstractions/Collection', children);
            return bali.tree(type, children);
        },

        $type: function(component) {
            return bali.component(component.getType());
        },

        $validNextVersion: function(current, next) {
            validateTypeArgument('$validNextVersion', '/bali/elements/Version', current);
            validateTypeArgument('$validNextVersion', '/bali/elements/Version', next);
            return bali.probability(bali.version.validNextVersion(current, next));
        },

        $value: function(association) {
            validateTypeArgument('$value', '/bali/composites/Association', association);
            return association.getValue();
        },

        $xor: function(first, second) {
            validateInterfaceArgument('$xor', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$xor', '/bali/interfaces/Logical', second);
            validateAreSameType('$xor', first, second);
            return first.constructor.xor(first, second);
        }

    };

    /*
     * A list of the names of the intrinsic functions supported by the virtual machine.
     */
    const names = Object.keys(functions);  // javascript now preserves the chronological order of keys

    // return the actual API
    return {
        index: index,
        invoke: invoke
    };

};