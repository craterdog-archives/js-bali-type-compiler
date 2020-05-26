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
 * Virtual Processor. The functions use the following naming convention:
 * <pre>
 *  1. Functions that return a component or part of a component are named using noun or
 *     adjective phrases.
 *  2. Functions that modify something are named using verb phrases.
 *  3. Functions that ask a question return a boolean value.
 * </pre>
 */
const hasher = require('crypto');
const Compiler = require('./Compiler').Compiler;

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
    const bali = require('bali-component-framework').api(debug);
    const compiler = new Compiler(debug);
    const validator = bali.validator(debug);
    const generator = bali.generator(debug);

    // PUBLIC FUNCTIONS

    /**
     * This function returns the virtual machine index for the specified intrinsic function name.
     *
     * @param {Number} index The index of the intrinsic function.
     * @returns {String} The name of the corresponding intrinsic function.
     */
    const name = function(index) {
        const result = names[index];
        if (!result) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$name',
                $exception: '$invalidIndex',
                $name: name,
                $text: 'Attempted to retrieve the name of an invalid intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return result;
    };

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
     * @param {Component} argument1 The first argument.
     * @param {Component} argument2 The second argument.
     * @param {Component} argument3 The second argument.
     * @returns {Object} The result of the intrinsic function invocation.
     */
    const invoke = function(index, argument1, argument2, argument3) {
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
        return functions[index](argument1, argument2, argument3);
    };


    // PRIVATE FUNCTIONS

    const validateTypeArgument = function(procedure, type, argument) {
        if (argument === undefined || argument === null || !argument.isComponent || !argument.isType(type)) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $expected: type,
                $actual: bali.type(argument),
                $text: 'An argument passed into an intrinsic function does not have the required type.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateOptionalTypeArgument = function(procedure, type, argument) {
        if (bali.pattern.NONE.isEqualTo(argument)) return undefined;
        if (argument !== undefined) {
            validateTypeArgument(procedure, type, argument);
        }
        return argument;
    };

    const validateInterfaceArgument = function(procedure, iface, argument) {
        if (argument === undefined || argument === null || !argument.isComponent || !argument.supportsInterface(iface)) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $expected: iface,
                $actual: (argument && argument.isComponent) ? argument.getInterfaces() : bali.type(argument),
                $text: 'An argument passed into an intrinsic function does not support a required interface.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateSameType = function(procedure, first, second) {
        const firstType = first.getType();
        const secondType = second.getType();
        if (firstType !== secondType) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $first: firstType,
                $second: secondType,
                $text: 'The arguments passed into the intrinsic function are not the same type.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateIndex = function(procedure, size, index) {
        if (size === 0) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentValue',
                $text: 'An empty sequence cannot be accessed with an index.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        if (Math.round(index) !== index) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $index: index,
                $text: 'The index passed into the intrinsic function is not an integer.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        index = Math.abs(index);  // handle reverse indexing
        if (index === 0 || index > size) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentValue',
                $expected: bali.range(1, size),
                $actual: index,
                $text: 'An invalid index was passed into an intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const citeDocument = function(document) {
        // extract the required attributes
        const tag = document.getParameter('$tag');
        const version = document.getParameter('$version');

        // generate a digest of the document
        const bytes = Buffer.from(document.toString(), 'utf8');
        const hash = hasher.createHash('sha512');
        hash.update(bytes);
        const digest = bali.binary(hash.digest());

        // create the citation
        const citation = bali.catalog({
            $protocol: 'v2',
            $tag: tag,
            $version: version,
            $digest: digest
        }, {
            $type: '/bali/notary/Citation/v1'
        });

        return citation;
    };


    /*
     * The list of intrinsic functions supported by the virtual machine.
     */
    const intrinsics = {

        $invalid: function() {
            throw new Error('PROCESSOR: No intrinsic function should have an index of zero.');
        },

        $addItem: function(collection, item) {
            validateTypeArgument('$addItem', '/bali/types/Collection', collection);
            validateTypeArgument('$addItem', '/bali/types/Component', item);
            collection.addItem(item);
            return collection;
        },

        $addItems: function(collection, items) {
            validateTypeArgument('$addItems', '/bali/types/Collection', collection);
            validateTypeArgument('$addItems', '/bali/types/Collection', items);
            collection.addItems(items);
            return collection;
        },

        $ancestry: function(component) {
            validateTypeArgument('$ancestry', '/bali/types/Component', component);
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

        $areEqual: function(first, second) {
            validateTypeArgument('$areEqual', '/bali/types/Component', first);
            validateTypeArgument('$areEqual', '/bali/types/Component', second);
            return bali.probability(first.isEqualTo(second));
        },

        $areSame: function(first, second) {
            validateTypeArgument('$areSame', '/bali/types/Component', first);
            validateTypeArgument('$areSame', '/bali/types/Component', second);
            return bali.probability(first === second);
        },

        $areValid: function(current, next) {
            validateTypeArgument('$areValid', '/bali/elements/Version', current);
            validateTypeArgument('$areValid', '/bali/elements/Version', next);
            return bali.probability(bali.version.validNextVersion(current, next));
        },

        $association: function(key, value) {
            validateTypeArgument('$association', '/bali/types/Element', key);
            validateTypeArgument('$association', '/bali/types/Component', value);
            return bali.association(key, value);
        },

        $authority: function(reference) {
            validateTypeArgument('$authority', '/bali/elements/Reference', reference);
            return bali.text(reference.getAuthority());
        },

        $base2: function(binary, indentation) {
            validateTypeArgument('$base2', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toNumber();
                validateIndex('$base2', 20, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base2Encode(binary.getValue()));
        },

        $base16: function(binary, indentation) {
            validateTypeArgument('$base16', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toNumber();
                validateIndex('$base16', 20, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base16Encode(binary.getValue()));
        },

        $base32: function(binary, indentation) {
            validateTypeArgument('$base32', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base2', '/bali/elements/Number', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toNumber();
                validateIndex('$base32', 20, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base32Encode(binary.getValue()));
        },

        $base64: function(binary, indentation) {
            validateTypeArgument('$base64', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base64', '/bali/elements/Number', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toNumber();
                validateIndex('$base64', 20, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base64Encode(binary.getValue()));
        },

        $binary: function(number, parameters) {
            validateTypeArgument('$binary', '/bali/elements/Number', number);
            parameters = validateOptionalTypeArgument('$binary', '/bali/collections/Catalog', parameters);
            number = number.toNumber();
            validateIndex('$binary', 1024, number);
            const bytes = generator.generateBytes(number);
            return bali.binary(bytes, parameters);
        },

        $boolean: function(component) {
            validateTypeArgument('$boolean', '/bali/types/Component', component);
            return bali.probability(component.toBoolean());
        },

        $bytes: function(tag) {
            validateTypeArgument('$bytes', '/bali/elements/Tag', tag);
            return bali.binary(tag.getBytes());
        },

        $catalog: function(items, parameters) {
            items = validateOptionalTypeArgument('$catalog', '/bali/types/Collection', items);
            parameters = validateOptionalTypeArgument('$catalog', '/bali/collections/Catalog', parameters);
            return bali.catalog(items, parameters);
        },

        $citation: function(catalog) {
            validateTypeArgument('$citation', '/bali/collections/Catalog', catalog);
            return citeDocument(catalog);
        },

        $cleanType: function(type) {
            validateTypeArgument('$cleanType', '/bali/collections/Catalog', type);
            compiler.cleanType(type);
            return type;
        },

        $coinToss: function(probability) {
            validateTypeArgument('$coinToss', '/bali/elements/Probability', probability);
            return bali.probability(generator.flipCoin(probability.toNumber()));
        },

        $comparison: function(first, second) {
            validateTypeArgument('$comparison', '/bali/types/Component', first);
            validateTypeArgument('$comparison', '/bali/types/Component', second);
            return bali.number(first.comparedTo(second));
        },

        $compileType: function(type) {
            validateTypeArgument('$compileType', '/bali/collections/Catalog', type);
            compiler.compileType(type);
            return type;
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
            validateTypeArgument('$containsAll', '/bali/types/Collection', collection);
            validateTypeArgument('$containsAll', '/bali/types/Collection', items);
            return bali.probability(collection.containsAll(items));
        },

        $containsAny: function(collection, items) {
            validateTypeArgument('$containsAny', '/bali/types/Collection', collection);
            validateTypeArgument('$containsAny', '/bali/types/Collection', items);
            return bali.probability(collection.containsAny(items));
        },

        $containsItem: function(collection, item) {
            validateTypeArgument('$containsItem', '/bali/types/Collection', collection);
            validateTypeArgument('$containsItem', '/bali/types/Component', item);
            return bali.probability(collection.containsItem(item));
        },

        $cosine: function(angle) {
            validateTypeArgument('$cosine', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.cosine(angle));
        },

        $day: function(moment) {
            validateTypeArgument('$days', '/bali/elements/Moment', moment);
            return bali.number(moment.getDay(moment));
        },

        $days: function(duration) {
            validateTypeArgument('$day', '/bali/elements/Duration', duration);
            return bali.number(duration.getDays(duration));
        },

        $default: function(component, defaultValue) {
            validateTypeArgument('$default', '/bali/types/Component', component);
            validateTypeArgument('$default', '/bali/types/Component', defaultValue);
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
            validateTypeArgument('$document', '/bali/types/Component', component);
            indentation = validateOptionalTypeArgument('$document', '/bali/elements/Number', indentation);
            if (indentation) {
                indentation = indentation.toNumber();
                validateIndex('$document', 20, indentation);
            }
            return bali.text(EOL + component.toBDN(indentation) + EOL);
        },

        $doesMatch: function(component, pattern) {
            validateTypeArgument('$doesMatch', '/bali/types/Component', component);
            validateTypeArgument('$doesMatch', '/bali/types/Component', pattern);
            return bali.probability(component.isMatchedBy(pattern));
        },

        $duplicate: function(component) {
            validateTypeArgument('$duplicate', '/bali/types/Component', component);
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

        $first: function(range) {
            validateTypeArgument('$first', '/bali/elements/Range', range);
            const first = range.getFirst();
            return (first === undefined) ? bali.pattern.NONE : bali.number(first);
        },

        $format: function(moment) {
            validateTypeArgument('$format', '/bali/elements/Moment', moment);
            return bali.text(moment.getFormat());
        },

        $fragment: function(reference) {
            validateTypeArgument('$fragment', '/bali/elements/Reference', reference);
            return bali.text(reference.getFragment());
        },

        $hash: function(component) {
            validateTypeArgument('$hash', '/bali/types/Component', component);
            return bali.number(component.getHash());
        },

        $hasNext: function(iterator) {
            validateTypeArgument('$hasNext', '/bali/types/Iterator', iterator);
            return iterator.hasNext();
        },

        $hasPrevious: function(iterator) {
            validateTypeArgument('$hasPrevious', '/bali/types/Iterator', iterator);
            return iterator.hasPrevious();
        },

        $head: function(queue) {
            validateTypeArgument('$head', '/bali/collections/Queue', queue);
            return queue.headItem();
        },

        $hour: function(moment) {
            validateTypeArgument('$hour', '/bali/elements/Moment', moment);
            return bali.number(moment.getHour(moment));
        },

        $hours: function(duration) {
            validateTypeArgument('$hours', '/bali/elements/Duration', duration);
            return bali.number(duration.getHours(duration));
        },

        $HTML: function(component, style) {
            validateTypeArgument('$HTML', '/bali/types/Component', component);
            validateTypeArgument('$HTML', '/bali/elements/Reference', style);
            return bali.text(EOL + component.toHTML(style.getValue().toString()) + EOL);
        },

        $imaginary: function(number) {
            validateTypeArgument('$imaginary', '/bali/elements/Number', number);
            return bali.number(number.getImaginary());
        },

        $index: function(sequential, item) {
            validateInterfaceArgument('$index', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$index', '/bali/types/Component', item);
            return bali.number(sequential.getIndex(item));
        },

        $insertItem: function(list, index, item) {
            validateTypeArgument('$insertItem', '/bali/collections/List', list);
            validateTypeArgument('$insertItem', '/bali/elements/Number', index);
            validateTypeArgument('$insertItem', '/bali/types/Component', item);
            index = index.toNumber();
            validateIndex('$insertItem', list.getSize(), index);
            list.insertItem(index, item);
            return list;
        },

        $insertItems: function(list, index, items) {
            validateTypeArgument('$insertItems', '/bali/collections/List', list);
            validateTypeArgument('$insertItems', '/bali/elements/Number', index);
            validateTypeArgument('$insertItems', '/bali/types/Collection', items);
            index = index.toNumber();
            validateIndex('$insertItems', list.getSize(), index);
            list.insertItems(index, items);
            return list;
        },

        $instance: function(type, attributes) {
            validateTypeArgument('$instance', '/bali/elements/Name', type);
            validateTypeArgument('$instance', '/bali/collections/Catalog', attributes);
            return bali.instance(type, attributes);
        },

        $interfaces: function(component) {
            validateTypeArgument('$interfaces', '/bali/types/Component', component);
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

        $isLess: function(first, second) {
            validateTypeArgument('$isLess', '/bali/types/Component', first);
            validateTypeArgument('$isLess', '/bali/types/Component', second);
            return bali.probability(first.comparedTo(second) < 0);
        },

        $isMore: function(first, second) {
            validateTypeArgument('$isMore', '/bali/types/Component', first);
            validateTypeArgument('$isMore', '/bali/types/Component', second);
            return bali.probability(first.comparedTo(second) > 0);
        },

        $isParameterized: function(component) {
            validateTypeArgument('$isParameterized', '/bali/types/Component', component);
            return bali.probability(component.isParameterized());
        },

        $isType: function(component, type) {
            validateTypeArgument('$isType', '/bali/types/Component', component);
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

        $item: function(sequential, index) {
            validateInterfaceArgument('$item', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$item', '/bali/elements/Number', index);
            index = index.toNumber();
            validateIndex('$item', sequential.getSize(), index);
            return sequential.componentize(sequential.getItem(index));
        },

        $items: function(sequential, range) {
            validateInterfaceArgument('$items', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$items', '/bali/elements/Range', range);
            return sequential.getItems(range);
        },

        $iterator: function(sequential) {
            validateInterfaceArgument('$iterator', '/bali/interfaces/Sequential', sequential);
            return sequential.getIterator();
        },

        $key: function(association) {
            validateTypeArgument('$key', '/bali/composites/Association', association);
            return association.getKey();
        },

        $keys: function(catalog) {
            validateTypeArgument('$keys', '/bali/collections/Catalog', catalog);
            return catalog.getKeys();
        },

        $keyValue: function(catalog, key) {
            validateTypeArgument('$keyValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$keyValue', '/bali/types/Element', key);
            return catalog.getValue(key) || bali.pattern.NONE;
        },

        $last: function(range) {
            validateTypeArgument('$last', '/bali/elements/Range', range);
            const last = range.getLast();
            return (last === undefined) ? bali.pattern.NONE : bali.number(last);
        },

        $later: function(moment, duration) {
            validateTypeArgument('$later', '/bali/elements/Moment', moment);
            validateTypeArgument('$later', '/bali/elements/Duration', duration);
            return bali.moment.later(moment, duration);
        },

        $levels: function(version) {
            validateTypeArgument('$levels', '/bali/elements/Version' , version);
            return bali.list(version.getValue());
        },

        $list: function(items, parameters) {
            items = validateOptionalTypeArgument('$list', '/bali/types/Collection', items);
            parameters = validateOptionalTypeArgument('$list', '/bali/collections/Catalog', parameters);
            return bali.list(items, parameters);
        },

        $logarithm: function(base, value) {
            validateTypeArgument('$logarithm', '/bali/elements/Number', base);
            validateTypeArgument('$logarithm', '/bali/elements/Number', value);
            return bali.number.logarithm(base, value);
        },

        $magnitude: function(number) {
            validateTypeArgument('$magnitude', '/bali/elements/Number', number);
            return bali.number(number.getMagnitude());
        },

        $millisecond: function(moment) {
            validateTypeArgument('$millisecond', '/bali/elements/Moment', moment);
            return bali.number(moment.getMillisecond(moment));
        },

        $milliseconds: function(duration) {
            validateTypeArgument('$milliseconds', '/bali/elements/Duration', duration);
            return bali.number(duration.getMilliseconds(duration));
        },

        $minute: function(moment) {
            validateTypeArgument('$minute', '/bali/elements/Moment', moment);
            return bali.number(moment.getMinute(moment));
        },

        $minutes: function(duration) {
            validateTypeArgument('$minutes', '/bali/elements/Duration', duration);
            return bali.number(duration.getMinutes(duration));
        },

        $month: function(moment) {
            validateTypeArgument('$month', '/bali/elements/Moment', moment);
            return bali.number(moment.getMonth(moment));
        },

        $months: function(duration) {
            validateTypeArgument('$months', '/bali/elements/Duration', duration);
            return bali.number(duration.getMonths(duration));
        },

        $next: function(iterator) {
            validateTypeArgument('$next', '/bali/types/Iterator', iterator);
            return iterator.componentize(iterator.getNext());
        },

        $nextVersion: function(version, level) {
            validateTypeArgument('$nextVersion', '/bali/elements/Version', version);
            validateTypeArgument('$nextVersion', '/bali/elements/Number', level);
            level = level.toNumber();
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

        $number: function(numerical) {
            validateInterfaceArgument('$number', '/bali/interfaces/Numerical', numerical);
            return bali.number(numerical.toNumber());
        },

        $or: function(first, second) {
            validateInterfaceArgument('$or', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$or', '/bali/interfaces/Logical', second);
            validateSameType('$or', first, second);
            return first.constructor.or(first, second);
        },

        $parameter: function(component, key) {
            validateTypeArgument('$parameter', '/bali/types/Component', component);
            validateTypeArgument('$parameter', '/bali/types/Element', key);
            return component.getParameter(key);
        },

        $parameters: function(component) {
            validateTypeArgument('$parameters', '/bali/types/Component', component);
            return component.getParameters();
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

        $previous: function(iterator) {
            validateTypeArgument('$previous', '/bali/types/Iterator', iterator);
            return iterator.componentize(iterator.getPrevious());
        },

        $probability: function() {
            return bali.probability.random();
        },

        $procedure: function(statements, parameters) {
            validateTypeArgument('$procedure', '/bali/composites/Statements', statements);
            parameters = validateOptionalTypeArgument('$procedure', '/bali/collections/Catalog', parameters);
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
            items = validateOptionalTypeArgument('$queue', '/bali/types/Collection', items);
            parameters = validateOptionalTypeArgument('$queue', '/bali/collections/Catalog', parameters);
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
            first = validateOptionalTypeArgument('$range', '/bali/elements/Number', first);
            last = validateOptionalTypeArgument('$range', '/bali/elements/Number', last);
            parameters = validateOptionalTypeArgument('$range', '/bali/collections/Catalog', parameters);
            if (first) first = first.toNumber();
            if (last) last = last.toNumber();
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
            validateTypeArgument('$removeAll', '/bali/types/Collection', collection);
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
            index = index.toNumber();
            validateIndex('$removeIndex', list.getSize(), index);
            list.removeItem(index);
            return list;
        },

        $removeItem: function(set, item) {
            validateTypeArgument('$removeItem', '/bali/collections/Set', set);
            validateTypeArgument('$removeItem', '/bali/types/Component', item);
            set.removeItem(item);
            return set;
        },

        $removeItems: function(set, items) {
            validateTypeArgument('$removeItems', '/bali/collections/Set', set);
            validateTypeArgument('$removeItems', '/bali/types/Collection', items);
            set.removeItems(items);
            return set;
        },

        $removeRange: function(list, range) {
            validateTypeArgument('$removeRange', '/bali/collections/List', list);
            validateTypeArgument('$removeRange', '/bali/elements/Range', range);
            list.removeItems(range);
            return list;
        },

        $removeTop: function(stack) {
            validateTypeArgument('$removeTop', '/bali/collections/Stack', stack);
            return stack.removeItem();
        },

        $removeValue: function(catalog, key) {
            validateTypeArgument('$removeValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeValue', '/bali/types/Element', key);
            catalog.removeValue(key);
            return catalog;
        },

        $removeValues: function(catalog, keys) {
            validateTypeArgument('$removeValues', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeValues', '/bali/collections/List', keys);
            catalog.removeValues(keys);
            return catalog;
        },

        $reverseItems: function(sortable) {
            validateInterfaceArgument('$reverseItems', '/bali/interfaces/Sortable', sortable);
            sortable.reverseItems();
            return sortable;
        },

        $sans: function(first, second) {
            validateInterfaceArgument('$sans', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$sans', '/bali/interfaces/Logical', second);
            validateSameType('$sans', first, second);
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

        $second: function(moment) {
            validateTypeArgument('$second', '/bali/elements/Moment', moment);
            return bali.number(moment.getSecond(moment));
        },

        $seconds: function(duration) {
            validateTypeArgument('$seconds', '/bali/elements/Duration', duration);
            return bali.number(duration.getSeconds(duration));
        },

        $set: function(items, parameters) {
            items = validateOptionalTypeArgument('$set', '/bali/types/Collection', items);
            parameters = validateOptionalTypeArgument('$set', '/bali/collections/Catalog', parameters);
            return bali.set(items, parameters);
        },

        $setItem: function(list, index, item) {
            validateTypeArgument('$setItem', '/bali/collections/List', list);
            validateTypeArgument('$setItem', '/bali/elements/Number', index);
            validateTypeArgument('$setItem', '/bali/types/Component', item);
            index = index.toNumber();
            validateIndex('$setItem', list.getSize(), index);
            list.setItem(index, item);
            return list;
        },

        $setParameter: function(component, key, value) {
            validateTypeArgument('$setParameter', '/bali/types/Component', component);
            validateTypeArgument('$setParameter', '/bali/types/Element', key);
            validateTypeArgument('$setParameter', '/bali/types/Component', value);
            return component.setParameter(key, value);
        },

        $setSubcomponent: function(composite, element, subcomponent) {
            validateInterfaceArgument('$setSubcomponent', '/bali/interfaces/Composite', composite);
            validateTypeArgument('$setSubcomponent', '/bali/types/Element', element);
            validateTypeArgument('$setSubcomponent', '/bali/types/Component', subcomponent);
            composite.setSubcomponent(element, subcomponent);
            return composite;
        },

        $setValue: function(catalog, key, value) {
            validateTypeArgument('$setValue', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$setValue', '/bali/types/Element', key);
            validateTypeArgument('$setValue', '/bali/types/Component', value);
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
            items = validateOptionalTypeArgument('$stack', '/bali/types/Collection', items);
            parameters = validateOptionalTypeArgument('$stack', '/bali/collections/Catalog', parameters);
            return bali.stack(items, parameters);
        },

        $statements: function(procedure) {
            validateTypeArgument('$statements', '/bali/composites/Procedure', procedure);
            return procedure.getStatements();
        },

        $subcomponent: function(composite, element) {
            validateInterfaceArgument('$subcomponent', '/bali/interfaces/Composite', composite);
            validateTypeArgument('$subcomponent', '/bali/types/Element', element);
            return composite.getSubcomponent(element);
        },

        $sum: function(first, second) {
            validateInterfaceArgument('$sum', '/bali/interfaces/Scalable', first);
            validateInterfaceArgument('$sum', '/bali/interfaces/Scalable', second);
            validateSameType('$sum', first, second);
            return first.constructor.sum(first, second);
        },

        $supplement: function(angle) {
            validateTypeArgument('$supplement', '/bali/elements/Angle', angle);
            return bali.angle.supplement(angle);
        },

        $supportsInterface: function(component, iface) {
            validateTypeArgument('$supportsInterface', '/bali/types/Component', component);
            validateTypeArgument('$supportsInterface', '/bali/elements/Name', iface);
            return component.supportsInterface(iface);
        },

        $tag: function(size) {
            size = validateOptionalTypeArgument('$tag', '/bali/elements/Number', size);
            size = size.toNumber();
            validateIndex('$tag', 1024, size);
            return bali.tag(size);
        },

        $tangent: function(angle) {
            validateTypeArgument('$tangent', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.tangent(angle));
        },

        $toEnd: function(iterator) {
            validateTypeArgument('$toEnd', '/bali/types/Iterator', iterator);
            iterator.toEnd();
            return iterator;
        },

        $top: function(stack) {
            validateTypeArgument('$top', '/bali/collections/Stack', stack);
            return stack.topItem();
        },

        $toSlot: function(iterator, slot) {
            validateTypeArgument('$toSlot', '/bali/types/Iterator', iterator);
            validateTypeArgument('$toSlot', '/bali/elements/Number', slot);
            iterator.toSlot(slot);
            return iterator;
        },

        $toStart: function(iterator) {
            validateTypeArgument('$toStart', '/bali/types/Iterator', iterator);
            iterator.toStart();
            return iterator;
        },

        $tree: function(type, children) {
            validateTypeArgument('$tree', '/bali/elements/Name', type);
            children = validateOptionalTypeArgument('$tree', '/bali/types/Collection', children);
            return bali.tree(type.toString(), children);
        },

        $type: function(component) {
            validateTypeArgument('$type', '/bali/types/Component', component);
            return bali.component(component.getType());
        },

        $value: function(association) {
            validateTypeArgument('$value', '/bali/composites/Association', association);
            return association.getValue();
        },

        $values: function(catalog, keys) {
            validateTypeArgument('$values', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$values', '/bali/collections/List', keys);
            return catalog.getValues(keys);
        },

        $weeks: function(duration) {
            validateTypeArgument('$weeks', '/bali/elements/Duration', duration);
            return bali.number(duration.getWeeks(duration));
        },

        $xor: function(first, second) {
            validateInterfaceArgument('$xor', '/bali/interfaces/Logical', first);
            validateInterfaceArgument('$xor', '/bali/interfaces/Logical', second);
            validateSameType('$xor', first, second);
            return first.constructor.xor(first, second);
        },

        $year: function(moment) {
            validateTypeArgument('$year', '/bali/elements/Moment', moment);
            return bali.number(moment.getYear(moment));
        },

        $years: function(duration) {
            validateTypeArgument('$years', '/bali/elements/Duration', duration);
            return bali.number(duration.getYears(duration));
        }

    };

    /*
     * A list of the names of the intrinsic functions supported by the virtual machine.
     */
    const names = Object.keys(intrinsics);  // javascript now preserves the chronological order of keys

    /*
     * A list of the implementations of the intrinsic functions supported by the virtual machine.
     */
    const functions = [];
    names.forEach((name) => {
        functions.push(intrinsics[name]);
    });

    // return the actual API
    return {
        name: name,
        index: index,
        invoke: invoke
    };

};
