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
 * This method analyzes the specified type for structural consistency and type safety.
 *
 * @param {DocumentRepository} repository The repository maintaining the type definition documents.
 * @param {Catalog} type The type to be analyzed.
 */
Analyzer.prototype.analyzeType = function(repository, type) {

};

