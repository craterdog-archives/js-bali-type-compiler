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
var compiler = require('./TypeCompiler');


exports.invokeByName = function(processor, name, parameters) {
    var index = exports.intrinsicNames.indexOf(name);
    var result = intrinsicFunctions[index].apply(processor, parameters);
    return result;
};

exports.invokeByIndex = function(processor, index, parameters) {
    var result = intrinsicFunctions[index].apply(processor, parameters);
    return result;
};

var intrinsicFunctions = [
    // addItem
    function(list, item) {},

    // and
    function(firstProbability, secondProbability) {},

    // catalog
    function(size) {},

    // complement
    function(probability) {},

    // conjugate
    function(number) {},

    // default
    function(useProposed, proposedValue, defaultValue) {
        return Boolean(String(useProposed)) ? proposedValue : defaultValue;
    },

    // difference
    function(firstNumber, secondNumber) {},

    // equal
    function(firstValue, secondValue) {},

    // exponential
    function(firstNumber, secondNumber) {},

    // factorial
    function(number) {
        function f(n) {
            return (n<2) ? 1 : f(n-1) * n;
        }
        var factorial = f(number.toNumber());
        return new bali.Complex(String(factorial));
    },

    // getType
    function(component) {

    },

    // getValue
    function(catalog, key) {},

    // inverse
    function(number) {},

    // is
    function(firstValue, secondValue) {},

    // less
    function(firstNumber, secondNumber) {},

    // list
    function(size) {},

    // magnitude
    function(number) {},

    // matches
    function(value, template) {},

    // more
    function(firstNumber, secondNumber) {},

    // negative
    function(number) {},

    // or
    function(firstProbability, secondProbability) {},

    // product
    function(firstNumber, secondNumber) {},

    // quotient
    function(firstNumber, secondNumber) {},

    // random
    function() {
        var random = Math.random();
        return new bali.Complex(String(random));
    },

    // range
    function(firstValue, lastValue) {},

    // remainder
    function(firstNumber, secondNumber) {},

    // sans
    function(firstProbability, secondProbability) {},

    // setParameters
    function(state, parameters) {},

    // setValue
    function(catalog, key, value) {},

    // sum
    function(firstNumber, secondNumber) {
        var sum = firstNumber.toNumber() + secondNumber.toNumber();
        return new bali.Complex(String(sum));
    },

    // xor
    function(firstProbability, secondProbability) {}
];

exports.intrinsicNames = [
    '$addItem',
    '$and',
    '$catalog',
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
    '$list',
    '$magnitude',
    '$matches',
    '$more',
    '$negative',
    '$or',
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
