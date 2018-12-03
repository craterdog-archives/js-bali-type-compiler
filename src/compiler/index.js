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

var bali = require('bali-component-framework');

exports.Assembler = require('./Assembler').Assembler;
exports.assembler = new exports.Assembler();
exports.Compiler = require('./Compiler').Compiler;
exports.compiler = new exports.Compiler();


/**
 * This method compiles the type document that is cited by the specified citation.
 * 
 * @param {Object} nebula A singleton object that implements the Bali Nebula API™.
 * @param {Catalog} citation A citation referencing the type document to be compiled.
 * @returns {Catalog} A document citation for the resulting compiled type document.
 */
exports.compileType = function(nebula, citation) {
    var type;

    // retrieve the document
    var document = nebula.retrieveDocument(citation);

    // traverse the ancestry for the document (child -> parent)
    var ancestry = new bali.Stack();
    var parent = document.getValue('$parent');
    while (parent) {
        ancestry.addItem(parent);
        parent = nebula.retrieveDocument(parent).getValue('$parent');
    }

    // extract the literals, constants and procedures for the ancestors (parent -> child)
    var literals = new bali.Set();
    var constants = new bali.Set();
    var procedures = new bali.Catalog();
    var iterator = ancestry.getIterator();
    while (iterator.hasNext()) {
        var ancestor = iterator.getNext();
        type = nebula.retrieveType(ancestor);
        literals.addItems(type.getValue('$literals'));
        constants.addItems(type.getValue('$constants'));
        procedures.addItems(type.getValue('$procedures'));
    }

    // create the compilation type context
    type = new bali.Catalog();
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);
    type.setValue('$procedures', procedures);

    // compile each procedure defined in the document
    var association, name, procedure;
    procedures = new bali.Catalog();
    iterator = document.getValue('$procedures').getIterator();
    while (iterator.hasNext()) {

        // retrieve the source code for the procedure
        association = iterator.getNext();
        name = association.key;
        var source = association.value.getValue('$source');

        // compile the source code
        procedure = exports.compiler.compileProcedure(type, source);
        procedures.setValue(name, procedure);
    }

    // assemble the instructions for each compiled procedure
    iterator = procedures.getIterator();
    while (iterator.hasNext()) {

        // retrieve the compiled procedure
        association = iterator.getNext();
        name = association.key;
        procedure = association.value;

        // assemble the instructions in the procedure into bytecode
        exports.assembler.assembleProcedure(type, procedure);

        // add the assembled procedure to the type context
        type.getValue('$procedures').setValue(name, procedure);
    }

    // checkin the newly compiled type
    var typeCitation = nebula.commitType(citation, type);

    return typeCitation;
};
        
