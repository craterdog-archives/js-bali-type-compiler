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
        throw new Error('MACHINE: No intrinsic function should have an index of zero.');
    },

    // addItem
    function(list, item) {
        console.log('addItem(' + list + ', ' + item + ')');
        return list.addItem(item);
    },

    // addParameter
    function(parameters, parameter) {
        console.log('addParameter(' + parameters + ', ' + parameter + ')');
        return parameters.addParameter(parameter);
    },

    // and
    function(firstProbability, secondProbability) {
        console.log('and(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.and(firstProbability, secondProbability);
    },

    // catalog
    function() {
        console.log('catalog()');
        return new bali.Catalog();
    },

    // complement
    function(probability) {
        console.log('complement(' + probability + ')');
        return bali.Probability.complement(probability);
    },

    // conjugate
    function(number) {
        console.log('conjugate(' + number + ')');
        return bali.Complex.conjugate(number);
    },

    // default
    function(useProposed, proposedValue, defaultValue) {
        console.log('default(' + useProposed + ', ' + proposedValue + ', ' + defaultValue + ')');
        return bali.Template.NONE.isEqualTo(useProposed) ? defaultValue : proposedValue;
    },

    // difference
    function(firstNumber, secondNumber) {
        console.log('difference(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.difference(firstNumber, secondNumber);
    },

    // equal
    function(firstComponent, secondComponent) {
        console.log('equal(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.equal(firstComponent, secondComponent);
    },

    // exponential
    function(base, exponent) {
        console.log('exponential(' + base + ', ' + exponent + ')');
        return bali.Complex.exponential(base, exponent);
    },

    // factorial
    function(number) {
        console.log('factorial(' + number + ')');
        // return bali.Complex.factorial(number);
        function f(n) {
            return (n<2) ? 1 : f(n-1) * n;
        }
        var factorial = f(number.toNumber());
        return new bali.Complex(String(factorial));
    },

    // getType
    function(component) {
        console.log('getType(' + component + ')');
        return component.getType();
    },

    // getValue
    function(catalog, key) {
        console.log('getValue(' + catalog + ', ' + key + ')');
        return catalog.getValue(key);
    },

    // inverse
    function(number) {
        console.log('inverse(' + number + ')');
        return bali.Complex.inverse(number);
    },

    // is
    function(firstComponent, secondComponent) {
        console.log('is(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.equal(firstComponent, secondComponent);
    },

    // less
    function(firstComponent, secondComponent) {
        console.log('less(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.less(firstComponent, secondComponent);
    },

    // list
    function() {
        console.log('list()');
        return new bali.List();
    },

    // magnitude
    function(number) {
        console.log('magnitude(' + number + ')');
        return bali.Complex.magnitude(number);
    },

    // matches
    function(component, template) {
        console.log('matches(' + component + ', ' + template + ')');
        return bali.Component.matches(component, template);
    },

    // more
    function(firstComponent, secondComponent) {
        console.log('more(' + firstComponent + ', ' + secondComponent + ')');
        return bali.Component.less(firstComponent, secondComponent);
    },

    // negative
    function(number) {
        console.log('negative(' + number + ')');
        return bali.Complex.negative(number);
    },

    // or
    function(firstProbability, secondProbability) {
        console.log('or(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.or(firstProbability, secondProbability);
    },

    // parameters
    function() {
        console.log('parameters()');
        return new bali.Parameters();
    },

    // product
    function(firstNumber, secondNumber) {
        console.log('product(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.product(firstNumber, secondNumber);
    },

    // queue
    function() {
        console.log('queue()');
        return new bali.Queue();
    },

    // quotient
    function(firstNumber, secondNumber) {
        console.log('quotient(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.quotient(firstNumber, secondNumber);
    },

    // random
    function() {
        console.log('random()');
        return new bali.Probability();
    },

    // range
    function(firstValue, lastValue) {
        console.log('range(' + firstValue + ', ' + lastValue + ')');
        return new bali.Range(firstValue, lastValue);
    },

    // remainder
    function(firstNumber, secondNumber) {
        console.log('remainder(' + firstNumber + ', ' + secondNumber + ')');
        return bali.Complex.remainder(firstNumber, secondNumber);
    },

    // sans
    function(firstProbability, secondProbability) {
        console.log('sans(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.sans(firstProbability, secondProbability);
    },

    // set
    function() {
        console.log('set()');
        return new bali.Set();
    },

    // setParameters
    function(component, parameters) {
        console.log('setParameters(' + component + ', ' + parameters + ')');
        return component.setParameters(parameters);
    },

    // setValue
    function(catalog, key, value) {
        console.log('setValue(' + catalog + ', ' + key + ', ' + value + ')');
        return catalog.setValue(key, value);
    },

    // stack
    function() {
        console.log('stack()');
        return new bali.Stack();
    },

    // sum
    function(firstNumber, secondNumber) {
        console.log('sum(' + firstNumber + ', ' + secondNumber + ')');
        //return bali.Complex.sum(firstNumber, secondNumber);
        var sum = firstNumber.toNumber() + secondNumber.toNumber();
        return new bali.Complex(String(sum));
    },

    // xor
    function(firstProbability, secondProbability) {
        console.log('xor(' + firstProbability + ', ' + secondProbability + ')');
        return bali.Probability.xor(firstProbability, secondProbability);
    }
];

exports.names = [
    '<invalid>',
    '$addItem',
    '$addParameter',
    '$and',
    '$catalog',
    '$complement',
    '$conjugate',
    '$default',
    '$difference',
    '$equal',
    '$exponential',
    '$factorial',
    '$getType',
    '$getValue',
    '$inverse',
    '$is',
    '$less',
    '$list',
    '$magnitude',
    '$matches',
    '$more',
    '$negative',
    '$or',
    '$parameters',
    '$product',
    '$queue',
    '$quotient',
    '$random',
    '$range',
    '$remainder',
    '$sans',
    '$set',
    '$setParameters',
    '$setValue',
    '$stack',
    '$sum',
    '$xor'
];

exports.invokeByName = function(name, parameters) {
    var index = exports.names.indexOf(name);
    var result = exports.functions[index].apply(parameters);
    return result;
};
