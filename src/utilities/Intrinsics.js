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
        validateParameterAspects('$and', '$Logical', first, second);
        return first.constructor.and(first, second);
    },

    // $angle
    function(value, parameters) {
        return constructElement('$angle', value, parameters);
    },

    // $arccosine
    function(ratio) {
        validateParameterType('$arccosine', bali.types.NUMBER, ratio);
        var angle = bali.Angle.arccosine(ratio.toNumber());
        return angle;
    },

    // $arcsine
    function(ratio) {
        validateParameterType('$arcsine', bali.types.NUMBER, ratio);
        var angle = bali.Angle.arcsine(ratio.toNumber());
        return angle;
    },

    // $arctangent
    function(opposite, adjacent) {
        validateParameterType('$arctangent', bali.types.NUMBER, opposite);
        validateParameterType('$arctangent', bali.types.NUMBER, adjacent);
        var angle = bali.Angle.arctangent(opposite.toNumber(), adjacent.toNumber());
        return angle;
    },

    // $association
    function(key, value) {
        validateParameterAbstraction('$association', bali.Element, key);
        var association = new bali.Association(key, value);
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
        validateParameterType('$coinToss', bali.types.NUMBER, weighting);
        return bali.Probability.coinToss(weighting.toNumber());
    },

    // $comparison
    function(first, second) {
        return first.comparedTo(second);
    },

    // $complement
    function(angle) {
        validateParameterType('$complement', bali.types.ANGLE, angle);
        return bali.Angle.complement(angle);
    },

    // $concatenation
    function(first, second) {
        validateParameterAspects('$concatenation', '$Combinable', first, second);
        return first.constructor.concatenation(first, second);
    },

    // $conjugate
    function(number) {
        validateParameterType('$conjugate', bali.types.NUMBER, number);
        return bali.Number.conjugate(number);
    },

    // $containsAll
    function(collection, items) {
        validateParameterAbstraction('$containsAll', bali.Collection, collection);
        validateParameterAspect('$containsAll', '$Sequential', items);
        collection.containsAll(items);
        return collection;
    },

    // $containsAny
    function(collection, items) {
        validateParameterAbstraction('$containsAny', bali.Collection, collection);
        validateParameterAspect('$containsAny', '$Sequential', items);
        collection.containsAny(items);
        return collection;
    },

    // $containsItem
    function(collection, item) {
        validateParameterAbstraction('$containsItem', bali.Collection, collection);
        collection.containsItem(item);
        return collection;
    },

    // $cosine
    function(angle) {
        validateParameterType('$cosine', bali.types.ANGLE, angle);
        return new bali.Number(bali.Angle.cosine(angle));
    },

    // $default
    function(proposedValue, defaultValue) {
        return bali.Pattern.fromLiteral('none').isEqualTo(proposedValue) ? defaultValue : proposedValue;
    },

    // $difference
    function(first, second) {
        validateParameterAspects('$difference', '$Scalable', first, second);
        return first.constructor.difference(first, second);
    },

    // $duration
    function(value, parameters) {
        return constructElement('$duration', value, parameters);
    },

    // $exponential
    function(number) {
        validateParameterType('$exponential', bali.types.NUMBER, number);
        return bali.Number.exponential(number);
    },

    // $extraction
    function(catalog, keys) {
        validateParameterType('$extraction', bali.types.CATALOG, catalog);
        validateParameterType('$extraction', bali.types.SET, keys);
        return bali.Catalog.extraction(catalog, keys);
    },

    // $factorial
    function(number) {
        validateParameterType('$factorial', bali.types.NUMBER, number);
        return bali.Number.factorial(number);
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
        return new bali.Number(component.getHash());
    },

    // $getHead
    function(queue) {
        validateParameterType('$getHead', bali.types.QUEUE, queue);
        return queue.getHead();
    },

    // $getImaginary
    function(number) {
        validateParameterType('$getImaginary', bali.types.NUMBER, number);
        return new bali.Number(number.getImaginary());
    },

    // $getIndex
    function(collection, item) {
        validateParameterAbstraction('$getIndex', bali.Collection, collection);
        return new bali.Number(collection.getIndex(item));
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
        return new bali.Number(number.getMagnitude());
    },

    // $getPhase
    function(number) {
        validateParameterType('$getPhase', bali.types.NUMBER, number);
        return number.getPhase();
    },

    // $getReal
    function(number) {
        validateParameterType('$getReal', bali.types.NUMBER, number);
        return new bali.Number(number.getReal());
    },

    // $getSize
    function(sequence) {
        validateParameterAspect('$getSize', '$Sequential', sequence);
        return new bali.Number(sequence.getSize());
    },

    // $getSubcomponent
    function(parent, index) {
        var subcomponent;
        validateParent('$getSubcomponent', parent, index);
        if (parent.type === bali.types.CATATLOG) {
            subcomponent = parent.getValue(index);
        } else {
            subcomponent = parent.getItem(index);
        }
        return subcomponent || bali.Pattern.fromLiteral('none');
    },

    // $getTop
    function(stack) {
        validateParameterType('$getTop', bali.types.STACK, stack);
        return stack.getTop();
    },

    // $getType
    function(component) {
        return bali.Reference.fromLiteral(component.getType());
    },

    // $getValue
    function(catalog, key) {
        validateParameterType('$getValue', bali.types.CATALOG, catalog);
        validateParameterAbstraction('$getValue', bali.Element, key);
        return catalog.getValue(key) || bali.Pattern.fromLiteral('none');
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
        return new bali.Probability(sequence.isEmpty());
    },

    // $isEqualTo
    function(firstComponent, secondComponent) {
        return new bali.Probability(firstComponent.isEqualTo(secondComponent));
    },

    // $isInRange
    function(range, item) {
        validateParameterType('$isInRange', bali.types.RANGE, range);
        return new bali.Probability(range.isInRange(item));
    },

    // $isInfinite
    function(number) {
        validateParameterType('$isInfinite', bali.types.NUMBER, number);
        return new bali.Probability(number.isInfinite());
    },

    // $isLessThan
    function(firstComponent, secondComponent) {
        return new bali.Probability(firstComponent.comparedTo(secondComponent) < 0);
    },

    // $isMoreThan
    function(firstComponent, secondComponent) {
        return new bali.Probability(firstComponent.comparedTo(secondComponent) > 0);
    },

    // $isParameterized
    function(component) {
        return new bali.Probability(component.isParameterized());
    },

    // $isSameAs
    function(firstComponent, secondComponent) {
        return new bali.Probability(firstComponent === secondComponent);
    },

    // $isUndefined
    function(number) {
        validateParameterType('$isUndefined', bali.types.NUMBER, number);
        return new bali.Probability(number.isUndefined());
    },

    // $isZero
    function(number) {
        validateParameterType('$isZero', bali.types.NUMBER, number);
        return new bali.Probability(number.isZero());
    },

    // $list
    function(parameters) {
        return constructCollection('$list', parameters);
    },

    // $logarithm
    function(number) {
        validateParameterType('$logarithm', bali.types.NUMBER, number);
        return bali.Number.logarithm(number);
    },

    // $matches
    function(component, pattern) {
        // TDOD: remove next line once bug is fixed in bali.Component
        if (pattern.type === bali.types.TEXT) pattern = pattern.value;
        return new bali.Probability(component.matches(pattern));
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
        return bali.Version.nextVersion(version, level);
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
        validateParameterAspects('$or', '$Logical', first, second);
        return first.constructor.or(first, second);
    },

    // $parameters
    function(collection) {
        validateParameterAbstraction('$parameters', bali.Collection, collection);
        return bali.Parameters.fromSequential(collection);
    },

    // $pattern
    function(value, parameters) {
        return constructElement('$pattern', value, parameters);
    },

    // $percent
    function(value, parameters) {
        return constructElement('$percent', value, parameters);
    },

    // $probability
    function(value, parameters) {
        return constructElement('$probability', value, parameters);
    },

    // $product
    function(first, second) {
        validateParameterAspects('$product', '$Numerical', first, second);
        return first.constructor.product(first, second);
    },

    // $queue
    function(parameters) {
        return constructCollection('$queue', parameters);
    },

    // $quotient
    function(first, second) {
        validateParameterAspects('$quotient', '$Numerical', first, second);
        return first.constructor.quotient(first, second);
    },

    // $randomBytes
    function(numberOfBytes) {
        return bali.Binary.random(numberOfBytes);
    },

    // $randomIndex
    function(length) {
        validateParameterType('$randomIndex', bali.types.NUMBER, length);
        return new bali.Number(bali.random.index(length));
    },

    // $randomInteger
    function() {
        return new bali.Number(bali.random.integer());
    },

    // $randomProbability
    function() {
        return bali.Probability.random();
    },

    // $range
    function(first, last, parameters) {
        return constructRange(first, last, parameters);
    },

    // $reciprocal
    function(number) {
        validateParameterType('$reciprocal', bali.types.NUMBER, number);
        return bali.Number.reciprocal(number);
    },

    // $reference
    function(value, parameters) {
        return constructElement('$reference', value, parameters);
    },

    // $remainder
    function(first, second) {
        validateParameterAspects('$remainder', '$Numerical', first, second);
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
        return new bali.Probability(set.removeItem(item));
    },

    // $removeItems
    function(set, items) {
        validateParameterType('$removeItems', bali.types.SET, set);
        validateParameterAbstraction('$removeItems', bali.Collection, items);
        return new bali.Number(set.removeItems(items));
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
        validateParameterAspects('$sans', '$Logical', first, second);
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
        element.setParameters(parameters);
        return element;
    },

    // $setSubcomponent
    function(parent, index, item) {
        validateParent('$getSubcomponent', parent, index);
        if (parent.type === bali.types.CATATLOG) {
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
    function(catalog, associations) {
        validateParameterType('$setValues', bali.types.CATALOG, catalog);
        validateParameterType('$setValues', bali.types.CATALOG, associations);
        catalog.setValues(associations);
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
        return new bali.Number(bali.Angle.sine(angle));
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
        validateParameterAspects('$sum', '$Scalable', first, second);
        return first.constructor.sum(first, second);
    },

    // $supplement
    function(angle) {
        validateParameterType('$supplement', bali.types.ANGLE, angle);
        return bali.Angle.supplement(angle);
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
        return new bali.Number(bali.Angle.tangent(angle));
    },

    // $text
    function(value, parameters) {
        return constructElement('$text', value, parameters);
    },

    // $toBase2
    function(binary, indentation) {
        validateParameterType('$toBase2', bali.types.BINARY, binary);
        validateParameterType('$toBase2', bali.types.TEXT, indentation);
        return new bali.Text(binary.toBase2(indentation.toString()));
    },

    // $toBase16
    function(binary, indentation) {
        validateParameterType('$toBase16', bali.types.BINARY, binary);
        validateParameterType('$toBase16', bali.types.TEXT, indentation);
        return new bali.Text(binary.toBase16(indentation.toString()));
    },

    // $toBase32
    function(binary, indentation) {
        validateParameterType('$toBase32', bali.types.BINARY, binary);
        validateParameterType('$toBase32', bali.types.TEXT, indentation);
        return new bali.Text(binary.toBase32(indentation.toString()));
    },

    // $toBase64
    function(binary, indentation) {
        validateParameterType('$toBase64', bali.types.BINARY, binary);
        validateParameterType('$toBase64', bali.types.TEXT, indentation);
        return new bali.Text(binary.toBase64(indentation.toString()));
    },

    // $toBoolean
    function(probability) {
        validateParameterType('$toBoolean', bali.types.PROBABILITY, probability);
        return new bali.Probability(probability.toBoolean());
    },

    // $toDocument
    function(component, indentation) {
        validateParameterType('$toDocument', bali.types.TEXT, indentation);
        return new bali.Text(component.toDocument(indentation.toString()));
    },

    // $toPolar
    function(number) {
        validateParameterType('$toPolar', bali.types.NUMBER, number);
        return new bali.Text(number.toPolar());
    },

    // $toRectangular
    function(number) {
        validateParameterType('$toRectangular', bali.types.NUMBER, number);
        return new bali.Text(number.toRectangular());
    },

    // $tree
    function(type, complexity) {
        return constructTree(type, complexity);
    },

    // $validNextVersion
    function(current, next) {
        validateParameterType('$validNextVersion', bali.types.VERSION, current);
        validateParameterType('$validNextVersion', bali.types.VERSION, next);
        return new bali.Probability(bali.Version.validNextVersion(current, next));
    },

    // $version
    function(value, parameters) {
        return constructElement('$version', value, parameters);
    },

    // $xor
    function(first, second) {
        validateParameterAspects('$xor', '$Logical', first, second);
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

// add missing string method
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};


function constructElement(procedure, value, parameters) {
    var exception;
    if (value.type !== bali.types.TEXT) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Text',
            $actual: bali.types.typeName(value.type)
        });
        throw new bali.Exception(exception);
    }
    if (parameters.type !== bali.types.PARAMETERS && parameters !== bali.Pattern.fromLiteral('none')) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.type)
        });
        throw new bali.Exception(exception);
    }
    var constructor = bali[procedure.slice(1).capitalize()];  // $procedure -> Procedure
    var element = new constructor(value, parameters);
    return element;
}


function constructSource(procedure, parameters) {
    var exception;
    if (procedure.type !== bali.types.TREE) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$source',
            $expected: '$Tree',
            $actual: bali.types.typeName(procedure.type)
        });
        throw new bali.Exception(exception);
    }
    if (parameters.type !== bali.types.PARAMETERS && parameters !== bali.Pattern.fromSequential('none')) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$source',
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.type)
        });
        throw new bali.Exception(exception);
    }
    var source = new bali.Source(procedure, parameters);
    return source;
}


function constructRange(first, last, parameters) {
    var exception;
    if (!(first instanceof bali.Element)) {
        const exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: '$Element',
            $actual: bali.types.typeName(first.type)
        });
        throw new bali.Exception(exception);
    }
    if (first.type !== last.type) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: bali.types.typeName(first.type),
            $actual: bali.types.typeName(last.type)
        });
        throw new bali.Exception(exception);
    }
    if (parameters.type !== bali.types.PARAMETERS && parameters !== bali.Pattern.fromLiteral('none')) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$range',
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.type)
        });
        throw new bali.Exception(exception);
    }
    var range = new bali.Range(first, last, parameters);
    return range;
}


function constructTree(symbol, complexity) {
    var exception;
    if (symbol.type !== bali.types.SYMBOL) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$tree',
            $expected: '$Symbol',
            $actual: bali.types.typeName(symbol.type)
        });
        throw new bali.Exception(exception);
    }
    if (complexity.type !== bali.types.NUMBER) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: '$tree',
            $expected: '$Number',
            $actual: bali.types.typeName(complexity.type)
        });
        throw new bali.Exception(exception);
    }
    var tree = new bali.Tree(bali.types.typeBySymbol(symbol), complexity.toNumber());
    return tree;
}


function constructCollection(procedure, parameters) {
    if (parameters && parameters.type !== bali.types.PARAMETERS && !parameters.isEqualTo(bali.Pattern.fromLiteral('none'))) {
        const exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Parameters',
            $actual: bali.types.typeName(parameters.type)
        });
        throw new bali.Exception(exception);
    }
    var constructor = bali[procedure.slice(1).capitalize()];  // $procedure -> Procedure
    var collection = new constructor(parameters);
    return collection;
}


function validateParameterType(procedure, type, parameter) {
    if (parameter.type !== type) {
        const exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: bali.types.typeName(type),
            $actual: bali.types.typeName(parameter.type)
        });
        throw new bali.Exception(exception);
    }
}


function validateParameterAbstraction(procedure, abstraction, parameter) {
    if (!(parameter instanceof abstraction)) {
        const exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$' + abstraction.name,
            $actual: bali.types.typeName(parameter.type)
        });
        throw new bali.Exception(exception);
    }
}


function validateParameterAspect(procedure, aspect, parameter) {
    var type = parameter.type;
    if (!bali.types['is' + aspect.slice(1)](type)) {
        const exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: aspect,
            $actual: bali.types.typeName(type)
        });
        throw new bali.Exception(exception);
    }
}


function validateParameterAspects(procedure, aspect, first, second) {
    var exception;
    var type = first.type;
    if (type !== second.type) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: bali.types.typeName(type),
            $actual: bali.types.typeName(second.type)
        });
        throw new bali.Exception(exception);
    }
    if (!bali.types['is' + aspect.slice(1)](type)) {
        exception = bali.Catalog.fromSequential({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: aspect,
            $actual: bali.types.typeName(type)
        });
        throw new bali.Exception(exception);
    }
}


function validateParent(procedure, parent, index) {
    switch (parent.type) {
        case bali.types.LIST:
            validateIndex(procedure, parent.getSize(), index);
            break;
        case bali.types.CATALOG:
            validateParameterAbstraction(procedure, bali.Element, index);
            break;
        default:
            const exception = bali.Catalog.fromSequential({
                $exception: '$parameterType',
                $procedure: procedure,
                $expected: '$Parent',
                $actual: bali.types.typeName(parent.type)
            });
            throw new bali.Exception(exception);
    }
}


function validateIndex(procedure, size, index) {
    index = Math.abs(index);
    if (index === 0 || index > size) {
        const exception = bali.Catalog.fromLiteral({
            $exception: '$parameterValue',
            $procedure: procedure,
            $expected: new bali.Range(1, size),
            $actual: index
        });
        throw new bali.Exception(exception);
    }
}
