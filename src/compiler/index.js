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

const bali = require('bali-component-framework');
const utilities = require('../utilities');


// EXPORTS

exports.Assembler = require('./Assembler').Assembler;
exports.Compiler = require('./Compiler').Compiler;


// FUNCTIONS

/**
 * This function compiles a type definition residing in the Bali Nebula™ and returns
 * a document citation to the newly compiled type.  The type definition must be a
 * committed document in the Bali Nebula™.
 * 
 * @param {Object} nebula A JavaScript object that implements the Bali Nebula API™.
 * @param {Catalog} citation A Bali document citation to the type definition.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Catalog} A Bali document citation to the newly compiled type.
 */
exports.compile = async function(nebula, citation, debug) {
    const compiler = new exports.Compiler();
    const assembler = new exports.Assembler();

    // retrieve the type document
    const document = await nebula.retrieveDocument(citation);
    const parameters = document.getParameters();

    // extract the literals, constants and procedures for the parent type
    const literals = bali.list();
    const constants = bali.catalog();
    var procedures = bali.catalog();
    citation = document.getValue('$parent');
    if (citation) {
        // TODO: This is a citation to the parent type definition document, not the compiled
        //       type so its digest will not match the parent type.  How do we address this in
        //       a way that preserves the merkle pointer chain?
        citation.setValue('$digest', bali.NONE);

        // retrieve the compiled parent type
        const parent = await nebula.retrieveDocument(citation);
        literals.addItems(parent.getValue('$literals'));
        constants.addItems(parent.getValue('$constants'));
        procedures.addItems(parent.getValue('$procedures'));
    }

    // add in the constants from the child type document
    const items = document.getValue('$constants');
    if (items) constants.addItems(items);

    // create the compilation type context
    const type = bali.catalog([], bali.parameters({
        $type: parameters.getParameter('$type'),
        $name: parameters.getParameter('$name'),
        $tag: parameters.getParameter('$tag'),
        $version: parameters.getParameter('$version'),
        $permissions: parameters.getParameter('$permissions'),
        $previous: parameters.getParameter('$previous')
    }));
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);
    type.setValue('$procedures', procedures);

    // compile each procedure defined in the type definition document
    var association, name, procedure;
    procedures = document.getValue('$procedures');
    if (procedures) {
        // iterate through procedure definitions
        var iterator = procedures.getIterator();
        procedures = bali.catalog();  // for compiled procedures
        while (iterator.hasNext()) {

            // retrieve the source code for the procedure
            association = iterator.getNext();
            name = association.getKey();
            const source = association.getValue().getValue('$source');

            // compile the source code
            procedure = compiler.compileProcedure(type, source);
            procedures.setValue(name, procedure);  // compiled procedure
        }

        // iterate through the compiled procedures
        iterator = procedures.getIterator();
        while (iterator.hasNext()) {

            // retrieve the compiled procedure
            association = iterator.getNext();
            name = association.getKey();
            procedure = association.getValue();

            // assemble the instructions in the procedure into bytecode
            assembler.assembleProcedure(type, procedure);

            // add the assembled procedure to the type context
            type.getValue('$procedures').setValue(name, procedure);
        }
    }

    // checkin the newly compiled type
    citation = await nebula.commitDocument(type);

    return citation;
};
