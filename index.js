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

var utilities = require('./src/utilities/');
exports.types = utilities.types;
exports.bytecode = utilities.bytecode;
exports.intrinsics = utilities.intrinsics;
exports.parser = utilities.parser;
exports.formatter = utilities.formatter;

var compiler = require('./src/compiler/');
exports.Assembler = compiler.Assembler;
exports.Compiler = compiler.Compiler;
exports.assembler = compiler.assembler;
exports.compiler = compiler.compiler;

var processor = require('./src/processor/');
exports.Processor = processor.Processor;