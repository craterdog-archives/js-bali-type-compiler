/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This module defines a class that analyzes compiled methods for structural consistency
 * and type safety.
 */
const moduleName = '/bali/compiler/Analyzer';
const bali = require('bali-component-framework').api();


/**
 * This constructor returns an analyzer that analyzes a compiled type.
 *
 * An optional debug argument may be specified that controls the level of debugging that
 * should be applied during execution. The allowed levels are as follows:
 * <pre>
 *   0: no debugging is applied (this is the default value and has the best performance)
 *   1: log any exceptions to console.error before throwing them
 *   2: perform argument validation checks on each call (poor performance)
 *   3: log interesting arguments, states and results to console.log
 * </pre>
 *
 * @returns {Analyzer} The new type analyzer.
 */
function Analyzer(debug) {
    this.debug = debug || 0;  // default is off
    return this;
}
Analyzer.prototype.constructor = Analyzer;
exports.Analyzer = Analyzer;


/**
 * This method analyzes the specified document for structural consistency against its type definition.
 *
 * @param {DocumentRepository} repository The repository maintaining the type definition documents.
 * @param {Catalog} document The document to be analyzed.
 */
Analyzer.prototype.analyzeDocument = async function(repository, document) {
    await analyzeStructure(repository, document, this.debug);
};


// PRIVATE FUNCTIONS

const getType = function(component) {
    var type = component.getParameter('$type');
    if (!type) type = component.getType().replace('bali', 'nebula') + '/v1';
    return type;
};


const isType = function(component, type) {
    // check for 'none'
    if (bali.areEqual(component, bali.pattern.NONE)) return true;  // 'none' matches any type

    // check for an expression
    if (component.isType('/bali/trees/Node')) return true;  // a dynamic expression can be any type

    // check for parameterized type
    var actualType = getType(component);
    if (bali.areEqual(type, actualType)) return true;  // matches the parameterized type

    // check for core subtype
    const superType = type.toLiteral().replace('nebula', 'bali').replace('/v1', '');
    if (component.isType(superType)) return true;  // it's a subtype of the expected type
    if (component.supportsInterface(superType)) return true;  // it's an interface of the expected type

    // the types don't match
    return false;
};


const analyzeStructure = async function(repository, component, debug) {
    if (!component) return;  // nothing to analyze

    // elements have no structure
    if (component.isType('/bali/abstractions/Element')) return;

    // analyze any parameterization
    const parameterizedType = component.getParameter('$type');
    if (parameterizedType && parameterizedType.toLiteral() !== '/nebula/collections/Catalog/v1') {
        await analyzeParameterizedComponent(repository, parameterizedType, component, debug);
    }

    // analyze any nested components
    if (component.isType('/bali/abstractions/Collection') && component.getType() !== '/bali/collections/Range') {
        await analyzeNestedComponents(repository, component, debug);
    }
};


const analyzeParameterizedComponent = async function(repository, parameterizedType, component, debug) {
    if (component.getType() === '/bali/collections/Catalog') {

        // retrieve the attribute definitions for the typed catalog
        const definitions = await retrieveAttributeDefinitions(repository, parameterizedType, debug);

        // validate each attribute in the catalog against its type definition
        const iterator = definitions.getIterator();
        while (iterator.hasNext()) {
            const association = iterator.getNext();
            const symbol = association.getKey();
            const definition = association.getValue();
            const attribute = component.getAttribute(symbol);
            validateAttributeType(definition, symbol, component, attribute, debug);
        }

        // check for additional attributes in the catalog
        const catalogKeys = bali.set(component.getKeys());
        const definitionKeys = bali.set(definitions.getKeys());
        const additional = bali.set.sans(catalogKeys, definitionKeys);
        if (additional.getSize()) {
            const exception = bali.exception({
                $module: moduleName,
                $procedure: '$analyzeStructure',
                $exception: '$additionalAttributes',
                $expected: definitionKeys,
                $additional: additional,
                $catalog: component,
                $text: '"The catalog defines additional attributes not found in its type."'
            });
            if (debug) console.error(exception.toString());
            throw exception;
        }
    }
};


const analyzeNestedComponents = async function(repository, component, debug) {
    // retrieve any parameterized types
    const type = component.getParameter('$type');
    var keyType;
    var itemType;
    if (type) {
        // retrieve specific types
        keyType = type.getParameter('$keyType');
        itemType = type.getParameter('$itemType');
        if (!itemType) itemType = type.getParameter('$valueType');
    }
    // set default types if necessary
    if (!keyType) keyType = bali.component('/nebula/strings/Symbol/v1');
    if (!itemType) itemType = bali.component('/nebula/abstractions/Component/v1');

    // analyze each item
    const iterator = component.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        if (item.getType() === '/bali/collections/Association') {
            const key = item.getKey();
            validateComponentType(key, keyType, debug);
            item = item.getValue();
        }
        validateComponentType(item, itemType, debug);
        await analyzeStructure(repository, item, debug);
    }
};


const retrieveAttributeDefinitions = async function(repository, name, debug) {
    const contract = await repository.retrieveContract(name.toLiteral());
    if (!contract) {
        const exception = bali.exception({
            $module: moduleName,
            $procedure: '$retrieveAttributeDefinitions',
            $exception: '$missingType',
            $type: name,
            $text: '"The named type was not found in the repository."'
        });
        if (debug) console.error(exception.toString());
        throw exception;
    }
    const type = contract.getAttribute('$document');
    var result = bali.catalog();
    const parent = type.getAttribute('$parent');
    if (!bali.areEqual(parent, bali.pattern.NONE)) {
        result = await retrieveAttributeDefinitions(repository, parent, debug);
    }
    const attributes = type.getAttribute('$attributes');
    if (attributes) result.addItems(attributes);
    return result;
};


const validateComponentType = function(component, expectedType, debug) {
    if (isType(component, expectedType)) return;
    const actualType = getType(component);
    const exception = bali.exception({
        $module: moduleName,
        $procedure: '$validateComponentType',
        $exception: '$incorrectType',
        $expected: expectedType,
        $actual: actualType,
        $component: component,
        $text: '"The type of the component does not match the expected type."'
    });
    if (debug) console.error(exception.toString());
    throw exception;
};


const validateAttributeType = function(definition, symbol, catalog, attribute, debug) {
    // undefined attributes must have a default value in the definition
    if (attribute === undefined) {
        if (definition.getAttribute('$default')) return;
        const exception = bali.exception({
            $module: moduleName,
            $procedure: '$validateAttributeType',
            $exception: '$missingAttribute',
            $attribute: symbol,
            $catalog: catalog,
            $text: '"The catalog is missing an attribute found in its type."'
        });
        if (debug) console.error(exception.toString());
        throw exception;
    }

    const expectedType = definition.getAttribute('$type');
    if (isType(attribute, expectedType)) return;
    // TODO: handle a symbol attribute with an enumeration type
    const actualType = getType(component);
    const exception = bali.exception({
        $module: moduleName,
        $procedure: '$validateAttributeType',
        $exception: '$incorrectType',
        $attribute: symbol,
        $expected: expectedType,
        $actual: actualType,
        $text: '"The type of the attribute does not match the expected type."'
    });
    if (debug) console.error(exception.toString());
    throw exception;
};

