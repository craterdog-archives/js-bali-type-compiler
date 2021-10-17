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

const getTypeName = function(document) {
    var typeName = document.getParameter('$type');
    if (!typeName) typeName = document.getType().replace('bali', 'nebula') + '/v1';
    return typeName;
};


const analyzeStructure = async function(repository, catalog, debug) {
    const type = catalog.getParameter('$type');
    if (type && type.toLiteral() !== '/nebula/collections/Catalog/v1') {
        // retrieve the attribute definitions for the typed catalog
        const definitions = await retrieveAttributeDefinitions(repository, type, debug);

        // validate each attribute in the catalog against its type definition
        const iterator = definitions.getIterator();
        while (iterator.hasNext()) {
            const association = iterator.getNext();
            const symbol = association.getKey();
            const definition = association.getValue();
            const attribute = catalog.getAttribute(symbol);
            if (attribute) {
                validateAttributeType(symbol, definition, attribute, debug);
            } else if (!definition.getAttribute('$default')) {
                const exception = bali.exception({
                    $module: moduleName,
                    $procedure: '$analyzeStructure',
                    $exception: '$missingAttribute',
                    $attribute: symbol,
                    $catalog: catalog,
                    $text: '"The catalog is missing an attribute found in its type."'
                });
                if (debug) console.error(exception.toString());
                throw exception;
            }
        }

        // check for additional attributes in the catalog
        const catalogKeys = bali.set(catalog.getKeys());
        const definitionKeys = bali.set(definitions.getKeys());
        const additional = bali.set.sans(catalogKeys, definitionKeys);
        if (additional.getSize()) {
            const exception = bali.exception({
                $module: moduleName,
                $procedure: '$analyzeStructure',
                $exception: '$additionalAttributes',
                $expected: definitionKeys,
                $additional: additional,
                $catalog: catalog,
                $text: '"The catalog defines additional attributes not found in its type."'
            });
            if (debug) console.error(exception.toString());
            throw exception;
        }
    }

    // analyze any nested catalogs
    const iterator = catalog.getIterator();
    while (iterator.hasNext()) {
        const association = iterator.getNext();
        const symbol = association.getKey();
        const attribute = association.getValue();
        if (attribute.getType() === '/bali/collections/Catalog') {
            await analyzeStructure(repository, attribute, debug);
        }
    }
};


const retrieveAttributeDefinitions = async function(repository, name, debug) {
    const contract = await repository.retrieveContract(name.toLiteral());
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


const validateAttributeType = function(symbol, definition, attribute, debug) {
    const expectedType = definition.getAttribute('$type');
    const actualType = getTypeName(attribute);
    if (bali.areEqual(expectedType, actualType)) return;      // they match
    if (bali.areEqual(attribute, bali.pattern.NONE)) return;  // 'none' is fine
    if (attribute.isType('/bali/trees/Node')) return;         // it's a dynamic expression
    const superType = expectedType.toLiteral().replace('nebula', 'bali').replace('/v1', '');
    if (attribute.isType(superType)) return;                  // it's a subtype of the expected type
    // TODO: handle a symbol attribute with an enumeration type
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

