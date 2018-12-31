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
    function() {
    },

    // $addItem
    function(collection, item) {
        //console.log('      addItem(' + collection + ', ' + item + ')');
        collection.addItem(item);
        return collection;
    },

    // $addItems
    function() {
    },

    // $and
    function(first, second) {
        //console.log('      and(' + first + ', ' + second + ')');
        var exception;
        var type = first.type;
        if (type !== second.type) {
            exception = bali.Catalog.from({
                $exception: '$parameterType',
                $procedure: '$and',
                $expected: bali.types.typeName(type),
                $actual: bali.types.typeName(second.type)
            });
            throw new bali.Exception(exception);
        }
        switch (type) {
            case bali.types.BINARY:
                return bali.Binary.and(first, second);
            case bali.types.PROBABILITY:
                return bali.Probability.and(first, second);
            case bali.types.SET:
                return bali.Set.and(first, second);
            default:
                exception = bali.Catalog.from({
                    $exception: '$parameterType',
                    $procedure: '$and',
                    $expected: bali.types.PROBABILITY,
                    $actual: bali.types.typeName(type)
                });
                throw new bali.Exception(exception);
        }
    },

    // $angle
    function(value) {
        //console.log('      Angle(' + value + ')');
        var angle = constructElement('$Angle', value);
        return angle;
    },

    // $arccosine
    function() {
    },

    // $arcsine
    function() {
    },

    // $arctangent
    function() {
    },

    // $association
    function(key, value) {
        //console.log('      Association(' + key + ', ' + value + ')');
        try {
            var association = new bali.Association(key, value);
            return association;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Association',
                $key: key,
                $value: value,
                $message: 'An invalid key or value was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $binary
    function(value) {
        //console.log('      Binary(' + value + ')');
        var binary = constructElement('$Binary', value);
        return binary;
    },

    // $catalog
    function() {
        //console.log('      Catalog()');
        return new bali.Catalog();
    },

    // $coinToss
    function() {
    },

    // $comparedTo
    function() {
    },

    // $complement
    function(probability) {
        //console.log('      complement(' + probability + ')');
        return bali.Probability.complement(probability);
    },

    // $concatenation
    function() {
    },

    // $conjugate
    function(number) {
        //console.log('      conjugate(' + number + ')');
        return bali.Number.conjugate(number);
    },

    // $containsAll
    function() {
    },

    // $containsAny
    function() {
    },

    // $containsItem
    function() {
    },

    // $cosine
    function() {
    },

    // $default
    function(useProposed, proposedValue, defaultValue) {
        //console.log('      default(' + useProposed + ', ' + proposedValue + ', ' + defaultValue + ')');
        return bali.Filter.NONE.isEqualTo(useProposed) ? defaultValue : proposedValue;
    },

    // $difference
    function(firstNumber, secondNumber) {
    },

    // $duration
    function(value) {
        //console.log('      Duration(' + value + ')');
        var duration = constructElement('$Duration', value);
        return duration;
    },

    // $exponential
    function(base, exponent) {
        //console.log('      exponential(' + base + ', ' + exponent + ')');
        return bali.Number.exponential(base, exponent);
    },

    // $extraction
    function() {
    },

    // $factorial
    function(number) {
        //console.log('      factorial(' + number + ')');
        return bali.Number.factorial(number);
    },

    // $filter
    function(value) {
        //console.log('      Filter(' + value + ')');
        var filter = constructElement('$Filter', value);
        return filter;
    },

    // $getAssociations
    function() {
    },

    // $getChild
    function() {
    },

    // $getHash
    function() {
    },

    // $getHead
    function() {
    },

    // $getIdentifier
    function() {
    },

    // $getImaginary
    function() {
    },

    // $getIndex
    function() {
    },

    // $getItem
    function() {
    },

    // $getItems
    function() {
    },

    // $getKey
    function() {
    },

    // $getKeys
    function() {
    },

    // $getMagnitude
    function(number) {
    },

    // $getNumbers
    function() {
    },

    // $getPhase
    function() {
    },

    // $getReal
    function() {
    },

    // $getSize
    function() {
    },

    // $getTop
    function() {
    },

    // $getType
    function() {
    },

    // $getValue
    function(catalog, key) {
        //console.log('      getValue(' + catalog + ', ' + key + ')');
        return catalog.getValue(key) || bali.Filter.NONE;
    },

    // $getValues
    function() {
    },

    // $identifier
    function(type, value) {
        //console.log('      Identifier(' + type + ', ' + value + ')');
        try {
            var identifier = new bali.Identifier(type, value);
            return identifier;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Identifier',
                $type: type,
                $value: value,
                $message: 'An invalid type or value was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $insertItem
    function() {
    },

    // $inverse
    function(number) {
    },

    // $isEmpty
    function() {
    },

    // $isEqualTo
    function(firstComponent, secondComponent) {
        //console.log('      isEqualTo(' + firstComponent + ', ' + secondComponent + ')');
        return firstComponent.comparedTo(secondComponent) === 0;
    },

    // $isInRange
    function() {
    },

    // $isInfinite
    function() {
    },

    // $isLessThan
    function(firstComponent, secondComponent) {
        //console.log('      isLessThan(' + firstComponent + ', ' + secondComponent + ')');
        return firstComponent.comparedTo(secondComponent) < 0;
    },

    // $isMoreThan
    function(firstComponent, secondComponent) {
        //console.log('      isMoreThan(' + firstComponent + ', ' + secondComponent + ')');
        return firstComponent.comparedTo(secondComponent) > 0;
    },

    // $isParameterized
    function(component) {
        //console.log('      isParameterized(' + component + ')');
        return component.isParameterized();
    },

    // $isSameAs
    function(firstComponent, secondComponent) {
        //console.log('      isSameAs(' + firstComponent + ', ' + secondComponent + ')');
        return firstComponent === secondComponent;
    },

    // $isSimple
    function() {
    },

    // $isUndefined
    function() {
    },

    // $isZero
    function() {
    },

    // $list
    function() {
        //console.log('      List()');
        return new bali.List();
    },

    // $logarithm
    function() {
    },

    // $matches
    function(component, filter) {
        //console.log('      matches(' + component + ', ' + filter + ')');
        return component.matches(filter);
    },

    // $moment
    function(value) {
        //console.log('      Moment(' + value + ')');
        var moment = constructElement('$Moment', value);
        return moment;
    },

    // $nextVersion
    function() {
    },

    // $not
    function() {
    },

    // $number
    function(value) {
        //console.log('      Number(' + value + ')');
        var number = constructElement('$Number', value);
        return number;
    },

    // $or
    function(first, second) {
        //console.log('      or(' + first + ', ' + second + ')');
        var exception;
        var type = first.type;
        if (type !== second.type) {
            exception = bali.Catalog.from({
                $exception: '$parameterType',
                $procedure: '$or',
                $expected: bali.types.typeName(type),
                $actual: bali.types.typeName(second.type)
            });
            throw new bali.Exception(exception);
        }
        switch (type) {
            case bali.types.BINARY:
                return bali.Binary.or(first, second);
            case bali.types.PROBABILITY:
                return bali.Probability.or(first, second);
            case bali.types.SET:
                return bali.Set.or(first, second);
            default:
                exception = bali.Catalog.from({
                    $exception: '$parameterType',
                    $procedure: '$or',
                    $expected: bali.types.PROBABILITY,
                    $actual: bali.types.typeName(type)
                });
                throw new bali.Exception(exception);
        }
    },

    // $parameters
    function(collection) {
        //console.log('      Parameters(' + collection.toDocument('      ') + ')');
        try {
            var parameters = new bali.Parameters(collection);
            return parameters;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Parameters',
                $collection: collection,
                $message: 'An invalid collection was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $percent
    function(value) {
        //console.log('      Percent(' + value + ')');
        var percent = constructElement('$Percent', value);
        return percent;
    },

    // $probability
    function(value) {
        //console.log('      Probability(' + value + ')');
        var probability = constructElement('$Probability', value);
        return probability;
    },

    // $product
    function() {
    },

    // $queue
    function() {
        //console.log('      Queue()');
        return new bali.Queue();
    },

    // $quotient
    function() {
    },

    // $randomBytes
    function(numberOfBytes) {
        return bali.Binary.random(numberOfBytes);
    },

    // $randomIndex
    function(length) {
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
    function(first, last) {
        //console.log('      Range(' + first + ', ' + last + ')');
        try {
            var range = new bali.Range(first, last);
            return range;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Range',
                $first: first,
                $last: last,
                $message: 'An invalid first or last value was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $reciprocal
    function() {
    },

    // $reduction
    function() {
    },

    // $reference
    function(value) {
        //console.log('      Reference(' + value + ')');
        var reference = constructElement('$Reference', value);
        return reference;
    },

    // $remainder
    function() {
    },

    // $removeAll
    function() {
    },

    // $removeItem
    function() {
    },

    // $removeItems
    function() {
    },

    // $removeValue
    function() {
    },

    // $reverseItems
    function() {
    },

    // $sans
    function(first, second) {
        //console.log('      sans(' + first + ', ' + second + ')');
        var exception;
        var type = first.type;
        if (type !== second.type) {
            exception = bali.Catalog.from({
                $exception: '$parameterType',
                $procedure: '$sans',
                $expected: bali.types.typeName(type),
                $actual: bali.types.typeName(second.type)
            });
            throw new bali.Exception(exception);
        }
        switch (type) {
            case bali.types.BINARY:
                return bali.Binary.sans(first, second);
            case bali.types.PROBABILITY:
                return bali.Probability.sans(first, second);
            case bali.types.SET:
                return bali.Set.sans(first, second);
            default:
                exception = bali.Catalog.from({
                    $exception: '$parameterType',
                    $procedure: '$sans',
                    $expected: bali.types.PROBABILITY,
                    $actual: bali.types.typeName(type)
                });
                throw new bali.Exception(exception);
        }
    },

    // $scaled
    function() {
    },

    // $set
    function() {
        //console.log('      Set()');
        return new bali.Set();
    },

    // $setItem
    function() {
    },

    // $setParameters
    function(component, parameters) {
        //console.log('      setParameters(' + component + ', ' + parameters + ')');
        component.setParameters(parameters);
        return bali.Filter.NONE;
    },

    // $setValue
    function(catalog, key, value) {
        //console.log('      setValue(' + catalog + ', ' + key + ', ' + value + ')');
        return catalog.setValue(key, value) || bali.Filter.NONE;
    },

    // $shuffleItems
    function() {
    },

    // $sine
    function() {
    },

    // $sortItems
    function() {
    },

    // $source
    function(procedure) {
        //console.log('      Source(' + procedure + ')');
        try {
            var source = new bali.Source(procedure);
            return source;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Source',
                $value: procedure,
                $message: 'An invalid procedure was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $stack
    function() {
        //console.log('      Stack()');
        return new bali.Stack();
    },

    // $sum
    function() {
    },

    // $supplement
    function() {
    },

    // $symbol
    function(value) {
        //console.log('      Symbol(' + value + ')');
        var symbol = constructElement('$Symbol', value);
        return symbol;
    },

    // $tag
    function(value) {
        //console.log('      Tag(' + value + ')');
        var tag = constructElement('$Tag', value);
        return tag;
    },

    // $tangent
    function() {
    },

    // $text
    function(value) {
        //console.log('      Text(' + value + ')');
        var text = constructElement('$Text', value);
        return text;
    },

    // $toBase2
    function() {
    },

    // $toBase16
    function() {
    },

    // $toBase32
    function() {
    },

    // $toBase64
    function() {
    },

    // $toBoolean
    function() {
    },

    // $toDocument
    function() {
    },

    // $toNumber
    function() {
    },

    // $toPolar
    function() {
    },

    // $toRectangular
    function() {
    },

    // $tree
    function(type, complexity) {
        //console.log('      Tree(' + bali.types.nameForType(type) + ', ' + complexity + ')');
        try {
            var tree = new bali.Tree(type, complexity);
            return tree;
        } catch (e) {
            var exception = bali.Catalog.from({
                $exception: '$parameterValue',
                $procedure: '$Tree',
                $type: type,
                $complexity: complexity,
                $message: 'An invalid type or complexity was passed into the constructor.'
            });
            throw new bali.Exception(exception);
        }
    },

    // $validNextVersion
    function() {
    },

    // $version
    function(value) {
        //console.log('      Version(' + value + ')');
        var version = constructElement('$Version', value);
        return version;
    },

    // $xor
    function(first, second) {
        //console.log('      xor(' + first + ', ' + second + ')');
        var exception;
        var type = first.type;
        if (type !== second.type) {
            exception = bali.Catalog.from({
                $exception: '$parameterType',
                $procedure: '$xor',
                $expected: bali.types.typeName(type),
                $actual: bali.types.typeName(second.type)
            });
            throw new bali.Exception(exception);
        }
        switch (type) {
            case bali.types.BINARY:
                return bali.Binary.xor(first, second);
            case bali.types.PROBABILITY:
                return bali.Probability.xor(first, second);
            case bali.types.SET:
                return bali.Set.xor(first, second);
            default:
                exception = bali.Catalog.from({
                    $exception: '$parameterType',
                    $procedure: '$xor',
                    $expected: bali.types.PROBABILITY,
                    $actual: bali.types.typeName(type)
                });
                throw new bali.Exception(exception);
        }
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
    '$comparedTo',
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
    '$filter',
    '$getAssociations',
    '$getChild',
    '$getHash',
    '$getHead',
    '$getIdentifier',
    '$getImaginary',
    '$getIndex',
    '$getItem',
    '$getItems',
    '$getKey',
    '$getKeys',
    '$getMagnitude',
    '$getNumbers',
    '$getPhase',
    '$getReal',
    '$getSize',
    '$getTop',
    '$getType',
    '$getValue',
    '$getValues',
    '$identifier',
    '$insertItem',
    '$inverse',
    '$isEmpty',
    '$isEqualTo',
    '$isInRange',
    '$isInfinite',
    '$isLessThan',
    '$isMoreThan',
    '$isParameterized',
    '$isSameAs',
    '$isSimple',
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
    '$reduction',
    '$reference',
    '$remainder',
    '$removeAll',
    '$removeItem',
    '$removeItems',
    '$removeValue',
    '$reverseItems',
    '$sans',
    '$scaled',
    '$set',
    '$setItem',
    '$setParameters',
    '$setValue',
    '$shuffleItems',
    '$sine',
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
    '$toNumber',
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

function constructElement(procedure, value) {
    var exception;
    if (value.type !== bali.types.TEXT) {
        exception = bali.Catalog.from({
            $exception: '$parameterType',
            $procedure: procedure,
            $expected: '$Text',
            $actual: bali.types.typeName(value.type)
        });
        throw new bali.Exception(exception);
    }
    try {
        var constructor = bali[procedure.slice(1)];
        var element = new constructor(value);
        return element;
    } catch (e) {
        exception = bali.Catalog.from({
            $exception: '$parameterValue',
            $procedure: procedure,
            $value: value.toString()
        });
        throw new bali.Exception(exception);
    }
}
