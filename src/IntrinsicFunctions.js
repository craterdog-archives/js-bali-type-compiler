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
    },

    // addParameter
    function(parameters, parameter) {
        console.log('addParameter(' + parameters + ', ' + parameter + ')');
    },

    // and
    function(firstProbability, secondProbability) {
        console.log('and(' + firstProbability + ', ' + secondProbability + ')');
    },

    // catalog
    function() {
        console.log('catalog()');
    },

    // complement
    function(probability) {
        console.log('complement(' + probability + ')');
    },

    // conjugate
    function(number) {
        console.log('conjugate(' + number + ')');
    },

    // default
    function(useProposed, proposedValue, defaultValue) {
        console.log('default(' + useProposed + ', ' + proposedValue + ', ' + defaultValue + ')');
        return Boolean(String(useProposed)) ? proposedValue : defaultValue;
    },

    // difference
    function(firstNumber, secondNumber) {
        console.log('difference(' + firstNumber + ', ' + secondNumber + ')');
    },

    // equal
    function(firstValue, secondValue) {
        console.log('equal(' + firstValue + ', ' + secondValue + ')');
    },

    // exponential
    function(firstNumber, secondNumber) {
        console.log('exponential(' + firstNumber + ', ' + secondNumber + ')');
    },

    // factorial
    function(number) {
        console.log('factorial(' + number + ')');
        function f(n) {
            return (n<2) ? 1 : f(n-1) * n;
        }
        var factorial = f(number.toNumber());
        return new bali.Complex(String(factorial));
    },

    // getType
    function(component) {
        console.log('getType(' + component + ')');
    },

    // getValue
    function(catalog, key) {
        console.log('getValue(' + catalog + ', ' + key + ')');
    },

    // inverse
    function(number) {
        console.log('inverse(' + number + ')');
    },

    // is
    function(firstValue, secondValue) {
        console.log('is(' + firstValue + ', ' + secondValue + ')');
    },

    // less
    function(firstNumber, secondNumber) {
        console.log('less(' + firstNumber + ', ' + secondNumber + ')');
    },

    // list
    function() {
        console.log('list()');
    },

    // magnitude
    function(number) {
        console.log('magnitude(' + number + ')');
    },

    // matches
    function(value, template) {
        console.log('matches(' + value + ', ' + template + ')');
    },

    // more
    function(firstNumber, secondNumber) {
        console.log('more(' + firstNumber + ', ' + secondNumber + ')');
    },

    // negative
    function(number) {
        console.log('negative(' + number + ')');
    },

    // or
    function(firstProbability, secondProbability) {
        console.log('or(' + firstProbability + ', ' + secondProbability + ')');
    },

    // parameters
    function() {
        console.log('parameters()');
    },

    // product
    function(firstNumber, secondNumber) {
        console.log('product(' + firstNumber + ', ' + secondNumber + ')');
    },

    // quotient
    function(firstNumber, secondNumber) {
        console.log('quotient(' + firstNumber + ', ' + secondNumber + ')');
    },

    // random
    function() {
        console.log('random()');
        var random = Math.random();
        return new bali.Probability(random);
    },

    // range
    function(firstValue, lastValue) {
        console.log('range(' + firstValue + ', ' + lastValue + ')');
    },

    // remainder
    function(firstNumber, secondNumber) {
        console.log('remainder(' + firstNumber + ', ' + secondNumber + ')');
    },

    // sans
    function(firstProbability, secondProbability) {
        console.log('sans(' + firstProbability + ', ' + secondProbability + ')');
    },

    // setParameters
    function(component, parameters) {
        console.log('setParameters(' + component + ', ' + parameters + ')');
    },

    // setValue
    function(catalog, key, value) {
        console.log('setValue(' + catalog + ', ' + key + ', ' + value + ')');
    },

    // sum
    function(firstNumber, secondNumber) {
        console.log('sum(' + firstNumber + ', ' + secondNumber + ')');
        var sum = firstNumber.toNumber() + secondNumber.toNumber();
        return new bali.Complex(String(sum));
    },

    // xor
    function(firstProbability, secondProbability) {
        console.log('xor(' + firstProbability + ', ' + secondProbability + ')');
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
    '$quotient',
    '$random',
    '$range',
    '$remainder',
    '$sans',
    '$setParameters',
    '$setValue',
    '$sum',
    '$xor'
];

exports.invokeByName = function(processor, name, parameters) {
    var index = exports.names.indexOf(name);
    var result = exports.functions[index].apply(processor, parameters);
    return result;
};
