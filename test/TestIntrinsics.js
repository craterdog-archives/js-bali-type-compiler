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
const association = bali.association('$key', '"value"');
const catalog = bali.catalog();
const list = bali.list();
const range = bali.range(1, 5);
const set = bali.set();
const queue = bali.queue();
const stack = bali.stack();
const tree = bali.tree();

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
            intrinsics.invoke(index, list, '/bali/collections/List');
            intrinsics.invoke(index, set, '$foo');
            intrinsics.invoke(index, queue, 13);
            intrinsics.invoke(index, stack, '$top');
        });

        it('should invoke $addItems intrinsic function', function() {
        });
        it('should invoke $ancestry intrinsic function', function() {
        });
        it('should invoke $and intrinsic function', function() {
        });
        it('should invoke $arccosine intrinsic function', function() {
        });
        it('should invoke $arcsine intrinsic function', function() {
        });
        it('should invoke $arctangent intrinsic function', function() {
        });
        it('should invoke $association intrinsic function', function() {
        });
        it('should invoke $authority intrinsic function', function() {
        });
        it('should invoke $base2 intrinsic function', function() {
        });
        it('should invoke $base16 intrinsic function', function() {
        });
        it('should invoke $base32 intrinsic function', function() {
        });
        it('should invoke $base64 intrinsic function', function() {
        });
        it('should invoke $binary intrinsic function', function() {
        });
        it('should invoke $boolean intrinsic function', function() {
        });
        it('should invoke $bytes intrinsic function', function() {
        });
        it('should invoke $catalog intrinsic function', function() {
        });
        it('should invoke $coinToss intrinsic function', function() {
        });
        it('should invoke $comparison intrinsic function', function() {
        });
        it('should invoke $complement intrinsic function', function() {
        });
        it('should invoke $component intrinsic function', function() {
        });
        it('should invoke $concatenation intrinsic function', function() {
        });
        it('should invoke $conjugate intrinsic function', function() {
        });
        it('should invoke $containsAll intrinsic function', function() {
        });
        it('should invoke $containsAny intrinsic function', function() {
        });
        it('should invoke $containsItem intrinsic function', function() {
        });
        it('should invoke $cosine intrinsic function', function() {
        });
        it('should invoke $default intrinsic function', function() {
        });
        it('should invoke $degrees intrinsic function', function() {
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
