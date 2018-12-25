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
var bali = require('bali-component-framework');


exports.functions = [
    // <invalid>
    function() {
        throw new Error('PROCESSOR: No intrinsic function should have an index of zero.');
    },

    // Angle
    function(value) {
        //console.log('      Angle(' + value + ')');
        return new bali.Angle(value);
    },

    // Association
    function(key, value) {
        //console.log('      Association(' + key + ', ' + value + ')');
        return new bali.Association(key, value);
    },

    // Binary
    function(value) {
        //console.log('      Binary(' + value + ')');
        return new bali.Binary(value);
    },

    // Catalog
    function() {
        //console.log('      Catalog()');
        return new bali.Catalog();
    },

    // Duration
    function(value) {
        //console.log('      Duration(' + value + ')');
        return new bali.Duration(value);
    },

    // Filter
    function(value) {
        //console.log('      Filter(' + value + ')');
        return new bali.Filter(value);
    },

    // List
    function() {
        //console.log('      List()');
        return new bali.List();
    },

    // Moment
    function(value) {
        //console.log('      Moment(' + value + ')');
        return new bali.Moment(value);
    },

    // Number
    function(value) {
        //console.log('      Number(' + value + ')');
        return new bali.Complex(value);
    },

    // Parameters
    function(collection) {
        //console.log('      Parameters(' + collection.toDocument('      ') + ')');
        return new bali.Parameters(collection);
    },

    // Percent
    function(value) {
        //console.log('      Percent(' + value + ')');
        return new bali.Percent(value);
    },

    // Probability
    function(value) {
        //console.log('      Probability(' + value + ')');
        return new bali.Probability(value);
    },

    // Queue
    function() {
        //console.log('      Queue()');
        return new bali.Queue();
    },

    // Range
    function(firstValue, lastValue) {
        //console.log('      Range(' + firstValue + ', ' + lastValue + ')');
        return new bali.Range(firstValue, lastValue);
    },

    // Reference
    function(value) {
        //console.log('      Reference(' + value + ')');
        return new bali.Reference(value);
    },

    // Set
    function() {
        //console.log('      Set()');
        return new bali.Set();
    },

    // Source
    function(procedure) {
        //console.log('      Source(' + procedure + ')');
        return new bali.Source(procedure);
    },

    // Stack
    function() {
        //console.log('      Stack()');
        return new bali.Stack();
    },

    // Symbol
    function(value) {
        //console.log('      Symbol(' + value + ')');
        return new bali.Symbol(value);
    },

    // Tag
    function(value) {
        //console.log('      Tag(' + value + ')');
        return new bali.Tag(value);
    },

    // Text
    function(value) {
        //console.log('      Text(' + value + ')');
        return new bali.Text(value);
    },

    // Tree
    function(type, complexity) {
        //console.log('      Tree(' + bali.types.nameForType(type) + ', ' + complexity + ')');
        return new bali.Tree(type, complexity);
    },

    // Version
    function(value) {
        //console.log('      Version(' + value + ')');
        return new bali.Version(value);
    },

    // addItem
    function(collection, item) {
        //console.log('      addItem(' + collection + ', ' + item + ')');
        collection.addItem(item);
        return collection;
    },

    // and
    function(firstProbability, secondProbability) {
        //console.log('      and(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.and(firstProbability, secondProbability);
    },

    // complement
    function(probability) {
        //console.log('      complement(' + probability + ')');
        return bali.Probability.complement(probability);
    },

    // conjugate
    function(number) {
        //console.log('      conjugate(' + number + ')');
        return bali.Complex.conjugate(number);
    },

    // default
    function(useProposed, proposedValue, defaultValue) {
        //console.log('      default(' + useProposed + ', ' + proposedValue + ', ' + defaultValue + ')');
        return bali.Filter.NONE.isEqualTo(useProposed) ? defaultValue : proposedValue;
    },

    // difference
    function(firstNumber, secondNumber) {
        //console.log('      difference(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.difference(firstNumber, secondNumber);
    },

    // equal
    function(firstComponent, secondComponent) {
        //console.log('      equal(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.equal(firstComponent, secondComponent);
    },

    // exponential
    function(base, exponent) {
        //console.log('      exponential(' + base + ', ' + exponent + ')');
        return bali.Complex.exponential(base, exponent);
    },

    // factorial
    function(number) {
        //console.log('      factorial(' + number + ')');
        return bali.Complex.factorial(number);
    },

    // getValue
    function(catalog, key) {
        //console.log('      getValue(' + catalog + ', ' + key + ')');
        return catalog.getValue(key) || bali.Filter.NONE;
    },

    // inverse
    function(number) {
        //console.log('      inverse(' + number + ')');
        return bali.Complex.inverse(number);
    },

    // is
    function(firstComponent, secondComponent) {
        //console.log('      is(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.is(firstComponent, secondComponent);
    },

    // less
    function(firstComponent, secondComponent) {
        //console.log('      less(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.less(firstComponent, secondComponent);
    },

    // magnitude
    function(number) {
        //console.log('      magnitude(' + number + ')');
        return bali.Complex.magnitude(number);
    },

    // matches
    function(component, filter) {
        //console.log('      matches(' + component + ', ' + filter + ')');
        //return bali.Component.matches(component, filter);
        return component.isEqualTo(filter);
    },

    // more
    function(firstComponent, secondComponent) {
        //console.log('      more(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.more(firstComponent, secondComponent);
    },

    // negative
    function(number) {
        //console.log('      negative(' + number + ')');
        return bali.Complex.negative(number);
    },

    // or
    function(firstProbability, secondProbability) {
        //console.log('      or(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.or(firstProbability, secondProbability);
    },

    // product
    function(firstNumber, secondNumber) {
        //console.log('      product(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.product(firstNumber, secondNumber);
    },

    // quotient
    function(firstNumber, secondNumber) {
        //console.log('      quotient(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.quotient(firstNumber, secondNumber);
    },

    // random
    function() {
        //console.log('      random()');
        return bali.Probability.random();
    },

    // remainder
    function(firstNumber, secondNumber) {
        //console.log('      remainder(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.remainder(firstNumber, secondNumber);
    },

    // sans
    function(firstProbability, secondProbability) {
        //console.log('      sans(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.sans(firstProbability, secondProbability);
    },

    // setParameters
    function(component, parameters) {
        //console.log('      setParameters(' + component + ', ' + parameters + ')');
        component.setParameters(parameters);
        return bali.Filter.NONE;
    },

    // setValue
    function(catalog, key, value) {
        //console.log('      setValue(' + catalog + ', ' + key + ', ' + value + ')');
        return catalog.setValue(key, value) || bali.Filter.NONE;
    },

    // sum
    function(firstNumber, secondNumber) {
        //console.log('      sum(' + firstNumber + ', ' + secondNumber + ')');
        //return bali.Complex.sum(firstNumber, secondNumber);
        var sum = firstNumber.toNumber() + secondNumber.toNumber();
        return new bali.Complex(String(sum));
    },

    // xor
    function(firstProbability, secondProbability) {
        //console.log('      xor(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.xor(firstProbability, secondProbability);
    }
];

exports.names = [
    '<invalid>',
    '$Angle',
    '$Association',
    '$Binary',
    '$Catalog',
    '$Duration',
    '$Filter',
    '$List',
    '$Moment',
    '$Number',
    '$Parameters',
    '$Percent',
    '$Probability',
    '$Queue',
    '$Range',
    '$Reference',
    '$Set',
    '$Source',
    '$Stack',
    '$Symbol',
    '$Tag',
    '$Text',
    '$Tree',
    '$Version',
    '$addItem',
    '$and',
    '$complement',
    '$conjugate',
    '$default',
    '$difference',
    '$equal',
    '$exponential',
    '$factorial',
    '$getValue',
    '$inverse',
    '$is',
    '$less',
    '$magnitude',
    '$matches',
    '$more',
    '$negative',
    '$or',
    '$product',
    '$quotient',
    '$random',
    '$remainder',
    '$sans',
    '$setParameters',
    '$setValue',
    '$sum',
    '$xor'
];

exports.invokeByName = function(name, parameters) {
    var index = exports.names.indexOf(name);
    var result = exports.functions[index].apply(parameters);
    return result;
};
