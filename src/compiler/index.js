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

    // retrieve the type document
    var document = nebula.retrieveDocument(citation);

    // extract the literals, constants and procedures for the parent type
    var literals = new bali.List();
    var constants = new bali.Catalog();
    var procedures = new bali.Catalog();
    var parent = document.getValue('$parent');
    if (parent) {
        parent = nebula.retrieveType(parent).getValue('$parent');
        literals.addItems(parent.getValue('$literals'));
        constants.addItems(parent.getValue('$constants'));
        procedures.addItems(parent.getValue('$procedures'));
    }

    // add in the constants from the child type document
    var items = document.getValue('$constants');
    if (items) constants.addItems(items);

    // create the compilation type context
    var type = new bali.Catalog();
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);
    type.setValue('$procedures', procedures);

    // compile each procedure defined in the type document
    var association, name, procedure;
    procedures = new bali.Catalog();
    var iterator = document.getValue('$procedures').getIterator();
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
        
