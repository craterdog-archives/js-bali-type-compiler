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
 * This library encapsulates the intrinsic functions supported by the Bali
 * Virtual Machine™.
 */
const bali = require('bali-component-framework');


// PUBLIC INTRINSIC FUNCTIONS

// Note: for better performance this is implemented as an array rather than an object with
//       function name keys. We don't want to have to look up the functions at runtime.
exports.functions = [
    // <invalid>
    function() {
        throw new Error('PROCESSOR: No intrinsic function should have an index of zero.');
    },

    // $addChild
    function(tree, child) {
        validateParameterType('$addChild', bali.types.TREE, tree);
        tree.addChild(child);
        return tree;
    },

    // $addItem
    function(collection, item) {
        validateParameterAbstraction('$addItem', bali.Collection, collection);
        collection.addItem(item);
        return collection;
    },

    // $addItems
    function(collection, items) {
        validateParameterAbstraction('$addItems', bali.Collection, collection);
        collection.addItems(items);
        return collection;
    },

    // $and
    function(first, second) {
        validateParameterAspect('$and', '$Logical', first);
        validateParameterAspect('$and', '$Logical', second);
        return first.constructor.and(first, second);
    },

    // $angle
    function(value, parameters) {
        return constructElement('$angle', value, parameters);
    },

    // $arccosine
    function(ratio) {
        validateParameterType('$arccosine', bali.types.NUMBER, ratio);
        var angle = bali.angle.arccosine(ratio.toNumber());
        return angle;
    },

    // $arcsine
    function(ratio) {
        validateParameterType('$arcsine', bali.types.NUMBER, ratio);
        var angle = bali.angle.arcsine(ratio.toNumber());
        return angle;
    },

    // $arctangent
    function(opposite, adjacent) {
        validateParameterType('$arctangent', bali.types.NUMBER, opposite);
        validateParameterType('$arctangent', bali.types.NUMBER, adjacent);
        var angle = bali.angle.arctangent(opposite.toNumber(), adjacent.toNumber());
        return angle;
    },

    // $association
    function(key, value) {
        validateParameterAbstraction('$association', bali.Element, key);
        var association = bali.association(key, value);
        return association;
    },

    // $binary
    function(value, parameters) {
        return constructElement('$binary', value, parameters);
    },

    // $catalog
    function(parameters) {
        return constructCollection('$catalog', parameters);
    },

    // $coinToss
    function(weighting) {
        validateParameterType('$coinToss', bali.types.PROBABILITY, weighting);
        return bali.probability.coinToss(weighting.toNumber());
    },

    // $comparison
    function(first, second) {
        return bali.number(first.comparedTo(second));
    },

    // $complement
    function(angle) {
        validateParameterType('$complement', bali.types.ANGLE, angle);
        return bali.angle.complement(angle);
    },

    // $concatenation
    function(first, second) {
        validateParameterAspect('$concatenation', '$Chainable', first);
        validateParameterAspect('$concatenation', '$Chainable', second);
        return first.constructor.concatenation(first, second);
    },

    // $conjugate
    function(number) {
        validateParameterType('$conjugate', bali.types.NUMBER, number);
        return bali.number.conjugate(number);
    },

    // $containsAll
    function(collection, items) {
        validateParameterAbstraction('$containsAll', bali.Collection, collection);
        validateParameterAspect('$containsAll', '$Sequential', items);
        const result = bali.probability(collection.containsAll(items));
        return result;
    },

    // $containsAny
    function(collection, items) {
        validateParameterAbstraction('$containsAny', bali.Collection, collection);
        validateParameterAspect('$containsAny', '$Sequential', items);
        const result = bali.probability(collection.containsAny(items));
        return result;
    },

    // $containsItem
    function(collection, item) {
        validateParameterAbstraction('$containsItem', bali.Collection, collection);
        const result = bali.probability(collection.containsItem(item));
        return result;
    },

    // $cosine
    function(angle) {
        validateParameterType('$cosine', bali.types.ANGLE, angle);
        return bali.number(bali.angle.cosine(angle));
    },

    // $default
    function(proposedValue, defaultValue) {
        return proposedValue.isEqualTo(bali.NONE) ? defaultValue : proposedValue;
    },

    // $difference
    function(first, second) {
        validateParameterAspect('$difference', '$Scalable', first);
        validateParameterAspect('$difference', '$Scalable', second);
        return first.constructor.difference(first, second);
    },

    // $duration
    function(value, parameters) {
        return constructElement('$duration', value, parameters);
    },

    // $earlier
    function(moment, duration) {
        validateParameterType('$earlier', bali.types.MOMENT, moment);
        validateParameterType('$earlier', bali.types.DURATION, duration);
        return bali.moment.earlier(moment, duration);
    },

    // $exponential
    function(number) {
        validateParameterType('$exponential', bali.types.NUMBER, number);
        return bali.number.exponential(number);
    },

    // $extraction
    function(catalog, keys) {
        validateParameterType('$extraction', bali.types.CATALOG, catalog);
        validateParameterType('$extraction', bali.types.LIST, keys);
        return bali.catalog.extraction(catalog, keys);
    },

    // $factorial
    function(number) {
        validateParameterType('$factorial', bali.types.NUMBER, number);
        return bali.number.factorial(number);
    },

    // $getAssociations
    function(catalog) {
        validateParameterType('$getAssociations', bali.types.CATALOG, catalog);
        return catalog.getAssociations();
    },

    // $getChild
    function(tree, index) {
        validateParameterType('$getChild', bali.types.TREE, tree);
        validateParameterType('$getChild', bali.types.NUMBER, index);
        validateIndex('$getChild', tree.getSize(), index);
        return tree.getChild(index.toNumber());
    },

    // $getHash
    function(component) {
        return bali.number(component.getHash());
    },

    // $getHead
    function(queue) {
        validateParameterType('$getHead', bali.types.QUEUE, queue);
        return queue.getHead();
    },

    // $getImaginary
    function(number) {
        validateParameterType('$getImaginary', bali.types.NUMBER, number);
        return bali.number(number.getImaginary());
    },

    // $getIndex
    function(collection, item) {
        validateParameterAbstraction('$getIndex', bali.Collection, collection);
        return bali.number(collection.getIndex(item));
    },

    // $getItem
    function(collection, index) {
        validateParameterAbstraction('$getItem', bali.Collection, collection);
        validateParameterType('$getItem', bali.types.NUMBER, index);
        validateIndex('$getItem', collection.getSize(), index);
        return collection.getItem(index.getNumber());
    },

    // $getItems
    function(collection, first, last) {
        validateParameterAbstraction('$getItems', bali.Collection, collection);
        validateParameterType('$getItems', bali.types.NUMBER, first);
        validateParameterType('$getItems', bali.types.NUMBER, last);
        validateIndex('$getItems', collection.getSize(), first);
        validateIndex('$getItems', collection.getSize(), last);
        return collection.getItems(first, last);
    },

    // $getKey
    function(parameters, index) {
        validateParameterType('$getKey', bali.types.PARAMETERS, parameters);
        validateParameterType('$getKey', bali.types.NUMBER, index);
        validateIndex('$getKey', parameters.getSize(), index);
        return parameters.getKey(index.getNumber());
    },

    // $getKeys
    function(catalog) {
        validateParameterType('$getKeys', bali.types.CATALOG, catalog);
        return catalog.getKeys();
    },

    // $getMagnitude
    function(number) {
        validateParameterType('$getMagnitude', bali.types.NUMBER, number);
        return bali.number(number.getMagnitude());
    },

    // $getPhase
    function(number) {
        validateParameterType('$getPhase', bali.types.NUMBER, number);
        return number.getPhase();
    },

    // $getReal
    function(number) {
        validateParameterType('$getReal', bali.types.NUMBER, number);
        return bali.number(number.getReal());
    },

    // $getSize
    function(sequence) {
        validateParameterAspect('$getSize', '$Sequential', sequence);
        return bali.number(sequence.getSize());
    },

    // $getSubcomponent
    function(parent, index) {
        var subcomponent;
        validateParent('$getSubcomponent', parent, index);
        if (parent.getType() === bali.types.CATATLOG) {
            subcomponent = parent.getValue(index);
        } else {
            subcomponent = parent.getItem(index);
        }
        return subcomponent || bali.NONE;
    },

    // $getTop
    function(stack) {
        validateParameterType('$getTop', bali.types.STACK, stack);
        return stack.getTop();
    },

    // $getType
    function(component) {
        return bali.parse(component.getType());
    },

    // $getValue
    function(catalog, key) {
        validateParameterType('$getValue', bali.types.CATALOG, catalog);
        validateParameterAbstraction('$getValue', bali.Element, key);
        return catalog.getValue(key) || bali.NONE;
    },

    // $getValues
    function(catalog, keys) {
        validateParameterType('$getValues', bali.types.CATALOG, catalog);
        validateParameterType('$getValues', bali.types.LIST, keys);
        return catalog.getValues(keys);
    },

    // $insertItem
    function(list, index, item) {
        validateParameterType('$insertItem', bali.types.LIST, list);
        validateParameterType('$insertItem', bali.types.NUMBER, index);
        validateIndex('$insertItem', list.getSize(), index);
        list.insertItem(index.getNumber(), item);
        return list;
    },

    // $insertItems
    function(list, index, items) {
        validateParameterType('$insertItems', bali.types.LIST, list);
        validateParameterType('$insertItems', bali.types.NUMBER, index);
        validateParameterAbstraction('$insertItems', bali.Collection, items);
        validateIndex('$insertItems', list.getSize(), index);
        list.insertItems(index.getNumber(), items);
        return list;
    },

    // $inverse
    function(scalable) {
        validateParameterAspect('$inverse', '$Scalable', scalable);
        return scalable.constructor.inverse(scalable);
    },

    // $isEmpty
    function(sequence) {
        validateParameterAspect('$isEmpty', '$Sequential', sequence);
        return bali.probability(sequence.isEmpty());
    },

    // $isEqualTo
    function(firstComponent, secondComponent) {
        return bali.probability(firstComponent.isEqualTo(secondComponent));
    },

    // $isInRange
    function(range, item) {
        validateParameterType('$isInRange', bali.types.RANGE, range);
        return bali.probability(range.isInRange(item));
    },

    // $isInfinite
    function(number) {
        validateParameterType('$isInfinite', bali.types.NUMBER, number);
        return bali.probability(number.isInfinite());
    },

    // $isLessThan
    function(firstComponent, secondComponent) {
        return bali.probability(firstComponent.comparedTo(secondComponent) < 0);
    },

    // $isMoreThan
    function(firstComponent, secondComponent) {
        return bali.probability(firstComponent.comparedTo(secondComponent) > 0);
    },

    // $isParameterized
    function(component) {
        return bali.probability(component.isParameterized());
    },

    // $isSameAs
    function(firstComponent, secondComponent) {
        return bali.probability(firstComponent === secondComponent);
    },

    // $isUndefined
    function(number) {
        validateParameterType('$isUndefined', bali.types.NUMBER, number);
        return bali.probability(number.isUndefined());
    },

    // $isZero
    function(number) {
        validateParameterType('$isZero', bali.types.NUMBER, number);
        return bali.probability(number.isZero());
    },

    // $later
    function(moment, duration) {
        validateParameterType('$later', bali.types.MOMENT, moment);
        validateParameterType('$later', bali.types.DURATION, duration);
        return bali.moment.later(moment, duration);
    },

    // $list
    function(parameters) {
        return constructCollection('$list', parameters);
    },

    // $logarithm
    function(number) {
        validateParameterType('$logarithm', bali.types.NUMBER, number);
        return bali.number.logarithm(number);
    },

    // $matches
    function(component, pattern) {
        return bali.probability(component.matches(pattern));
    },

    // $moment
    function(value, parameters) {
        return constructElement('$moment', value, parameters);
    },

    // $nextVersion
    function(version, level) {
        validateParameterType('$nextVersion', bali.types.VERSION, version);
        validateParameterType('$nextVersion', bali.types.NUMBER, level);
        validateIndex('$nextVersion', version.getSize() + 1, level);  // allow for the next subversion
        return bali.version.nextVersion(version, level);
    },

    // $not
    function(logical) {
        validateParameterAspect('$not', '$Logical', logical);
        return logical.constructor.not(logical);
    },

    // $number
    function(value, parameters) {
        return constructElement('$number', value, parameters);
    },

    // $or
    function(first, second) {
        validateParameterAspect('$or', '$Logical', first);
        validateParameterAspect('$or', '$Logical', second);
        return first.constructor.or(first, second);
    },

    // $parameters
    function(collection) {
        validateParameterAbstraction('$parameters', bali.Collection, collection);
        return bali.parameters(collection);
    },

    // $pattern
    function(value, parameters) {
        return constructElement('$pattern', value, parameters);
    },

    // $percent
    function(value, parameters) {
        return constructElement('$percent', value, parameters);
    },

    // $period
    function(first, second) {
        validateParameterType('$period', bali.types.MOMENT, first);
        validateParameterType('$period', bali.types.MOMENT, second);
        return bali.moment.period(first, second);
    },

    // $probability
    function(value, parameters) {
        return constructElement('$probability', value, parameters);
    },

    // $product
    function(first, second) {
        validateParameterAspect('$product', '$Numerical', first);
        validateParameterAspect('$product', '$Numerical', second);
        return first.constructor.product(first, second);
    },

    // $queue
    function(parameters) {
        return constructCollection('$queue', parameters);
    },

    // $quotient
    function(first, second) {
        validateParameterAspect('$quotient', '$Numerical', first);
        validateParameterAspect('$quotient', '$Numerical', second);
        return first.constructor.quotient(first, second);
    },

    // $randomBytes
    function(numberOfBytes) {
        return bali.binary.random(numberOfBytes);
    },

    // $randomIndex
    function(length) {
        validateParameterType('$randomIndex', bali.types.NUMBER, length);
        return bali.number(bali.random.index(length));
    },

    // $randomInteger
    function() {
        return bali.number(bali.random.integer());
    },

    // $randomProbability
    function() {
        return bali.probability.random();
    },

    // $range
    function(first, last, parameters) {
        return constructRange(first, last, parameters);
    },

    // $reciprocal
    function(number) {
        validateParameterType('$reciprocal', bali.types.NUMBER, number);
        return bali.number.reciprocal(number);
    },

    // $reference
    function(value, parameters) {
        return constructElement('$reference', value, parameters);
    },

    // $remainder
    function(first, second) {
        validateParameterAspect('$remainder', '$Numerical', first);
        validateParameterAspect('$remainder', '$Numerical', second);
        return first.constructor.remainder(first, second);
    },

    // $removeAll
    function(collection) {
        validateParameterAbstraction('$removeAll', bali.Collection, collection);
        collection.removeAll();
        return collection;
    },

    // $removeHead
    function(queue) {
        validateParameterType('$removeHead', bali.types.QUEUE, queue);
        return queue.removeItem();
    },

    // $removeIndex
    function(list, index) {
        validateParameterType('$removeIndex', bali.types.LIST, list);
        validateParameterType('$removeIndex', bali.types.NUMBER, index);
        validateIndex('$removeIndex', list.getSize(), index);
        return list.removeItem(index);
    },

    // $removeItem
    function(set, item) {
        validateParameterType('$removeItem', bali.types.SET, set);
        return bali.probability(set.removeItem(item));
    },

    // $removeItems
    function(set, items) {
        validateParameterType('$removeItems', bali.types.SET, set);
        validateParameterAbstraction('$removeItems', bali.Collection, items);
        return bali.number(set.removeItems(items));
    },

    // $removeRange
    function(list, range) {
        validateParameterType('$removeIndex', bali.types.LIST, list);
        validateParameterType('$removeIndex', bali.types.RANGE, range);
        return list.removeItems(range);
    },

    // $removeTop
    function(stack) {
        validateParameterType('$removeTop', bali.types.STACK, stack);
        return stack.removeItem();
    },

    // $removeValue
    function(catalog, key) {
        validateParameterType('$removeValue', bali.types.CATALOG, catalog);
        validateParameterAbstraction('$removeValue', bali.Element, key);
        return catalog.removeValue(key);
    },

    // $removeValues
    function(catalog, keys) {
        validateParameterType('$removeValues', bali.types.CATALOG, catalog);
        validateParameterType('$removeValues', bali.types.LIST, keys);
        return catalog.removeValues(keys);
    },

    // $reverseAssociations
    function(catalog) {
        validateParameterType('$reverseAssociations', bali.types.CATALOG, catalog);
        catalog.reverseItems();
        return catalog;
    },

    // $reverseItems
    function(list) {
        validateParameterType('$reverseItems', bali.types.LIST, list);
        list.reverseItems();
        return list;
    },

    // $sans
    function(first, second) {
        validateParameterAspect('$sans', '$Logical', first);
        validateParameterAspect('$sans', '$Logical', second);
        return first.constructor.sans(first, second);
    },

    // $scaled
    function(scalable, factor) {
        validateParameterAspect('$scaled', '$Scalable', scalable);
        validateParameterAspect('$factor', '$Numerical', factor);
        return scalable.constructor.scaled(scalable, factor);
    },

    // $set
    function(parameters) {
        return constructCollection('$set', parameters);
    },

    // $setIndex
    function(list, index, item) {
        validateParameterType('$setIndex', bali.types.LIST, list);
        validateParameterType('$setIndex', bali.types.NUMBER, index);
        validateIndex('$setIndex', list.getSize(), index);
        list.setItem(index, item);
        return list;
    },

    // $setParameters
    function(element, parameters) {
        validateParameterAbstraction('$setParameters', bali.Element, element);
        element.setParameters(parameters);
        return element;
    },

    // $setSubcomponent
    function(parent, index, item) {
        validateParent('$getSubcomponent', parent, index);
        if (parent.getType() === bali.types.CATATLOG) {
            parent.setValue(index, item);
        } else {
            parent.setItem(index, item);
        }
        return parent;
    },

    // $setValue
    function(catalog, key, value) {
        validateParameterType('$setValue', bali.types.CATALOG, catalog);
        validateParameterAbstraction('$setValue', bali.Element, key);
        catalog.setValue(key, value);
        return catalog;
    },

    // $setValues
    function(catalog, values) {
        validateParameterType('$setValues', bali.types.CATALOG, catalog);
        validateParameterType('$setValues', bali.types.CATALOG, values);
        catalog.setValues(values);
        return catalog;
    },

    // $shuffleItems
    function(list) {
        validateParameterType('$shuffleItems', bali.types.LIST, list);
        list.shuffleItems();
        return list;
    },

    // $sine
    function(angle) {
        validateParameterType('$sine', bali.types.ANGLE, angle);
        return bali.number(bali.angle.sine(angle));
    },

    // $sortAssociations
    function(catalog) {
        validateParameterType('$sortAssociations', bali.types.CATALOG, catalog);
        catalog.sortItems();
        return catalog;
    },

    // $sortItems
    function(list) {
        validateParameterType('$sortItems', bali.types.LIST, list);
        list.sortItems();
        return list;
    },

    // $source
    function(procedure, parameters) {
        return constructSource(procedure, parameters);
    },

    // $stack
    function(parameters) {
        return constructCollection('$stack', parameters);
    },

    // $sum
    function(first, second) {
        validateParameterAspect('$sum', '$Scalable', first);
        validateParameterAspect('$sum', '$Scalable', second);
        return first.constructor.sum(first, second);
    },

    // $supplement
    function(angle) {
        validateParameterType('$supplement', bali.types.ANGLE, angle);
        return bali.angle.supplement(angle);
    },

    // $symbol
    function(value, parameters) {
        return constructElement('$symbol', value, parameters);
    },

    // $tag
    function(value, parameters) {
        return constructElement('$tag', value, parameters);
    },

    // $tangent
    function(angle) {
        validateParameterType('$tangent', bali.types.ANGLE, angle);
        return bali.number(bali.angle.tangent(angle));
    },

    // $text
    function(value, parameters) {
        return constructElement('$text', value, parameters);
    },

    // $toBase2
    function(binary, indentation) {
        validateParameterType('$toBase2', bali.types.BINARY, binary);
        validateParameterType('$toBase2', bali.types.TEXT, indentation);
        return bali.text(binary.toBase2(indentation.toString()));
    },

    // $toBase16
    function(binary, indentation) {
        validateParameterType('$toBase16', bali.types.BINARY, binary);
        validateParameterType('$toBase16', bali.types.TEXT, indentation);
        return bali.text(binary.toBase16(indentation.toString()));
    },

    // $toBase32
    function(binary, indentation) {
        validateParameterType('$toBase32', bali.types.BINARY, binary);
        validateParameterType('$toBase32', bali.types.TEXT, indentation);
        return bali.text(binary.toBase32(indentation.toString()));
    },

    // $toBase64
    function(binary, indentation) {
        validateParameterType('$toBase64', bali.types.BINARY, binary);
        validateParameterType('$toBase64', bali.types.TEXT, indentation);
        return bali.text(binary.toBase64(indentation.toString()));
    },

    // $toBoolean
    function(component) {
        return bali.probability(component.toBoolean());
    },

    // $toDocument
    function(component, indentation) {
        validateParameterType('$toDocument', bali.types.TEXT, indentation);
        return bali.text(component.toDocument(indentation.toString()));
    },

    // $toPolar
    function(number) {
        validateParameterType('$toPolar', bali.types.NUMBER, number);
        return bali.text(number.toPolar());
    },

    // $toRectangular
    function(number) {
        validateParameterType('$toRectangular', bali.types.NUMBER, number);
        return bali.text(number.toRectangular());
    },

    // $tree
    function(type, complexity) {
        return constructTree(type, complexity);
    },

    // $validNextVersion
    function(current, next) {
        validateParameterType('$validNextVersion', bali.types.VERSION, current);
        validateParameterType('$validNextVersion', bali.types.VERSION, next);
        return bali.probability(bali.version.validNextVersion(current, next));
    },

    // $version
    function(value, parameters) {
        return constructElement('$version', value, parameters);
    },

    // $xor
    function(first, second) {
        validateParameterAspect('$xor', '$Logical', first);
        validateParameterAspect('$xor', '$Logical', second);
        return first.constructor.xor(first, second);
    }

];


// PUBLIC FUNCTION NAMES

exports.names = [
    '<invalid>',
    '$addChild',
    '$addItem',
    '$addItems',
    '$and',
    '$angle',
    '$arccosine',
    '$arcsine',
    '$arctangent',
    '$association',
    '$binary',
    '$catalog',
    '$coinToss',
    '$comparison',
    '$complement',
    '$concatenation',
    '$conjugate',
    '$containsAll',
    '$containsAny',
    '$containsItem',
    '$cosine',
    '$default',
    '$difference',
    '$duration',
    '$earlier',
    '$exponential',
    '$extraction',
    '$factorial',
    '$getAssociations',
    '$getChild',
    '$getHash',
    '$getHead',
    '$getImaginary',
    '$getIndex',
    '$getItem',
    '$getItems',
    '$getKey',
    '$getKeys',
    '$getMagnitude',
    '$getPhase',
    '$getReal',
    '$getSize',
    '$getSubcomponent',
    '$getTop',
    '$getType',
    '$getValue',
    '$getValues',
    '$insertItem',
    '$insertItems',
    '$inverse',
    '$isEmpty',
    '$isEqualTo',
    '$isInRange',
    '$isInfinite',
    '$isLessThan',
    '$isMoreThan',
    '$isParameterized',
    '$isSameAs',
    '$isUndefined',
    '$isZero',
    '$later',
    '$list',
    '$logarithm',
    '$matches',
    '$moment',
    '$nextVersion',
    '$not',
    '$number',
    '$or',
    '$parameters',
    '$pattern',
    '$percent',
    '$period',
    '$probability',
    '$product',
    '$queue',
    '$quotient',
    '$randomBytes',
    '$randomIndex',
    '$randomInteger',
    '$randomProbability',
    '$range',
    '$reciprocal',
    '$reference',
    '$remainder',
    '$removeAll',
    '$removeHead',
    '$removeIndex',
    '$removeItem',
    '$removeItems',
    '$removeRange',
    '$removeTop',
    '$removeValue',
    '$removeValues',
    '$reverseAssociations',
    '$reverseItems',
    '$sans',
    '$scaled',
    '$set',
    '$setIndex',
    '$setParameters',
    '$setSubcomponent',
    '$setValue',
    '$setValues',
    '$shuffleItems',
    '$sine',
    '$sortAssociations',
    '$sortItems',
    '$source',
    '$stack',
    '$sum',
    '$supplement',
    '$symbol',
    '$tag',
    '$tangent',
    '$text',
    '$toBase2',
    '$toBase16',
    '$toBase32',
    '$toBase64',
    '$toBoolean',
    '$toDocument',
    '$toPolar',
    '$toRectangular',
    '$tree',
    '$validNextVersion',
    '$version',
    '$xor'
];

exports.invokeByName = function(name, parameters) {
    var index = exports.names.indexOf(name);
    var result = exports.functions[index].apply(parameters);
    return result;
};


// PRIVATE FUNCTIONS


function constructElement(procedure, value, parameters) {
    var exception;
    if (value.getType() !== bali.types.TEXT) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Text',
            $actual: bali.types.typeName(value.getType())
        });
    }
    if (parameters.getType() !== bali.types.PARAMETERS && parameters !== bali.NONE) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.getType())
        });
    }
    var constructor = bali[procedure.slice(1)];  // $procedure -> procedure
    var element = new constructor(value, parameters);
    return element;
}


function constructSource(procedure, parameters) {
    var exception;
    if (procedure.getType() !== bali.types.TREE) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$source',
            $expected: '$Tree',
            $actual: bali.types.typeName(procedure.getType())
        });
    }
    if (parameters.getType() !== bali.types.PARAMETERS && parameters !== bali.NONE) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$source',
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.getType())
        });
    }
    var source = bali.source(procedure, parameters);
    return source;
}


function constructRange(first, last, parameters) {
    var exception;
    if (!(first instanceof bali.Element)) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: '$Element',
            $actual: bali.types.typeName(first.getType())
        });
    }
    if (first.getType() !== last.getType()) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: bali.types.typeName(first.getType()),
            $actual: bali.types.typeName(last.getType())
        });
    }
    if (parameters.getType() !== bali.types.PARAMETERS && parameters !== bali.NONE) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.getType())
        });
    }
    var range = bali.range(first, last, parameters);
    return range;
}


function constructTree(symbol, complexity) {
    var exception;
    if (symbol.getType() !== bali.types.SYMBOL) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$tree',
            $expected: '$Symbol',
            $actual: bali.types.typeName(symbol.getType())
        });
    }
    if (complexity.getType() !== bali.types.NUMBER) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: '$tree',
            $expected: '$Number',
            $actual: bali.types.typeName(complexity.getType())
        });
    }
    var tree = bali.tree(bali.types.typeBySymbol(symbol), complexity.toNumber());
    return tree;
}


function constructCollection(procedure, parameters) {
    if (parameters && parameters.getType() !== bali.types.PARAMETERS && !parameters.isEqualTo(bali.NONE)) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.getType())
        });
    }
    var constructor = bali[procedure.slice(1)];  // $procedure -> procedure
    var collection = new constructor(parameters);
    return collection;
}


function validateParameterType(procedure, type, parameter) {
    if (parameter.getType() !== type) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: bali.types.typeName(type),
            $actual: bali.types.typeName(parameter.getType())
        });
    }
}


function validateParameterAbstraction(procedure, abstraction, parameter) {
    if (!(parameter instanceof abstraction)) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$' + abstraction.name,
            $actual: bali.types.typeName(parameter.getType())
        });
    }
}


function validateParameterAspect(procedure, aspect, parameter) {
    var type = parameter.getType();
    if (!bali.types['is' + aspect.slice(1)](type)) {
        throw bali.exception({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: aspect,
            $actual: bali.types.typeName(type)
        });
    }
}


function validateParent(procedure, parent, index) {
    switch (parent.getType()) {
        case bali.types.LIST:
            validateIndex(procedure, parent.getSize(), index);
            break;
        case bali.types.CATALOG:
            validateParameterAbstraction(procedure, bali.Element, index);
            break;
        default:
            throw bali.exception({
                $exception: '$parameterType',
                $procedure: procedure,
                $expected: '$Parent',
                $actual: bali.types.typeName(parent.getType())
            });
    }
}


function validateIndex(procedure, size, index) {
    index = Math.abs(index);
    if (index === 0 || index > size) {
        throw bali.exception({
            $exception: '$parameterValue',
            $procedure: procedure,
            $expected: bali.range(1, size),
            $actual: index
        });
    }
}
