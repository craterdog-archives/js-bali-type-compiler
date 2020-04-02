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
const bali = require('bali-component-framework').api(1);
const intrinsics = require('../src/Intrinsics').api(1);
const generator = bali.generator();
const angle = bali.angle.PI;
const binary = bali.binary(generator.generateBytes(10));
const complex = bali.component('(3, 4i)');
const number = bali.number(0.5);
const tag = bali.tag();
const two = bali.number(2);
const probability = bali.probability(0.5);
const reference = bali.reference('https://google.com/advertizing?foo=bar');
const text = bali.text('This is text...');
const source = bali.text('/bali/collections/List');
const association = bali.association('$key', '"value"');
const catalog = bali.catalog();
const list = bali.list();
const range = bali.range(1, 5);
const set = bali.set();
const queue = bali.queue();
const stack = bali.stack();
const tree = bali.tree('/bali/composites/Statements');
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
            intrinsics.invoke(index, list, bali.component('/bali/collections/List'));
            intrinsics.invoke(index, set, bali.component('$foo'));
            intrinsics.invoke(index, queue, bali.number(13));
            intrinsics.invoke(index, stack, bali.component('$top'));
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
            /* TODO: uncomment once bug in Range is fixed
            expect(
                function() {
                    intrinsics.invoke(index, range, 6);
                }
            ).to.throw();
            */
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
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
        });

        it('should invoke $ancestry intrinsic function', function() {
            const index = intrinsics.index('$ancestry');
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index, 6);
                }
            ).to.throw();
        });

        it('should invoke $and intrinsic function', function() {
            const index = intrinsics.index('$and');
            intrinsics.invoke(index, set, set);
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
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $arcsine intrinsic function', function() {
            const index = intrinsics.index('$arcsine');
            intrinsics.invoke(index, number);
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
                    intrinsics.invoke(index, number, angle);
                }
            ).to.throw();
        });

        it('should invoke $association intrinsic function', function() {
            const index = intrinsics.index('$association');
            intrinsics.invoke(index, number, list);
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
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $base2 intrinsic function', function() {
            const index = intrinsics.index('$base2');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, two);
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $base16 intrinsic function', function() {
            const index = intrinsics.index('$base16');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, two);
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $base32 intrinsic function', function() {
            const index = intrinsics.index('$base32');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, two);
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $base64 intrinsic function', function() {
            const index = intrinsics.index('$base64');
            intrinsics.invoke(index, binary);
            intrinsics.invoke(index, binary, two);
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
        });

        it('should invoke $binary intrinsic function', function() {
            const index = intrinsics.index('$binary');
            intrinsics.invoke(index, two);
            intrinsics.invoke(index, two, bali.catalog({$encoding: '$base16'}));
            expect(
                function() {
                    intrinsics.invoke(index, set);
                }
            ).to.throw();
        });

        it('should invoke $boolean intrinsic function', function() {
            const index = intrinsics.index('$boolean');
            intrinsics.invoke(index, number);
            intrinsics.invoke(index, list);
            expect(
                function() {
                    intrinsics.invoke(index, false);
                }
            ).to.throw();
        });

        it('should invoke $bytes intrinsic function', function() {
            const index = intrinsics.index('$bytes');
            intrinsics.invoke(index, tag);
            expect(
                function() {
                    intrinsics.invoke(index, binary);
                }
            ).to.throw();
        });

        it('should invoke $catalog intrinsic function', function() {
            const index = intrinsics.index('$catalog');
            intrinsics.invoke(index);
            intrinsics.invoke(index, catalog);
            intrinsics.invoke(index, catalog, bali.catalog({$type: '/bali/notary/Document'}));
            expect(
                function() {
                    intrinsics.invoke(index, text);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, catalog, text);
                }
            ).to.throw();
        });

        it('should invoke $coinToss intrinsic function', function() {
            const index = intrinsics.index('$coinToss');
            intrinsics.invoke(index, probability);
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $comparison intrinsic function', function() {
            const index = intrinsics.index('$comparison');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, text, text);
            expect(
                function() {
                    intrinsics.invoke(index, 5, 6);
                }
            ).to.throw();
            expect(
                function() {
                    intrinsics.invoke(index, text, number);
                }
            ).to.throw();
        });

        it('should invoke $complement intrinsic function', function() {
            const index = intrinsics.index('$complement');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $component intrinsic function', function() {
            const index = intrinsics.index('$component');
            intrinsics.invoke(index, source);
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
                    intrinsics.invoke(index, angle);
                }
            ).to.throw();
        });

        it('should invoke $containsAll intrinsic function', function() {
            const index = intrinsics.index('$containsAll');
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
        });

        it('should invoke $containsAny intrinsic function', function() {
            const index = intrinsics.index('$containsAny');
            intrinsics.invoke(index, list, set);
            expect(
                function() {
                    intrinsics.invoke(index, catalog, association);
                }
            ).to.throw();
        });

        it('should invoke $containsItem intrinsic function', function() {
            const index = intrinsics.index('$containsItem');
            intrinsics.invoke(index, list, number);
            intrinsics.invoke(index, catalog, association);
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
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $default intrinsic function', function() {
            const index = intrinsics.index('$default');
            intrinsics.invoke(index, number, number);
            intrinsics.invoke(index, bali.pattern.NONE, angle);
            expect(
                function() {
                    intrinsics.invoke(index, undefined, number);
                }
            ).to.throw();
        });

        it('should invoke $degrees intrinsic function', function() {
            const index = intrinsics.index('$degrees');
            intrinsics.invoke(index, angle);
            expect(
                function() {
                    intrinsics.invoke(index, number);
                }
            ).to.throw();
        });

        it('should invoke $difference intrinsic function', function() {
        });

        it('should invoke $document intrinsic function', function() {
        });

        it('should invoke $duplicate intrinsic function', function() {
        });

        it('should invoke $duration intrinsic function', function() {
        });

        it('should invoke $earlier intrinsic function', function() {
        });

        it('should invoke $equal intrinsic function', function() {
        });

        it('should invoke $exponential intrinsic function', function() {
        });

        it('should invoke $extraction intrinsic function', function() {
        });

        it('should invoke $factorial intrinsic function', function() {
        });

        it('should invoke $format intrinsic function', function() {
        });

        it('should invoke $fragment intrinsic function', function() {
        });

        it('should invoke $getFirst intrinsic function', function() {
        });

        it('should invoke $getHead intrinsic function', function() {
        });
        it('should invoke $getIndex intrinsic function', function() {
        });
        it('should invoke $getItem intrinsic function', function() {
        });
        it('should invoke $getItems intrinsic function', function() {
        });
        it('should invoke $getLast intrinsic function', function() {
        });
        it('should invoke $getNext intrinsic function', function() {
        });
        it('should invoke $getParameter intrinsic function', function() {
        });
        it('should invoke $getPrevious intrinsic function', function() {
        });
        it('should invoke $getTop intrinsic function', function() {
        });
        it('should invoke $getValue intrinsic function', function() {
        });
        it('should invoke $getValues intrinsic function', function() {
        });
        it('should invoke $hash intrinsic function', function() {
        });
        it('should invoke $hasNext intrinsic function', function() {
        });
        it('should invoke $hasPrevious intrinsic function', function() {
        });
        it('should invoke $HTML intrinsic function', function() {
        });
        it('should invoke $imaginary intrinsic function', function() {
        });
        it('should invoke $insertItem intrinsic function', function() {
        });
        it('should invoke $insertItems intrinsic function', function() {
        });
        it('should invoke $interfaces intrinsic function', function() {
        });
        it('should invoke $inverse intrinsic function', function() {
        });
        it('should invoke $isEmpty intrinsic function', function() {
        });
        it('should invoke $isInfinite intrinsic function', function() {
        });
        it('should invoke $isParameterized intrinsic function', function() {
        });
        it('should invoke $isType intrinsic function', function() {
        });
        it('should invoke $isUndefined intrinsic function', function() {
        });
        it('should invoke $isZero intrinsic function', function() {
        });
        it('should invoke $iterator intrinsic function', function() {
        });
        it('should invoke $key intrinsic function', function() {
        });
        it('should invoke $keys intrinsic function', function() {
        });
        it('should invoke $later intrinsic function', function() {
        });
        it('should invoke $less intrinsic function', function() {
        });
        it('should invoke $levels intrinsic function', function() {
        });
        it('should invoke $list intrinsic function', function() {
        });
        it('should invoke $logarithm intrinsic function', function() {
        });
        it('should invoke $magnitude intrinsic function', function() {
        });
        it('should invoke $matches intrinsic function', function() {
        });
        it('should invoke $more intrinsic function', function() {
        });
        it('should invoke $nextVersion intrinsic function', function() {
        });
        it('should invoke $not intrinsic function', function() {
        });
        it('should invoke $now intrinsic function', function() {
        });
        it('should invoke $number intrinsic function', function() {
        });
        it('should invoke $or intrinsic function', function() {
        });
        it('should invoke $parameters intrinsic function', function() {
        });
        it('should invoke $parent intrinsic function', function() {
        });
        it('should invoke $path intrinsic function', function() {
        });
        it('should invoke $phase intrinsic function', function() {
        });
        it('should invoke $probability intrinsic function', function() {
        });
        it('should invoke $procedure intrinsic function', function() {
        });
        it('should invoke $product intrinsic function', function() {
        });
        it('should invoke $query intrinsic function', function() {
        });
        it('should invoke $queue intrinsic function', function() {
        });
        it('should invoke $quotient intrinsic function', function() {
        });
        it('should invoke $radians intrinsic function', function() {
        });
        it('should invoke $range intrinsic function', function() {
        });
        it('should invoke $real intrinsic function', function() {
        });
        it('should invoke $reciprocal intrinsic function', function() {
        });
        it('should invoke $remainder intrinsic function', function() {
        });
        it('should invoke $removeAll intrinsic function', function() {
        });
        it('should invoke $removeHead intrinsic function', function() {
        });
        it('should invoke $removeIndex intrinsic function', function() {
        });
        it('should invoke $removeItem intrinsic function', function() {
        });
        it('should invoke $removeItems intrinsic function', function() {
        });
        it('should invoke $removeRange intrinsic function', function() {
        });
        it('should invoke $removeTop intrinsic function', function() {
        });
        it('should invoke $removeValue intrinsic function', function() {
        });
        it('should invoke $removeValues intrinsic function', function() {
        });
        it('should invoke $reverseItems intrinsic function', function() {
        });
        it('should invoke $same intrinsic function', function() {
        });
        it('should invoke $sans intrinsic function', function() {
        });
        it('should invoke $scaled intrinsic function', function() {
        });
        it('should invoke $scheme intrinsic function', function() {
        });
        it('should invoke $set intrinsic function', function() {
        });
        it('should invoke $setItem intrinsic function', function() {
        });
        it('should invoke $setValue intrinsic function', function() {
        });
        it('should invoke $shuffleItems intrinsic function', function() {
        });
        it('should invoke $sine intrinsic function', function() {
        });
        it('should invoke $size intrinsic function', function() {
        });
        it('should invoke $sortItems intrinsic function', function() {
        });
        it('should invoke $stack intrinsic function', function() {
        });
        it('should invoke $statements intrinsic function', function() {
        });
        it('should invoke $sum intrinsic function', function() {
        });
        it('should invoke $supplement intrinsic function', function() {
        });
        it('should invoke $supportsInterface intrinsic function', function() {
        });
        it('should invoke $tag intrinsic function', function() {
        });
        it('should invoke $tangent intrinsic function', function() {
        });
        it('should invoke $toEnd intrinsic function', function() {
        });
        it('should invoke $toSlot intrinsic function', function() {
        });
        it('should invoke $toStart intrinsic function', function() {
        });
        it('should invoke $tree intrinsic function', function() {
        });
        it('should invoke $type intrinsic function', function() {
        });
        it('should invoke $validNextVersion intrinsic function', function() {
        });
        it('should invoke $value intrinsic function', function() {
        });
        it('should invoke $xor intrinsic function', function() {
        });

    });

});
