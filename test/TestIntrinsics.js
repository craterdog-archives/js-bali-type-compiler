/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework').api();
const intrinsics = require('../src/Intrinsics').api();
const generator = bali.generator();
const angle = bali.angle.PI;
const binary = bali.binary(generator.generateBytes(10));
const complex = bali.component('(3, 4i)');
const duration = bali.component('~P1W');
const indentation = bali.number(4);
const moment = bali.moment();
const number = bali.number(0.5);
const tag = bali.tag();
const zero = bali.number(0);
const two = bali.number(2);
const probability = bali.probability(0.5);
const reference = bali.reference('https://google.com/advertizing?foo=bar#home');
const text = bali.text('This is text...');
const source = bali.text('/bali/collections/List');
const association = bali.association('$key', '"value"');
const catalog = bali.catalog();
const list = bali.list([1, 2, 3]);
const percent = bali.percent(25);
const queue = bali.queue();
const range = bali.range(1, 5);
const set = bali.set();
const stack = bali.stack();
const symbol = bali.component('$type');
const statements = bali.tree('/bali/composites/Statements');
const tree = bali.tree('/bali/collections/Tree');
const type = bali.component('/bali/collections/Set');
const version = bali.version([1, 2, 3]);
const iterator = list.getIterator();
const procedure = bali.procedure(statements, bali.catalog({$foo: 'bar'}));
const array = [];
const object = {};

describe('Bali Intrinsic Functions', function() {

    describe('Test each intrinsic function', function() {

        it('should fail to invoke invalid intrinsic functions', function() {
            expect(
                function() {
                    const index = intrinsics.index('$foobar');
                    intrinsics.invoke(index, 1, 2, 3);
                }
            ).to.throw();
            expect(
                function() {
                    const index = intrinsics.index('$invalid');
                    intrinsics.invoke(index, 1, 2, 3);
                }
            ).to.throw();
        });

        it('should invoke $addItem intrinsic function', function() {
            const index = intrinsics.index('$addItem');
            intrinsics.invoke(index, catalog, association);
            intrinsics.invoke(index, list, angle);
            intrinsics.invoke(index, set, number);
            intrinsics.invoke(index, queue, text);
            intrinsics.invoke(index, stack, symbol);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, '$foo');
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, array, probability);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, object, association);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, range, 6);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, association, 6);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'foobar', 6);
                }
            ).to.throw();
        });

        it('should invoke $addItems intrinsic function', function() {
            const index = intrinsics.index('$addItems');
            intrinsics.invoke(index, catalog, list);
            intrinsics.invoke(index, list, set);
            intrinsics.invoke(index, set, queue);
            intrinsics.invoke(index, queue, stack);
            intrinsics.invoke(index, stack, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, range, number);
                }
            ).to.throw();
        });

        it('should invoke $ancestry intrinsic function', function() {
            const index = intrinsics.index('$ancestry');
            intrinsics.invoke(index, angle);
            intrinsics.invoke(index, association);
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 6);
                }
            ).to.throw();
        });

        it('should invoke $and intrinsic function', function() {
            const index = intrinsics.index('$and');
            intrinsics.invoke(index, binary, binary);
            intrinsics.invoke(index, probability, probability);
            intrinsics.invoke(index, set, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, association);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, probability);
                }
            ).to.throw();
        });

        it('should invoke $arccosine intrinsic function', function() {
            const index = intrinsics.index('$arccosine');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $arcsine intrinsic function', function() {
            const index = intrinsics.index('$arcsine');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $arctangent intrinsic function', function() {
            const index = intrinsics.index('$arctangent');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle, angle);
                }
            ).to.throw();
        });

        it('should invoke $association intrinsic function', function() {
            const index = intrinsics.index('$association');
            intrinsics.invoke(index, number, list);
            intrinsics.invoke(index, symbol, text);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, symbol);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, symbol, 5);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'foo', number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, probability);
                }
            ).to.throw();
        });

        it('should invoke $authority intrinsic function', function() {
            const index = intrinsics.index('$authority');
            intrinsics.invoke(index, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $base2 intrinsic function', function() {
            const index = intrinsics.index('$base2');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, indentation);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, binary, 4);
                }
            ).to.throw();
        });

        it('should invoke $base16 intrinsic function', function() {
            const index = intrinsics.index('$base16');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, indentation);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, binary, 4);
                }
            ).to.throw();
        });

        it('should invoke $base32 intrinsic function', function() {
            const index = intrinsics.index('$base32');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, indentation);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, binary, 4);
                }
            ).to.throw();
        });

        it('should invoke $base64 intrinsic function', function() {
            const index = intrinsics.index('$base64');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, indentation);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, binary, 4);
                }
            ).to.throw();
        });

        it('should invoke $binary intrinsic function', function() {
            const index = intrinsics.index('$binary');
            intrinsics.invoke(index, two);
            intrinsics.invoke(index, two, bali.catalog({$encoding: '$base16'}));
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 10);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, two, {$encoding: '$base16'});
                }
            ).to.throw();
        });

        it('should invoke $boolean intrinsic function', function() {
            const index = intrinsics.index('$boolean');
            intrinsics.invoke(index, angle);
            intrinsics.invoke(index, number);
            intrinsics.invoke(index, association);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, range);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, false);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, [1, 2, 3]);
                }
            ).to.throw();
        });

        it('should invoke $bytes intrinsic function', function() {
            const index = intrinsics.index('$bytes');
            intrinsics.invoke(index, tag);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, binary);
                }
            ).to.throw();
        });

        it('should invoke $catalog intrinsic function', function() {
            const index = intrinsics.index('$catalog');
            intrinsics.invoke(index);
            intrinsics.invoke(index, set);
            intrinsics.invoke(index, list, bali.catalog({$type: '/bali/notary/Document'}));
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, type);
                }
            ).to.throw();
        });

        it('should invoke $coinToss intrinsic function', function() {
            const index = intrinsics.index('$coinToss');
            intrinsics.invoke(index, probability);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 0.5);
                }
            ).to.throw();
        });

        it('should invoke $comparison intrinsic function', function() {
            const index = intrinsics.index('$comparison');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, text, text);
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, two);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, two, 3);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 5, 6);
                }
            ).to.throw();
        });

        it('should invoke $complement intrinsic function', function() {
            const index = intrinsics.index('$complement');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 0);
                }
            ).to.throw();
        });

        it('should invoke $component intrinsic function', function() {
            const index = intrinsics.index('$component');
            intrinsics.invoke(index, source);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, '/bali/collections/List');
                }
            ).to.throw();
        });

        it('should invoke $concatenation intrinsic function', function() {
            const index = intrinsics.index('$concatenation');
            intrinsics.invoke(index, list, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, 5);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, set);
                }
            ).to.throw();
        });

        it('should invoke $conjugate intrinsic function', function() {
            const index = intrinsics.index('$conjugate');
            intrinsics.invoke(index, complex);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $containsAll intrinsic function', function() {
            const index = intrinsics.index('$containsAll');
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, [1, 2, 3]);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, association, symbol);
                }
            ).to.throw();
        });

        it('should invoke $containsAny intrinsic function', function() {
            const index = intrinsics.index('$containsAny');
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, [1, 2, 3]);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, association, symbol);
                }
            ).to.throw();
        });

        it('should invoke $containsItem intrinsic function', function() {
            const index = intrinsics.index('$containsItem');
            intrinsics.invoke(index, list, number);
            intrinsics.invoke(index, catalog, association);
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, association, symbol);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, 5);
                }
            ).to.throw();
        });

        it('should invoke $cosine intrinsic function', function() {
            const index = intrinsics.index('$cosine');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 0);
                }
            ).to.throw();
        });

        it('should invoke $default intrinsic function', function() {
            const index = intrinsics.index('$default');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, bali.pattern.NONE, angle);
            intrinsics.invoke(index, bali.pattern.NONE, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, undefined, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, bali.pattern.NONE, 5);
                }
            ).to.throw();
        });

        it('should invoke $degrees intrinsic function', function() {
            const index = intrinsics.index('$degrees');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 0);
                }
            ).to.throw();
        });

        it('should invoke $difference intrinsic function', function() {
            const index = intrinsics.index('$difference');
            intrinsics.invoke(index, angle, angle);
            intrinsics.invoke(index, duration, duration);
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, percent, percent);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, list);
                }
            ).to.throw();
        });

        it('should invoke $document intrinsic function', function() {
            const index = intrinsics.index('$document');
            intrinsics.invoke(index, number);
            intrinsics.invoke(index, number, indentation);
            intrinsics.invoke(index, text);
            intrinsics.invoke(index, text, indentation);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, list, indentation);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, '/bali/collections/List');
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, 5);
                }
            ).to.throw();
        });

        it('should invoke $duplicate intrinsic function', function() {
            const index = intrinsics.index('$duplicate');
            intrinsics.invoke(index, number);
            intrinsics.invoke(index, text);
            intrinsics.invoke(index, association);
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, [1, 2, 3]);
                }
            ).to.throw();
        });

        it('should invoke $duration intrinsic function', function() {
            const index = intrinsics.index('$duration');
            intrinsics.invoke(index, moment, moment);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, moment);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, moment, duration);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, duration, duration);
                }
            ).to.throw();
        });

        it('should invoke $earlier intrinsic function', function() {
            const index = intrinsics.index('$earlier');
            intrinsics.invoke(index, moment, duration);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, moment);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, moment, moment);
                }
            ).to.throw();
        });

        it('should invoke $equal intrinsic function', function() {
            const index = intrinsics.index('$equal');
            intrinsics.invoke(index, angle, angle);
            intrinsics.invoke(index, angle, number);
            intrinsics.invoke(index, list, set);
            intrinsics.invoke(index, catalog, association);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 5, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle, 0);
                }
            ).to.throw();
        });

        it('should invoke $exponential intrinsic function', function() {
            const index = intrinsics.index('$exponential');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number, probability);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number, 5);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 3, number);
                }
            ).to.throw();
        });

        it('should invoke $extraction intrinsic function', function() {
            const index = intrinsics.index('$extraction');
            intrinsics.invoke(index, catalog, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, list);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, catalog);
                }
            ).to.throw();
        });

        it('should invoke $factorial intrinsic function', function() {
            const index = intrinsics.index('$factorial');
            intrinsics.invoke(index, two);
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 5);
                }
            ).to.throw();
        });

        it('should invoke $format intrinsic function', function() {
            const index = intrinsics.index('$format');
            intrinsics.invoke(index, moment);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, duration);
                }
            ).to.throw();
        });

        it('should invoke $fragment intrinsic function', function() {
            const index = intrinsics.index('$fragment');
            intrinsics.invoke(index, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'https://google.com#home');
                }
            ).to.throw();
        });

        it('should invoke $getFirst intrinsic function', function() {
            const index = intrinsics.index('$getFirst');
            intrinsics.invoke(index, range);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $getHead intrinsic function', function() {
            const index = intrinsics.index('$getHead');
            intrinsics.invoke(index, queue);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, stack);
                }
            ).to.throw();
        });

        it('should invoke $getIndex intrinsic function', function() {
            const index = intrinsics.index('$getIndex');
            intrinsics.invoke(index, list, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability, 5);
                }
            ).to.throw();
        });

        it('should invoke $getItem intrinsic function', function() {
            const index = intrinsics.index('$getItem');
            intrinsics.invoke(index, list, two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, 5);
                }
            ).to.throw();
        });

        it('should invoke $getItems intrinsic function', function() {
            const index = intrinsics.index('$getItems');
            intrinsics.invoke(index, list, range);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, list);
                }
            ).to.throw();
        });

        it('should invoke $getLast intrinsic function', function() {
            const index = intrinsics.index('$getLast');
            intrinsics.invoke(index, range);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, stack);
                }
            ).to.throw();
        });

        it('should invoke $getNext intrinsic function', function() {
            const index = intrinsics.index('$getNext');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $getParameter intrinsic function', function() {
            const index = intrinsics.index('$getParameter');
            intrinsics.invoke(index, set, symbol);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, '$type');
                }
            ).to.throw();
        });

        it('should invoke $getPrevious intrinsic function', function() {
            const index = intrinsics.index('$getPrevious');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $getTop intrinsic function', function() {
            const index = intrinsics.index('$getTop');
            intrinsics.invoke(index, stack);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $getValue intrinsic function', function() {
            const index = intrinsics.index('$getValue');
            intrinsics.invoke(index, catalog, symbol);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, symbol);
                }
            ).to.throw();
        });

        it('should invoke $getValues intrinsic function', function() {
            const index = intrinsics.index('$getValues');
            intrinsics.invoke(index, catalog, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, symbol);
                }
            ).to.throw();
        });

        it('should invoke $hash intrinsic function', function() {
            const index = intrinsics.index('$hash');
            intrinsics.invoke(index, probability);
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index, 5);
                }
            ).to.throw();
        });

        it('should invoke $hasNext intrinsic function', function() {
            const index = intrinsics.index('$hasNext');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $hasPrevious intrinsic function', function() {
            const index = intrinsics.index('$hasPrevious');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $HTML intrinsic function', function() {
            const index = intrinsics.index('$HTML');
            intrinsics.invoke(index, catalog, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'This is a document');
                }
            ).to.throw();
        });

        it('should invoke $imaginary intrinsic function', function() {
            const index = intrinsics.index('$imaginary');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $insertItem intrinsic function', function() {
            const index = intrinsics.index('$insertItem');
            intrinsics.invoke(index, list, two, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, two, association);
                }
            ).to.throw();
        });

        it('should invoke $insertItems intrinsic function', function() {
            const index = intrinsics.index('$insertItems');
            intrinsics.invoke(index, list, two, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, 2, stack);
                }
            ).to.throw();
        });

        it('should invoke $interfaces intrinsic function', function() {
            const index = intrinsics.index('$interfaces');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 5);
                }
            ).to.throw();
        });

        it('should invoke $inverse intrinsic function', function() {
            const index = intrinsics.index('$inverse');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability);
                }
            ).to.throw();
        });

        it('should invoke $isEmpty intrinsic function', function() {
            const index = intrinsics.index('$isEmpty');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $isInfinite intrinsic function', function() {
            const index = intrinsics.index('$isInfinite');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $isParameterized intrinsic function', function() {
            const index = intrinsics.index('$isParameterized');
            intrinsics.invoke(index, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'foobar');
                }
            ).to.throw();
        });

        it('should invoke $isType intrinsic function', function() {
            const index = intrinsics.index('$isType');
            intrinsics.invoke(index, set, type);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, '/bali/collections/Set');
                }
            ).to.throw();
        });

        it('should invoke $isUndefined intrinsic function', function() {
            const index = intrinsics.index('$isUndefined');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $isZero intrinsic function', function() {
            const index = intrinsics.index('$isZero');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $iterator intrinsic function', function() {
            const index = intrinsics.index('$iterator');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability);
                }
            ).to.throw();
        });

        it('should invoke $key intrinsic function', function() {
            const index = intrinsics.index('$key');
            intrinsics.invoke(index, association);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog);
                }
            ).to.throw();
        });

        it('should invoke $keys intrinsic function', function() {
            const index = intrinsics.index('$keys');
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, association);
                }
            ).to.throw();
        });

        it('should invoke $later intrinsic function', function() {
            const index = intrinsics.index('$later');
            intrinsics.invoke(index, moment, duration);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, duration, duration);
                }
            ).to.throw();
        });

        it('should invoke $less intrinsic function', function() {
            const index = intrinsics.index('$less');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, angle, probability);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, duration, 0);
                }
            ).to.throw();
        });

        it('should invoke $levels intrinsic function', function() {
            const index = intrinsics.index('$levels');
            intrinsics.invoke(index, version);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'v1.2.3');
                }
            ).to.throw();
        });

        it('should invoke $list intrinsic function', function() {
            const index = intrinsics.index('$list');
            intrinsics.invoke(index);
            intrinsics.invoke(index, set);
            intrinsics.invoke(index, stack, bali.catalog({$type: '/bali/collections/List'}));
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, text);
                }
            ).to.throw();
        });

        it('should invoke $logarithm intrinsic function', function() {
            const index = intrinsics.index('$logarithm');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number, angle);
                }
            ).to.throw();
        });

        it('should invoke $magnitude intrinsic function', function() {
            const index = intrinsics.index('$magnitude');
            intrinsics.invoke(index, complex);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $matches intrinsic function', function() {
            const index = intrinsics.index('$matches');
            intrinsics.invoke(index, probability, bali.pattern.ANY);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, two, 2);
                }
            ).to.throw();
        });

        it('should invoke $more intrinsic function', function() {
            const index = intrinsics.index('$more');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, angle, probability);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, duration, 0);
                }
            ).to.throw();
        });

        it('should invoke $nextVersion intrinsic function', function() {
            const index = intrinsics.index('$nextVersion');
            intrinsics.invoke(index, version, two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, version, 2);
                }
            ).to.throw();
        });

        it('should invoke $not intrinsic function', function() {
            const index = intrinsics.index('$not');
            intrinsics.invoke(index, probability);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, true);
                }
            ).to.throw();
        });

        it('should invoke $now intrinsic function', function() {
            const index = intrinsics.index('$now');
            intrinsics.invoke(index);
        });

        it('should invoke $number intrinsic function', function() {
            const index = intrinsics.index('$number');
            intrinsics.invoke(index, angle);
            intrinsics.invoke(index, probability);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
        });

        it('should invoke $or intrinsic function', function() {
            const index = intrinsics.index('$or');
            intrinsics.invoke(index, probability, probability);
            intrinsics.invoke(index, set, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, probability);
                }
            ).to.throw();
        });

        it('should invoke $parameters intrinsic function', function() {
            const index = intrinsics.index('$parameters');
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 5);
                }
            ).to.throw();
        });

        it('should invoke $parent intrinsic function', function() {
            const index = intrinsics.index('$parent');
            intrinsics.invoke(index, tree);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $path intrinsic function', function() {
            const index = intrinsics.index('$path');
            intrinsics.invoke(index, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $phase intrinsic function', function() {
            const index = intrinsics.index('$phase');
            intrinsics.invoke(index, complex);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $probability intrinsic function', function() {
            const index = intrinsics.index('$probability');
            intrinsics.invoke(index);
        });

        it('should invoke $procedure intrinsic function', function() {
            const index = intrinsics.index('$procedure');
            intrinsics.invoke(index, statements);
            intrinsics.invoke(index, statements, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, tree);
                }
            ).to.throw();
        });

        it('should invoke $product intrinsic function', function() {
            const index = intrinsics.index('$product');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle, angle);
                }
            ).to.throw();
        });

        it('should invoke $query intrinsic function', function() {
            const index = intrinsics.index('$query');
            intrinsics.invoke(index, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $queue intrinsic function', function() {
            const index = intrinsics.index('$queue');
            intrinsics.invoke(index);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, queue, bali.catalog({$type: '/bali/collections/Queue'}));
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, text);
                }
            ).to.throw();
        });

        it('should invoke $quotient intrinsic function', function() {
            const index = intrinsics.index('$quotient');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability, probability);
                }
            ).to.throw();
        });

        it('should invoke $radians intrinsic function', function() {
            const index = intrinsics.index('$radians');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $range intrinsic function', function() {
            const index = intrinsics.index('$range');
            intrinsics.invoke(index, zero, two);
            intrinsics.invoke(index, zero, two, bali.catalog({$collection: [0, 1, 2]}));
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 0, 2);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, zero, two, text);
                }
            ).to.throw();
        });

        it('should invoke $real intrinsic function', function() {
            const index = intrinsics.index('$real');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $reciprocal intrinsic function', function() {
            const index = intrinsics.index('$reciprocal');
            intrinsics.invoke(index, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $remainder intrinsic function', function() {
            const index = intrinsics.index('$remainder');
            intrinsics.invoke(index, number, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability, probability);
                }
            ).to.throw();
        });

        it('should invoke $removeAll intrinsic function', function() {
            const index = intrinsics.index('$removeAll');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, range);
                }
            ).to.throw();
        });

        it('should invoke $removeHead intrinsic function', function() {
            const index = intrinsics.index('$removeHead');
            intrinsics.invoke(index, queue);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $removeIndex intrinsic function', function() {
            const index = intrinsics.index('$removeIndex');
            intrinsics.invoke(index, bali.list([1, 2, 3, 4, 5]), two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, symbol);
                }
            ).to.throw();
        });

        it('should invoke $removeItem intrinsic function', function() {
            const index = intrinsics.index('$removeItem');
            intrinsics.invoke(index, set, symbol);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, two);
                }
            ).to.throw();
        });

        it('should invoke $removeItems intrinsic function', function() {
            const index = intrinsics.index('$removeItems');
            intrinsics.invoke(index, set, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, set);
                }
            ).to.throw();
        });

        it('should invoke $removeRange intrinsic function', function() {
            const index = intrinsics.index('$removeRange');
            intrinsics.invoke(index, list, range);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, zero, two);
                }
            ).to.throw();
        });

        it('should invoke $removeTop intrinsic function', function() {
            const index = intrinsics.index('$removeTop');
            intrinsics.invoke(index, stack);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, queue);
                }
            ).to.throw();
        });

        it('should invoke $removeValue intrinsic function', function() {
            const index = intrinsics.index('$removeValue');
            intrinsics.invoke(index, catalog, symbol);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
        });

        it('should invoke $removeValues intrinsic function', function() {
            const index = intrinsics.index('$removeValues');
            intrinsics.invoke(index, catalog, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, set);
                }
            ).to.throw();
        });

        it('should invoke $reverseItems intrinsic function', function() {
            const index = intrinsics.index('$reverseItems');
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
        });

        it('should invoke $same intrinsic function', function() {
            const index = intrinsics.index('$same');
            intrinsics.invoke(index, probability, probability);
            intrinsics.invoke(index, angle, number);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, two, 2);
                }
            ).to.throw();
        });

        it('should invoke $sans intrinsic function', function() {
            const index = intrinsics.index('$sans');
            intrinsics.invoke(index, probability, probability);
            intrinsics.invoke(index, set, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, probability);
                }
            ).to.throw();
        });

        it('should invoke $scaled intrinsic function', function() {
            const index = intrinsics.index('$scaled');
            intrinsics.invoke(index, duration, number);
            intrinsics.invoke(index, angle, two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability, two);
                }
            ).to.throw();
        });

        it('should invoke $scheme intrinsic function', function() {
            const index = intrinsics.index('$scheme');
            intrinsics.invoke(index, reference);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $set intrinsic function', function() {
            const index = intrinsics.index('$set');
            intrinsics.invoke(index);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, stack, bali.catalog({$type: '/bali/collections/Set'}));
            expect(
                function() {
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, queue, text);
                }
            ).to.throw();
        });

        it('should invoke $setItem intrinsic function', function() {
            const index = intrinsics.index('$setItem');
            intrinsics.invoke(index, bali.list([0, 1, 2]), two, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, 2, probability);
                }
            ).to.throw();
        });

        it('should invoke $setValue intrinsic function', function() {
            const index = intrinsics.index('$setValue');
            intrinsics.invoke(index, catalog, symbol, text);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
        });

        it('should invoke $shuffleItems intrinsic function', function() {
            const index = intrinsics.index('$shuffleItems');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog);
                }
            ).to.throw();
        });

        it('should invoke $sine intrinsic function', function() {
            const index = intrinsics.index('$sine');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability);
                }
            ).to.throw();
        });

        it('should invoke $size intrinsic function', function() {
            const index = intrinsics.index('$size');
            intrinsics.invoke(index, symbol);
            intrinsics.invoke(index, text);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, stack);
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, [1, 2, 3]);
                }
            ).to.throw();
        });

        it('should invoke $sortItems intrinsic function', function() {
            const index = intrinsics.index('$sortItems');
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, catalog);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, queue);
                }
            ).to.throw();
        });

        it('should invoke $stack intrinsic function', function() {
            const index = intrinsics.index('$stack');
            intrinsics.invoke(index);
            intrinsics.invoke(index, list);
            intrinsics.invoke(index, stack, bali.catalog({$type: '/bali/collections/Stack'}));
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $statements intrinsic function', function() {
            const index = intrinsics.index('$statements');
            intrinsics.invoke(index, procedure);
            intrinsics.invoke(index, procedure, bali.catalog({$foo: 'bar'}));
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability);
                }
            ).to.throw();
        });

        it('should invoke $sum intrinsic function', function() {
            const index = intrinsics.index('$sum');
            intrinsics.invoke(index, duration, duration);
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, angle, angle);
            intrinsics.invoke(index, percent, percent);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, angle, two);
                }
            ).to.throw();
        });

        it('should invoke $supplement intrinsic function', function() {
            const index = intrinsics.index('$supplement');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, probability);
                }
            ).to.throw();
        });

        it('should invoke $supportsInterface intrinsic function', function() {
            const index = intrinsics.index('$supportsInterface');
            intrinsics.invoke(index, probability, type);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list, '/bali/interfaces/Sortable');
                }
            ).to.throw();
        });

        it('should invoke $tag intrinsic function', function() {
            const index = intrinsics.index('$tag');
            intrinsics.invoke(index, two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 20);
                }
            ).to.throw();
        });

        it('should invoke $tangent intrinsic function', function() {
            const index = intrinsics.index('$tangent');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $toEnd intrinsic function', function() {
            const index = intrinsics.index('$toEnd');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $toSlot intrinsic function', function() {
            const index = intrinsics.index('$toSlot');
            intrinsics.invoke(index, iterator, two);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, iterator);
                }
            ).to.throw();
        });

        it('should invoke $toStart intrinsic function', function() {
            const index = intrinsics.index('$toStart');
            intrinsics.invoke(index, iterator);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
        });

        it('should invoke $tree intrinsic function', function() {
            const index = intrinsics.index('$tree');
            intrinsics.invoke(index, type);
            intrinsics.invoke(index, type, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, list);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, type, text);
                }
            ).to.throw();
        });

        it('should invoke $type intrinsic function', function() {
            const index = intrinsics.index('$type');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, 'This is some text');
                }
            ).to.throw();
        });

        it('should invoke $validNextVersion intrinsic function', function() {
            const index = intrinsics.index('$validNextVersion');
            intrinsics.invoke(index, version, bali.version([1, 3]));
            intrinsics.invoke(index, version, bali.version([1, 2, 4]));
            intrinsics.invoke(index, version, bali.version([1, 2, 3, 1]));
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, version, 'v1.2.3.1');
                }
            ).to.throw();
        });

        it('should invoke $value intrinsic function', function() {
            const index = intrinsics.index('$value');
            intrinsics.invoke(index, association);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog);
                }
            ).to.throw();
        });

        it('should invoke $xor intrinsic function', function() {
            const index = intrinsics.index('$xor');
            intrinsics.invoke(index, probability, probability);
            intrinsics.invoke(index, set, set);
            expect(
                function() {
                    intrinsics.invoke(index);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, set, probability);
                }
            ).to.throw();
        });

    });

});
